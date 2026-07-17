# frontend-guild 🏰

A hands-on learning playground built in three chapters, each with a guided
tour written alongside the code:

1. **Monorepos** (`LEARNING.md`) — pnpm workspaces + Turborepo: two Next.js
   apps sharing packages, task graphs, and remote-cache-grade build caching.
2. **Microfrontends** (`MICROFRONTENDS.md`) — the same two apps composed into
   one site on one origin, each independently deployable, via
   `@vercel/microfrontends` and a local routing proxy.
3. **Design patterns** (`DESIGN-PATTERNS.md`) — Singleton, Factory, Builder,
   and Observer implemented as a small RPG story in
   `packages/design-patterns`.

## Quick start

```sh
pnpm install

# Chapter 1 & 2: the composed site (web on /, docs on /docs)
pnpm dev            # then open http://localhost:3024

# Chapter 3: the design patterns story
pnpm --filter @repo/design-patterns demo

# The monorepo party tricks
pnpm build && pnpm build   # second run: FULL TURBO (cache hit in ~10ms)
pnpm check-types
pnpm lint
```

## Layout

```
apps/
  web/                     # default microfrontend — serves /
  docs/                    # child microfrontend — owns /docs/*
packages/
  ui/                      # shared React components
  design-patterns/         # chapter 3, runnable via `demo` script
  eslint-config/           # shared lint rules
  typescript-config/       # shared tsconfig bases
```

Built while learning, with the docs written as the code took shape — read the
three chapter files in order and run everything as you go.
