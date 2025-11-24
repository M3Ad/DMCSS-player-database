import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "../../lib/supabaseClient";
import withAuth from "../../lib/withAuth";
import FifaCard from "../../components/FifaCard";
import TrainingProgram from "../../components/TrainingProgram";
import {
  FifaCardSkeleton,
  TrainingProgramSkeleton,
} from "../../components/LoadingSkeleton";

function PlayerDashboard() {
  const router = useRouter();
  const [profile, setProfile] = useState(null);
  const [card, setCard] = useState(null);
  const [program, setProgram] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    loadPlayer();
  }, []);

  async function loadPlayer() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return;
    }

    const { data: profileData } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    const { data: cardData } = await supabase
      .from("player_card")
      .select("*")
      .eq("user_id", user.id)
      .single();

    const { data: programData } = await supabase
      .from("training_program")
      .select("*")
      .eq("user_id", user.id)
      .single();

    setProfile(profileData);
    setCard(cardData);
    setProgram(programData);
    setLoading(false);
  }

  async function handleLogout() {
    setLoggingOut(true);
    await supabase.auth.signOut();
    router.push("/");
  }

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h1 style={styles.headerTitle}>Player Dashboard</h1>
        <button
          onClick={handleLogout}
          disabled={loggingOut}
          style={{
            ...styles.logoutButton,
            ...(loggingOut ? styles.logoutButtonDisabled : {}),
          }}
        >
          {loggingOut ? "Logging out..." : "Logout"}
        </button>
      </div>
      
      {loading ? (
        <>
          <FifaCardSkeleton />
          <TrainingProgramSkeleton />
        </>
      ) : (
        <>
          <FifaCard profile={profile} card={card} />
          <TrainingProgram program={program} />
        </>
      )}
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "radial-gradient(circle at top, #006400 0%, #001500 60%)",
    paddingBottom: "60px",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "20px 40px",
    background: "rgba(0, 0, 0, 0.3)",
    borderBottom: "2px solid #ffcc00",
  },
  headerTitle: {
    color: "#fff",
    fontSize: "24px",
    fontWeight: "bold",
    margin: 0,
  },
  logoutButton: {
    padding: "10px 20px",
    background: "#ff4444",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    fontSize: "14px",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "background 0.2s",
  },
  logoutButtonDisabled: {
    background: "#cc3333",
    cursor: "not-allowed",
    opacity: 0.7,
  },
  loading: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#000",
    color: "#fff",
  },
};

export default withAuth(PlayerDashboard);
