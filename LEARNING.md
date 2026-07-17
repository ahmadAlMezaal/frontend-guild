# A guided tour of this monorepo

You are looking at the standard modern JavaScript monorepo: **pnpm workspaces** for
linking packages together, and **Turborepo** for running tasks across them. This
document explains every moving part, in the order that makes sense to learn them.

## 1. What is a monorepo, actually?

One git repository containing **several packages that are developed together**:

```
learn-mfes/
├── apps/
│   ├── web/      → a Next.js app  (deployable, runs on :3000)
│   └── docs/     → a Next.js app  (deployable, runs on :3001)
├── packages/
│   ├── ui/                 → shared React components (Button, Card, Code)
│   ├── eslint-config/      → shared lint rules
│   └── typescript-config/  → shared tsconfig bases
├── pnpm-workspace.yaml     → tells pnpm where the packages live
├── turbo.json              → tells Turborepo how tasks relate to each other
└── package.json            → root: scripts + tooling shared by everyone
```

The convention: **`apps/` contains things you deploy, `packages/` contains things
apps share.** Neither app knows about the other; both depend on `@repo/ui`.

The problem this solves: without a monorepo, sharing `Button` between two apps
means publishing `@repo/ui` to npm, versioning it, and bumping the version in both
apps every time it changes. Here, a change to `packages/ui/src/button.tsx` is
visible in both apps *instantly* — same commit, same PR, no publishing.

## 2. Layer one: pnpm workspaces (the linking)

`pnpm-workspace.yaml` is just:

```yaml
packages:
  - "apps/*"
  - "packages/*"
```

Every folder matching those globs that has a `package.json` becomes a **workspace
package**. Now look at `apps/web/package.json`:

```json
"dependencies": {
  "@repo/ui": "workspace:*"
}
```

`workspace:*` is the whole trick. It means: *do not download this from npm — symlink
it from this repo*. Check it yourself:

```sh
ls -la apps/web/node_modules/@repo/
# ui -> ../../../../packages/ui
```

So `import { Button } from "@repo/ui/button"` in `web` resolves straight to
`packages/ui/src/button.tsx`. Edit the source file, both apps hot-reload.

Two more things pnpm gives you:

- **One install for everything.** `pnpm install` at the root installs all
  dependencies for every package, de-duplicated into a single store.
- **Filtering.** Run a script in one package from the root:
  `pnpm --filter web dev`, or `pnpm --filter @repo/ui lint`.

## 3. Layer two: the shared packages

Open `packages/ui/package.json`:

```json
"name": "@repo/ui",
"exports": { "./*": "./src/*.tsx" }
```

- `@repo/` is just a namespace convention so internal packages are obviously
  internal (some repos use the company name, e.g. `@acme/`).
- `exports` maps `@repo/ui/button` → `src/button.tsx`. Notice it ships **raw
  TypeScript** — no build step. The consuming Next.js apps compile it as part of
  their own build. This is called an *internal package* and it keeps things simple;
  packages only need their own build step when published externally or shared
  across different bundlers.

`@repo/typescript-config` and `@repo/eslint-config` are the same idea applied to
configuration: `apps/web/tsconfig.json` is three lines because it just extends
`@repo/typescript-config/nextjs.json`. Fix a rule once, every package gets it.

## 4. Layer three: Turborepo (the task runner)

pnpm links packages; it doesn't know that `web`'s build *depends on* `ui`. That's
Turborepo's job. Root scripts like `pnpm build` run `turbo run build`, and
`turbo.json` describes how tasks relate:

```json
"build": {
  "dependsOn": ["^build"],
  "outputs": [".next/**", "!.next/cache/**"]
}
```

- **`dependsOn: ["^build"]`** — the `^` means "my dependencies". Before building
  `web`, first build everything `web` depends on. Turbo derives the graph from the
  `package.json` dependencies and runs whatever it can **in parallel** (e.g. `web`
  and `docs` build simultaneously, since neither depends on the other).
- **`outputs`** — what the task produces, which is what makes **caching** work.
  Turbo hashes a task's inputs (source files, dependencies, env vars). Same hash →
  skip the task and restore the outputs from cache. That's why the second
  `pnpm build` here took **8ms** instead of 5.5s (`FULL TURBO`).
  Change one file in `apps/docs` and rebuild: `docs` rebuilds, `web` comes from
  cache. On a team, Remote Caching shares this cache with CI and colleagues —
  if anyone has built it, nobody builds it again.
- **`"dev": { "cache": false, "persistent": true }`** — dev servers run forever
  and shouldn't be cached, so they're marked persistent.

## 5. Things to try

1. **The shared-code moment.** Run `pnpm dev`, open :3000 and :3001, then change
   the text in `packages/ui/src/button.tsx`. Both apps update live.
2. **Scoped runs.** `pnpm --filter web dev` (one app), `turbo run build --filter=docs`.
3. **Watch the cache be smart.** `pnpm build` twice; then touch a file in
   `apps/web` and build again — only `web` rebuilds.
4. **See the graph.** `pnpm turbo run build --graph` prints the task graph.
5. **Add a package.** Create `packages/utils/` with a `package.json` named
   `@repo/utils` and a `src/format.ts`; add `"@repo/utils": "workspace:*"` to an
   app, run `pnpm install`, import it. That's the entire workflow.

## 6. Where microfrontends fit (the sequel)

A monorepo is *one repo, many packages, deployed however you like*. Microfrontends
are about the **runtime**: composing one website out of independently deployed
apps — e.g. `/` served by `web` while `/docs` is served by `docs`, each deployable
on its own. The two ideas pair naturally: this repo's `apps/web` + `apps/docs` +
shared `@repo/ui` is precisely the starting shape for microfrontends (via Next.js
multi-zones or Vercel's microfrontends tooling).

**Update: the sequel now exists — see `MICROFRONTENDS.md`.**
