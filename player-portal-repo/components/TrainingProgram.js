export default function TrainingProgram({ program }) {
  return (
    <div style={styles.box}>
      <h2>Season Goals</h2>
      <p>{program?.season_goals || "No goals set yet."}</p>

      <h2>Weekly Training</h2>
      <p>{program?.weekly_schedule || "No weekly schedule yet."}</p>

      <h2>Strength & Conditioning</h2>
      <p>{program?.strength_conditioning || "No S&C plan yet."}</p>

      <h2>Technical / Tactical Focus</h2>
      <p>{program?.technical_tactical || "No technical/tactical notes yet."}</p>

      <h2>Coach Notes</h2>
      <p>{program?.coach_notes || "No coach notes yet."}</p>
    </div>
  );
}

const styles = {
  box: {
    width: "90%",
    maxWidth: "900px",
    margin: "20px auto 40px auto",
    padding: "20px",
    background: "#ffffffdd",
    borderRadius: "12px",
    lineHeight: "1.6",
  },
};
