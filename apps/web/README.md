# apps/web — the default microfrontend

The Next.js app that owns the domain. It has two distinguishing features:

- **It carries `microfrontends.json`**, the routing manifest for the whole
  group — the file that says which app owns which paths.
- **It has no `routing` entry of its own**, which is precisely what makes it
  the *default* app: it serves every path no other microfrontend has claimed
  (here, that includes `/`).

In development it runs on port **3000**, but you should browse via the local
proxy on **http://localhost:3024**, which composes this app with `apps/docs`
into one site (start everything with `pnpm dev` at the repo root).

Full walkthrough: [`MICROFRONTENDS.md`](../../MICROFRONTENDS.md) at the repo
root, with the monorepo groundwork in [`LEARNING.md`](../../LEARNING.md).
