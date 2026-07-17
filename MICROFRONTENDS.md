# A guided tour of the microfrontends setup

Read `LEARNING.md` first if you haven't — this builds directly on it.

## 1. Monorepo vs microfrontends (untangling the two)

They answer different questions and are often confused because they usually
appear together:

- **Monorepo** — a *development-time* idea: how do we organise the code?
  One repo, many packages. Says nothing about how things run.
- **Microfrontends** — a *runtime* idea: how do we serve the site?
  One website, one domain, but composed of **independently deployed apps**,
  usually owned by different teams. The docs team ships without waiting for —
  or risking — the web team's app, and vice versa.

This repo is now both: a monorepo *containing* two microfrontends.

## 2. The two families of microfrontends

The other term you were reaching for is almost certainly **Module Federation**.
There are two fundamentally different ways to do microfrontends:

1. **Route-based composition** (what we built). Each app owns *paths*:
   `web` owns `/`, `docs` owns `/docs/*`. A router in front of both decides,
   per request, which app answers. Apps stay whole, normal applications;
   crossing between them is a real page navigation. Next.js calls this
   *multi-zones*; Vercel's platform version is what's wired here.

2. **Module Federation** (Webpack/Rspack technology). Composition happens
   *inside one page*: app A loads app B's components **at runtime over the
   network** — e.g. the checkout team's `<Basket />` rendering live inside the
   storefront's page, fetched from the checkout team's latest deployment.
   Far more powerful (one page, many teams) and far more complex: shared
   dependency version negotiation, runtime failures when a remote is down,
   careful contract discipline.

Rule of thumb: route-based composition covers most real needs and is
operationally boring (good). Module Federation is for when independently
deployed teams must share *a single page*.

## 3. The anatomy of what we built

```
Browser → local proxy :3024 (in production: Vercel's edge network)
            ├── /docs, /docs/*  → apps/docs  (Next.js on :3001)
            └── everything else → apps/web   (Next.js on :3000)
```

### `apps/web/microfrontends.json` — the routing manifest

The single source of truth for who owns what:

```jsonc
{
  "applications": {
    "web": {                       // no "routing" key ⇒ the DEFAULT app:
      "development": {             // serves everything unclaimed
        "local": 3000,
        "fallback": "learn-mfes-web.vercel.app"  // used once deployed (see §5)
      }
    },
    "docs": {                      // has "routing" ⇒ a CHILD app
      "development": { "local": 3001 },
      "routing": [{ "paths": ["/docs", "/docs/:path*"] }]
    }
  }
}
```

It lives in the **default app** because that app is the fallback owner of the
domain. Path expressions must not overlap — every path maps to exactly one app.

### `withMicrofrontends` in each `next.config.js`

One-line wrapper that makes each app microfrontend-aware. Its most important
job is the **asset prefix**: both apps want to serve JS/CSS from `/_next/...`,
which would collide on a shared domain. The wrapper gives each child app a
unique prefix — check the page source on `/docs` and you'll see its scripts
load from `/vc-ap-e3e2a9/_next/...` while the home page uses plain `/_next/...`.

### The docs app serves at `/docs`, not `/`

Its page lives at `apps/docs/app/docs/page.tsx`. Routing sends the *original*
path through, so the app must genuinely have pages at the paths it claims.
(Visiting :3001 directly at `/` now 404s — the app only exists to serve `/docs`.)

### Crossing the boundary is a hard navigation

Each app is a separate React tree, so moving from `/` to `/docs` is a full
page load — client-side routing cannot cross apps. Two things soften this:

- `<Link>` from `@vercel/microfrontends/next/client` — drop-in replacement
  that knows which hrefs are cross-app.
- `<PrefetchCrossZoneLinks />` in each layout — prefetches/prerenders
  cross-app destinations in the background so the hard navigation feels instant.

This is also why each app has its own `layout.tsx`: **nothing React-ish is
shared at runtime**. What *is* shared — `@repo/ui`, the configs — is shared at
build time through the monorepo. Each app compiles its own copy. (Monorepo and
microfrontends solving complementary halves of the sharing problem.)

### The local dev proxy

`pnpm dev` → Turborepo spots `microfrontends.json` → starts both dev servers
*plus* a proxy on **:3024** that mimics what Vercel's network does in
production. Always browse via :3024. Bonus: if you run only one app
(`turbo dev --filter=docs`), the proxy sends the *other* app's paths to its
deployed `fallback` URL — you develop your slice without running everyone
else's apps. That's the feature that makes this scale to big teams.

## 4. Things to try

1. `pnpm dev`, open **http://localhost:3024** — blue page from `web`. Click
   through to `/docs` — green page from `docs`. One origin, two servers.
2. **View page source** on each and compare the script URLs (asset prefixes).
3. **Claim a new path.** Add `"/blog/:path*"` to docs' `paths`, create
   `apps/docs/app/blog/page.tsx`, restart dev — `/blog` now belongs to docs.
4. **Break the isolation on purpose.** Stop docs (`pkill -f "port 3001"`) —
   `/` still works fine; `/docs` fails (locally there's no real fallback
   deployment). Teams' failures stay contained.
5. **Watch routing decisions.** Restart with `MFE_DEBUG=1 pnpm dev` and the
   proxy logs which app served each request and why.

## 5. What production looks like

Locally the proxy plays the router. In production, Vercel's edge network *is*
the router. The missing steps (need a Vercel account, both apps as projects):

1. Create the two projects and group them: `vercel microfrontends create-group`.
2. Set `web`'s real production URL as the `fallback` in `microfrontends.json`.
3. Deploy. Point the domain at `web`; Vercel reads the deployed manifest and
   routes `/docs/*` to the docs project at the edge.

Then each project deploys on its own cadence, with its own rollbacks — the
actual point of the whole exercise.

## 6. Honest trade-offs

Microfrontends buy team independence and pay for it in complexity: hard
navigations at boundaries, duplicated framework bytes (each app ships its own
React), design drift risk, and more infrastructure to reason about. The
standard advice: one team → one app, no microfrontends; many teams shipping
one product with painful deploy coupling → this pattern earns its keep.
