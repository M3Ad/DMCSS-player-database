import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "../../lib/supabaseClient";
import FifaCard from "../../components/FifaCard";
import TrainingProgram from "../../components/TrainingProgram";

export default function PlayerDashboard() {
  const router = useRouter();
  const [profile, setProfile] = useState(null);
  const [card, setCard] = useState(null);
  const [program, setProgram] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPlayer();
  }, []);

  async function loadPlayer() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/");
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

  if (loading) {
    return (
      <div style={styles.loading}>
        <p>Loading player data...</p>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <FifaCard profile={profile} card={card} />
      <TrainingProgram program={program} />
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "radial-gradient(circle at top, #006400 0%, #001500 60%)",
    paddingBottom: "60px",
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
