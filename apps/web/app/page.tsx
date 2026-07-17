import { Link } from "@vercel/microfrontends/next/client";
import { Button } from "@repo/ui/button";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <span className={styles.badge}>served by apps/web · port 3000</span>
        <h1>The web microfrontend</h1>
        <p>
          This is the <strong>default application</strong>. It owns{" "}
          <code>microfrontends.json</code> and serves every path that no other
          microfrontend has claimed — like this home page.
        </p>
        <p>
          The link below leaves this app entirely: the proxy routes{" "}
          <code>/docs</code> to a completely separate Next.js server. Watch the
          accent colour and the port change.
        </p>
        <div className={styles.actions}>
          <Link className={styles.cta} href="/docs">
            Cross into the docs microfrontend →
          </Link>
          <Button appName="web" className={styles.shared}>
            Shared @repo/ui button
          </Button>
        </div>
      </main>
    </div>
  );
}
