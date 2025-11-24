import styles from "./LoadingSkeleton.module.css";

export function FifaCardSkeleton() {
  return (
    <div className={styles.loadingContainer}>
      <div className={styles.cardSkeleton}>
        <div className={styles.topCurve}></div>

        <div className={styles.topRow}>
          <div className={`${styles.topItem} ${styles.skeleton}`}></div>
          <div className={`${styles.topItem} ${styles.skeleton}`}></div>
        </div>

        <div className={styles.flagRow}>
          <div className={`${styles.flagBox} ${styles.skeleton}`}></div>
          <div className={`${styles.flagBox} ${styles.skeleton}`}></div>
        </div>

        <div className={`${styles.photoFrame} ${styles.skeleton}`}></div>

        <div className={`${styles.playerName} ${styles.skeleton}`}></div>

        <div className={styles.statsGrid}>
          <div className={`${styles.statBox} ${styles.skeleton}`}></div>
          <div className={`${styles.statBox} ${styles.skeleton}`}></div>
          <div className={`${styles.statBox} ${styles.skeleton}`}></div>
          <div className={`${styles.statBox} ${styles.skeleton}`}></div>
          <div className={`${styles.statBox} ${styles.skeleton}`}></div>
          <div className={`${styles.statBox} ${styles.skeleton}`}></div>
        </div>
      </div>
    </div>
  );
}

export function TrainingProgramSkeleton() {
  return (
    <div className={styles.programSkeleton}>
      <div className={styles.header}>
        <div className={`${styles.headerTitle} ${styles.skeleton}`}></div>
        <div className={`${styles.headerSubtitle} ${styles.skeleton}`}></div>
      </div>

      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className={styles.section}>
          <div className={styles.sectionHeader}>
            <div className={`${styles.icon} ${styles.skeleton}`}></div>
            <div className={`${styles.sectionTitle} ${styles.skeleton}`}></div>
          </div>
        </div>
      ))}
    </div>
  );
}
