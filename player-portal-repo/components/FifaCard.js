import Image from "next/image";

export default function FifaCard({ profile, card }) {
  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <div style={styles.topCurve}></div>

        <div style={styles.topRow}>
          <div>
            <div style={styles.label}>AGE</div>
            <div style={styles.text}>{profile?.age ?? "-"}</div>
          </div>
          <div>
            <div style={styles.label}>POS</div>
            <div style={styles.text}>{profile?.position ?? "-"}</div>
          </div>
        </div>

        <div style={styles.flagRow}>
          <Image
            src="/trinidad_flag.png"
            width={40}
            height={25}
            alt="T&T flag"
          />
          <div style={styles.badgeBox}>CLUB</div>
        </div>

        <div style={styles.photoFrame}>
          {profile?.photo_url ? (
            <Image
              src={profile.photo_url}
              width={140}
              height={140}
              alt="Player"
              style={{ borderRadius: "8px", objectFit: "cover" }}
            />
          ) : (
            <div style={styles.photoPlaceholder}>PLAYER PHOTO</div>
          )}
        </div>

        <div style={styles.playerName}>
          {profile?.full_name || profile?.name || "Player Name"}
        </div>

        <div style={styles.statsGrid}>
          <Stat label="PAC" value={card?.pac} />
          <Stat label="SHO" value={card?.sho} />
          <Stat label="PAS" value={card?.pas} />
          <Stat label="DRI" value={card?.dri} />
          <Stat label="DEF" value={card?.def} />
          <Stat label="PHY" value={card?.phy} />
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div style={styles.statBox}>
      <span style={styles.statValue}>{value ?? "-"}</span>
      <span style={styles.statLabel}>{label}</span>
    </div>
  );
}

const styles = {
  wrapper: {
    display: "flex",
    justifyContent: "center",
    paddingTop: "20px",
  },
  card: {
    width: "260px",
    borderRadius: "20px",
    background: "linear-gradient(180deg, #f7d67a 0%, #d4a743 100%)",
    padding: "15px",
    position: "relative",
    boxShadow: "0 0 12px rgba(0,0,0,0.4)",
  },
  topCurve: {
    width: "100%",
    height: "40px",
    background: "radial-gradient(circle at top, #fff4d0 0%, transparent 70%)",
    borderRadius: "1000px 1000px 0 0",
    marginBottom: "10px",
  },
  topRow: {
    display: "flex",
    justifyContent: "space-between",
    padding: "0 10px",
  },
  flagRow: {
    display: "flex",
    justifyContent: "center",
    gap: "12px",
    marginTop: "5px",
  },
  badgeBox: {
    width: "40px",
    height: "40px",
    border: "1px solid white",
    borderRadius: "6px",
    fontSize: "8px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: "white",
  },
  label: {
    fontSize: "8px",
    color: "white",
  },
  text: {
    fontSize: "12px",
    fontWeight: "bold",
    color: "white",
  },
  photoFrame: {
    width: "100%",
    height: "120px",
    border: "1px solid white",
    marginTop: "8px",
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  photoPlaceholder: {
    fontSize: "10px",
    color: "white",
  },
  playerName: {
    fontWeight: "bold",
    fontSize: "18px",
    textAlign: "center",
    marginTop: "10px",
    color: "white",
  },
  statsGrid: {
    marginTop: "12px",
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "8px",
  },
  statBox: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  statValue: {
    fontWeight: "bold",
    color: "white",
  },
  statLabel: {
    fontSize: "10px",
    color: "white",
  },
};
