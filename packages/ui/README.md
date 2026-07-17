# @repo/ui

The shared component library — the monorepo's "aha" package. Both apps depend
on it via `"@repo/ui": "workspace:*"`, which pnpm resolves to a symlink into
this folder: edit `src/button.tsx` and both apps hot-reload at once.

It ships raw `.tsx` straight from `src/` (see `exports` in `package.json`) —
no build step; each consuming app compiles its own copy. This is the
*internal package* pattern: fine for code shared inside one repo, and the
reason a Button rendered by the `web` microfrontend and one rendered by
`docs` are compiled twice from the same source.

Background: [`LEARNING.md`](../../LEARNING.md) §3, and the build-time vs
runtime sharing discussion in [`MICROFRONTENDS.md`](../../MICROFRONTENDS.md).
