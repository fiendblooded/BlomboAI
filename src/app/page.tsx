import Link from "next/link";
import styles from "./page.module.css";

export default function HomePage() {
  return (
    <main className={styles.main}>
      <div className={styles.center}>
        <h1>Event Matcher</h1>
        <p>Connect people at events with smart matching.</p>
      </div>
      <div className={styles.grid}>
        <Link className={styles.card} href="/admin/new">
          <h2>
            Create an Event <span>-&gt;</span>
          </h2>
          <p>Set up event details and get a shareable QR/link.</p>
        </Link>
        <Link className={styles.card} href="/join">
          <h2>
            Join an Event <span>-&gt;</span>
          </h2>
          <p>Enter a code or open via QR to start.</p>
        </Link>
      </div>
    </main>
  );
}
