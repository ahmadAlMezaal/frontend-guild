# apps/docs — a child microfrontend

A separate Next.js app that owns the **`/docs`** path. The claim is made in
`apps/web/microfrontends.json` (`"paths": ["/docs", "/docs/:path*"]`), and
this app's pages genuinely live at that path — see `app/docs/page.tsx` —
because routing forwards the original URL untouched.

Consequences worth noticing:

- Visiting this app's own root (`/` on port **3001**) 404s: the app exists
  only to serve the paths it claims.
- Its static assets are served under a unique prefix (`/vc-ap-…/_next/…`) so
  they never collide with the default app's on the shared domain.
- In production it would deploy independently of `apps/web` — that
  independence is the point of the pattern.

Browse via the proxy at **http://localhost:3024/docs** (`pnpm dev` at the
repo root). Full walkthrough: [`MICROFRONTENDS.md`](../../MICROFRONTENDS.md).
