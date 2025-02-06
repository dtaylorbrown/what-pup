import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1>What pup?</h1>
        <p>An interesting breed detection and bark translation app</p>
      </main>
    </div>
  );
}
