import Image from "next/image";
import styles from "./FifaCard.module.css";

export default function FifaCard({ profile, card }) {
  const hasStats = card && (card.pac || card.sho || card.pas || card.dri || card.def || card.phy);

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <div className={styles.topCurve}></div>

        <div className={styles.topRow}>
          <div>
            <div className={styles.label}>AGE</div>
            <div className={styles.text}>{profile?.age ?? "-"}</div>
          </div>
          <div>
            <div className={styles.label}>POS</div>
            <div className={styles.text}>{profile?.position ?? "-"}</div>
          </div>
        </div>

        <div className={styles.flagRow}>
          <Image
            src="/trinidad_flag.png"
            width={40}
            height={25}
            alt="T&T flag"
          />
          <div className={styles.badgeBox}>
            {card?.team_crest ? (
              <Image
                src={card.team_crest}
                width={50}
                height={50}
                alt="Team Crest"
                className={styles.teamCrest}
              />
            ) : (
              "DMCSS"
            )}
          </div>
        </div>

        <div className={styles.photoFrame}>
          {profile?.photo_url ? (
            <Image
              src={profile.photo_url}
              width={140}
              height={140}
              alt="Player"
              className={styles.playerPhoto}
            />
          ) : (
            <div className={styles.photoPlaceholderEmpty}>
              <div className={styles.photoIcon}>📷</div>
              <div className={styles.photoText}>No photo uploaded yet</div>
            </div>
          )}
        </div>

        <div className={styles.playerName}>
          {profile?.full_name || profile?.name || "Player Name"}
        </div>

        {hasStats ? (
          <div className={styles.statsGrid}>
            <Stat label="PAC" value={card?.pac} />
            <Stat label="SHO" value={card?.sho} />
            <Stat label="PAS" value={card?.pas} />
            <Stat label="DRI" value={card?.dri} />
            <Stat label="DEF" value={card?.def} />
            <Stat label="PHY" value={card?.phy} />
          </div>
        ) : (
          <div className={styles.emptyState}>
            <div className={styles.emptyStateIcon}>⚽</div>
            <div className={styles.emptyStateText}>
              No stats available yet.<br />Contact your coach to add your ratings.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className={styles.statBox}>
      <span className={styles.statValue}>{value ?? "-"}</span>
      <span className={styles.statLabel}>{label}</span>
    </div>
  );
}
