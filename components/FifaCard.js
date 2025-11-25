import { useRef, useState } from "react";
import styles from "./FifaCard.module.css";

const cardDesigns = {
  gold: {
    background: 'linear-gradient(180deg, #f7d67a 0%, #d4a743 100%)',
    name: 'Gold Card'
  },
  silver: {
    background: 'linear-gradient(180deg, #c0c0c0 0%, #808080 100%)',
    name: 'Silver Card'
  },
  bronze: {
    background: 'linear-gradient(180deg, #cd7f32 0%, #8b5a2b 100%)',
    name: 'Bronze Card'
  },
  inform: {
    background: 'linear-gradient(180deg, #2d2d2d 0%, #0d0d0d 100%)',
    name: 'Team of the Week'
  },
  motm: {
    background: 'linear-gradient(180deg, #9b59b6 0%, #6c3483 100%)',
    name: 'Man of the Match'
  },
  toty: {
    background: 'linear-gradient(180deg, #3498db 0%, #2c3e50 100%)',
    name: 'Team of the Year'
  },
  tots: {
    background: 'linear-gradient(180deg, #f39c12 0%, #2980b9 100%)',
    name: 'Team of the Season'
  },
  hero: {
    background: 'linear-gradient(180deg, #5f27cd 0%, #341f97 100%)',
    name: 'Hero Card'
  },
  icon: {
    background: 'linear-gradient(180deg, #74b9ff 0%, #a29bfe 100%)',
    name: 'Icon Card'
  }
};

export default function FifaCard({ profile, card }) {
  const hasStats = card && (card.pac || card.sho || card.pas || card.dri || card.def || card.phy);
  const design = cardDesigns[card?.card_design] || cardDesigns.gold;
  const cardRef = useRef(null);
  const [downloading, setDownloading] = useState(false);
  
  // Compute average of available stats, rounded down
  const avg = (() => {
    if (!card) return null;
    const values = [card.pac, card.sho, card.pas, card.dri, card.def, card.phy]
      .map((v) => (typeof v === 'string' ? parseInt(v, 10) : v))
      .filter((v) => typeof v === 'number' && !Number.isNaN(v));
    if (!values.length) return null;
    const sum = values.reduce((a, b) => a + b, 0);
    return Math.floor(sum / values.length);
  })();
  const cardType = (card?.card_design || 'gold').toUpperCase();

  const downloadCard = async () => {
    if (!cardRef.current) return;
    
    setDownloading(true);
    try {
      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: null,
        scale: 2, // Higher quality
        logging: false,
        useCORS: true, // Enable CORS to capture external images
        allowTaint: true, // Allow cross-origin images
      });
      
      // Convert to blob and download
      canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = `${profile?.full_name || 'player'}-card.png`;
        link.href = url;
        link.click();
        URL.revokeObjectURL(url);
        setDownloading(false);
      });
    } catch (error) {
      console.error('Error downloading card:', error);
      setDownloading(false);
    }
  };

  const shareCard = async () => {
    if (!cardRef.current) return;

    setDownloading(true);
    try {
      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: null,
        scale: 2,
        logging: false,
        useCORS: true, // Enable CORS to capture external images
        allowTaint: true, // Allow cross-origin images
      });

      canvas.toBlob(async (blob) => {
        const file = new File([blob], `${profile?.full_name || 'player'}-card.png`, { type: 'image/png' });
        
        // Check if Web Share API is available and supports file sharing
        const canShare = navigator.share && navigator.canShare && navigator.canShare({ files: [file] });
        
        if (canShare) {
          try {
            await navigator.share({
              files: [file],
              title: `${profile?.full_name || 'Player'} Card`,
              text: 'Check out my player card!',
            });
            setDownloading(false);
          } catch (err) {
            if (err.name !== 'AbortError') {
              console.error('Share failed:', err);
              // Fallback to download on error
              const url = URL.createObjectURL(blob);
              const link = document.createElement('a');
              link.download = `${profile?.full_name || 'player'}-card.png`;
              link.href = url;
              link.click();
              URL.revokeObjectURL(url);
              setDownloading(false);
            } else {
              setDownloading(false);
            }
          }
        } else {
          // Fallback to download if sharing not supported (Firefox, desktop browsers)
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.download = `${profile?.full_name || 'player'}-card.png`;
          link.href = url;
          link.click();
          URL.revokeObjectURL(url);
          setDownloading(false);
        }
      });
    } catch (error) {
      console.error('Error sharing card:', error);
      setDownloading(false);
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.card} ref={cardRef} style={{ background: design.background }}>
        <div className={styles.topCurve}></div>

        {/* Top centered info: AVG and Card Type */}
        <div className={styles.topInfo}>
          <span className={styles.topAvg}>{avg ?? '-'}</span>
          <span className={styles.topDivider}>•</span>
          <span className={styles.topType}>{cardType}</span>
        </div>

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
          <img
            src={card?.flag || "/trinidad_flag.png"}
            width={40}
            height={25}
            alt="Flag"
            crossOrigin="anonymous"
          />
          <div className={styles.badgeBox}>
            {card?.team_crest ? (
              <img
                src={card.team_crest}
                width={50}
                height={50}
                alt="Team Crest"
                className={styles.teamCrest}
                crossOrigin="anonymous"
              />
            ) : (
              "DMCSS"
            )}
          </div>
        </div>

        <div className={styles.photoFrame}>
          {profile?.photo_url ? (
            <img
              src={profile.photo_url}
              width={140}
              height={140}
              alt="Player"
              className={styles.playerPhoto}
              crossOrigin="anonymous"
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

        {/* AVG badge moved to top; no inline badge here */}

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

      {/* Download/Share Buttons (icons under the card) */}
      <div className={styles.actionButtons}>
        <button
          onClick={downloadCard}
          className={styles.actionButton}
          disabled={downloading}
          aria-label="Download card"
          title="Download card"
        >
          {downloading ? '⏳' : '💾'}
        </button>
        <button
          onClick={shareCard}
          className={styles.actionButton}
          disabled={downloading}
          aria-label="Share card"
          title="Share card"
        >
          {downloading ? '⏳' : '📤'}
        </button>
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
