import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { supabase } from "../../lib/supabaseClient";
import withCoachAuth from "../../lib/withCoachAuth";
import EditPlayerModal from "../../components/EditPlayerModal";
import styles from "./index.module.css";

function CoachDashboard() {
  const router = useRouter();
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState(null);
  const [viewMode, setViewMode] = useState("table"); // "table" or "cards"

  useEffect(() => {
    loadPlayers();
  }, []);

  async function loadPlayers() {
    try {
      // Fetch all profiles (RLS policy allows coaches to see all)
      const { data: profilesData, error: profilesError } = await supabase
        .from("profiles")
        .select("*")
        .order("full_name");

      if (profilesError) throw profilesError;

      // Fetch all player cards
      const { data: cardsData } = await supabase
        .from("player_card")
        .select("*");

      // Combine data
      const playersWithCards = profilesData.map((profile) => {
        const card = cardsData?.find((c) => c.user_id === profile.id);
        return { ...profile, card };
      });

      setPlayers(playersWithCards);
    } catch (error) {
      console.error("Error loading players:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleLogout() {
    setLoggingOut(true);
    await supabase.auth.signOut();
    router.push("/");
  }

  function getInitials(name) {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p className={styles.loadingText}>Loading players...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerTop}>
          <h1 className={styles.title}>Coach Dashboard</h1>
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className={styles.logoutButton}
          >
            {loggingOut ? "Logging out..." : "Logout"}
          </button>
        </div>
        <p className={styles.subtitle}>
          Manage and monitor all players • {players.length} total
        </p>
      </div>

      {players.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyStateIcon}>👥</div>
          <h2 className={styles.emptyStateTitle}>No Players Yet</h2>
          <p className={styles.emptyStateText}>
            Players will appear here once they create their profiles.
          </p>
        </div>
      ) : (
        <>
          <div className={styles.viewToggle}>
            <button
              className={`${styles.viewButton} ${
                viewMode === "table" ? styles.viewButtonActive : ""
              }`}
              onClick={() => setViewMode("table")}
            >
              📊 Table View
            </button>
            <button
              className={`${styles.viewButton} ${
                viewMode === "cards" ? styles.viewButtonActive : ""
              }`}
              onClick={() => setViewMode("cards")}
            >
              🎴 Card View
            </button>
          </div>

          {viewMode === "table" ? (
            <div className={styles.tableContainer}>
              <table className={styles.table}>
                <thead className={styles.tableHeader}>
                  <tr>
                    <th>Player</th>
                    <th>Position</th>
                    <th>Age</th>
                    <th>Stats</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody className={styles.tableBody}>
                  {players.map((player) => (
                    <tr key={player.id}>
                      <td>
                        <div className={styles.playerCell}>
                          {player.photo_url ? (
                            <Image
                              src={player.photo_url}
                              width={40}
                              height={40}
                              alt={player.full_name || "Player"}
                              className={styles.tablePlayerPhoto}
                            />
                          ) : (
                            <div className={styles.tablePlayerPhotoPlaceholder}>
                              {getInitials(player.full_name)}
                            </div>
                          )}
                          <span className={styles.playerNameCell}>
                            {player.full_name || "Unknown Player"}
                          </span>
                        </div>
                      </td>
                      <td>{player.position || "-"}</td>
                      <td>{player.age || "-"}</td>
                      <td>
                        {player.card ? (
                          <div className={styles.statsCell}>
                            <span className={styles.miniStat}>
                              PAC {player.card.pac || "-"}
                            </span>
                            <span className={styles.miniStat}>
                              SHO {player.card.sho || "-"}
                            </span>
                            <span className={styles.miniStat}>
                              DRI {player.card.dri || "-"}
                            </span>
                          </div>
                        ) : (
                          <span style={{ color: "#a0aec0" }}>No stats</span>
                        )}
                      </td>
                      <td>
                        <button
                          className={styles.editButton}
                          onClick={() => setEditingPlayer(player)}
                        >
                          ✏️ Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className={styles.playerGrid}>
          {players.map((player) => (
            <div key={player.id} className={styles.playerCard}>
              <div className={styles.playerHeader}>
                {player.photo_url ? (
                  <Image
                    src={player.photo_url}
                    width={60}
                    height={60}
                    alt={player.full_name || "Player"}
                    className={styles.playerPhoto}
                  />
                ) : (
                  <div className={styles.playerPhotoPlaceholder}>
                    {getInitials(player.full_name)}
                  </div>
                )}
                <div className={styles.playerInfo}>
                  <h3 className={styles.playerName}>
                    {player.full_name || "Unknown Player"}
                  </h3>
                  <div className={styles.playerMeta}>
                    {player.position && (
                      <span className={styles.metaItem}>
                        ⚽ {player.position}
                      </span>
                    )}
                    {player.age && (
                      <span className={styles.metaItem}>🎂 {player.age}</span>
                    )}
                  </div>
                  {player.role === "coach" && (
                    <span className={styles.roleBadge}>Coach</span>
                  )}
                </div>
              </div>

              {player.card && (
                <div className={styles.statsRow}>
                  <div className={styles.statBox}>
                    <div className={styles.statLabel}>PAC</div>
                    <div className={styles.statValue}>
                      {player.card.pac || "-"}
                    </div>
                  </div>
                  <div className={styles.statBox}>
                    <div className={styles.statLabel}>SHO</div>
                    <div className={styles.statValue}>
                      {player.card.sho || "-"}
                    </div>
                  </div>
                  <div className={styles.statBox}>
                    <div className={styles.statLabel}>DRI</div>
                    <div className={styles.statValue}>
                      {player.card.dri || "-"}
                    </div>
                  </div>
                </div>
              )}

              <button
                className={styles.editButton}
                onClick={() => setEditingPlayer(player)}
                style={{ width: "100%", marginTop: "12px" }}
              >
                ✏️ Edit Player
              </button>
            </div>
          ))}
        </div>
          )}
        </>
      )}

      {editingPlayer && (
        <EditPlayerModal
          player={editingPlayer}
          onClose={() => setEditingPlayer(null)}
          onSave={() => {
            loadPlayers();
            setEditingPlayer(null);
          }}
        />
      )}
    </div>
  );
}

export default withCoachAuth(CoachDashboard);
