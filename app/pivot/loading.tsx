import styles from './pivot.module.css'

export default function Loading() {
  return (
    <main className={styles.page}>
      <div className={styles.wrap}>
        <div className={styles.head}>
          <div>
            <div className={styles.skel} style={{ width: 180, height: 14, marginBottom: 10 }} />
            <div className={styles.skel} style={{ width: 220, height: 32 }} />
          </div>
          <div className={styles.skel} style={{ width: 220, height: 32, borderRadius: 999 }} />
        </div>
        <div className={styles.card}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className={styles.skel} style={{ height: 20, margin: 16 }} />
          ))}
        </div>
      </div>
    </main>
  )
}