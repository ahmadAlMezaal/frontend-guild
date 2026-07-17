import { Link } from "@vercel/microfrontends/next/client";
import { Button } from "@repo/ui/button";
import styles from "./page.module.css";

export default function DocsHome() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <span className={styles.badge}>served by apps/docs · port 3001</span>
        <h1>The docs microfrontend</h1>
        <p>
          This page came from a <strong>different Next.js server</strong> than
          the home page, yet the browser shows one site on one origin. The
          routing manifest gives this app ownership of <code>/docs</code> and
          everything beneath it.
        </p>
        <p>
          In production each microfrontend deploys independently — the docs
          team can ship this app without ever rebuilding the web app.
        </p>
        <div className={styles.actions}>
          <Link className={styles.cta} href="/">
            ← Back to the web microfrontend
          </Link>
          <Button appName="docs" className={styles.shared}>
            Shared @repo/ui button
          </Button>
        </div>
      </main>
    </div>
  );
}
