import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import {
  updateUserProfile,
  updatePlayerCard,
  updateTrainingProgram,
  updateAllPlayerData,
} from "../lib/updatePlayerData";
import PhotoUploader from "./PhotoUploader";
import styles from "./EditPlayerModal.module.css";

export default function EditPlayerModal({ player, onClose, onSave }) {
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState(null);
  
  // Profile data
  const [profile, setProfile] = useState({
    full_name: "",
    age: "",
    position: "",
    photo_url: "",
  });

  // Player card stats
  const [card, setCard] = useState({
    pac: "",
    sho: "",
    pas: "",
    dri: "",
    def: "",
    phy: "",
  });

  // Training program
  const [program, setProgram] = useState({
    season_goals: "",
    weekly_schedule: "",
    strength_conditioning: "",
    technical_tactical: "",
    coach_notes: "",
  });

  useEffect(() => {
    loadPlayerData();
  }, [player.id]);

  async function loadPlayerData() {
    try {
      // Load profile
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", player.id)
        .single();

      if (profileData) {
        setProfile({
          full_name: profileData.full_name || "",
          age: profileData.age || "",
          position: profileData.position || "",
          photo_url: profileData.photo_url || "",
        });
      }

      // Load player card
      const { data: cardData } = await supabase
        .from("player_card")
        .select("*")
        .eq("user_id", player.id)
        .single();

      if (cardData) {
        setCard({
          pac: cardData.pac || "",
          sho: cardData.sho || "",
          pas: cardData.pas || "",
          dri: cardData.dri || "",
          def: cardData.def || "",
          phy: cardData.phy || "",
        });
      }

      // Load training program
      const { data: programData } = await supabase
        .from("training_program")
        .select("*")
        .eq("user_id", player.id)
        .single();

      if (programData) {
        setProgram({
          season_goals: programData.season_goals || "",
          weekly_schedule: programData.weekly_schedule || "",
          strength_conditioning: programData.strength_conditioning || "",
          technical_tactical: programData.technical_tactical || "",
          coach_notes: programData.coach_notes || "",
        });
      }
    } catch (error) {
      console.error("Error loading player data:", error);
    }
  }

  async function handleSave() {
    setSaving(true);
    setSaveMessage(null);

    try {
      // Use the centralized update function
      const result = await updateAllPlayerData(player.id, {
        profile,
        card,
        program,
      });

      if (!result.success) {
        // Show detailed error message
        const errorTables = result.errors.map((e) => e.table).join(", ");
        throw new Error(`Failed to update: ${errorTables}`);
      }

      setSaveMessage({ type: "success", text: "Player updated successfully!" });
      setTimeout(() => {
        onSave();
        onClose();
      }, 1000);
    } catch (error) {
      console.error("Error saving player:", error);
      setSaveMessage({
        type: "error",
        text: error.message || "Failed to save changes. Please try again.",
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className={styles.modal} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Edit Player</h2>
          <button className={styles.closeButton} onClick={onClose}>
            ×
          </button>
        </div>

        <div className={styles.modalBody}>
          {saveMessage && (
            <div
              className={`${styles.saveMessage} ${
                saveMessage.type === "success"
                  ? styles.saveMessageSuccess
                  : styles.saveMessageError
              }`}
            >
              <span>{saveMessage.type === "success" ? "✓" : "⚠"}</span>
              {saveMessage.text}
            </div>
          )}

          {/* Profile Section */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Profile Information</h3>
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Full Name</label>
                <input
                  type="text"
                  className={styles.input}
                  value={profile.full_name}
                  onChange={(e) =>
                    setProfile({ ...profile, full_name: e.target.value })
                  }
                  disabled={saving}
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Age</label>
                <input
                  type="number"
                  className={styles.input}
                  value={profile.age}
                  onChange={(e) =>
                    setProfile({ ...profile, age: e.target.value })
                  }
                  disabled={saving}
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Position</label>
                <input
                  type="text"
                  className={styles.input}
                  value={profile.position}
                  onChange={(e) =>
                    setProfile({ ...profile, position: e.target.value })
                  }
                  placeholder="e.g., Forward, Midfielder"
                  disabled={saving}
                />
              </div>
            </div>

            <PhotoUploader
              userId={player.id}
              currentPhotoUrl={profile.photo_url}
              onUploadComplete={(url) => {
                setProfile({ ...profile, photo_url: url });
              }}
            />
          </div>

          {/* Player Card Stats Section */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>FIFA Card Stats (0-99)</h3>
            <div className={styles.statsGrid}>
              <div className={styles.formGroup}>
                <label className={styles.label}>PAC (Pace)</label>
                <input
                  type="number"
                  className={styles.input}
                  value={card.pac}
                  onChange={(e) => setCard({ ...card, pac: e.target.value })}
                  min="0"
                  max="99"
                  disabled={saving}
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>SHO (Shooting)</label>
                <input
                  type="number"
                  className={styles.input}
                  value={card.sho}
                  onChange={(e) => setCard({ ...card, sho: e.target.value })}
                  min="0"
                  max="99"
                  disabled={saving}
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>PAS (Passing)</label>
                <input
                  type="number"
                  className={styles.input}
                  value={card.pas}
                  onChange={(e) => setCard({ ...card, pas: e.target.value })}
                  min="0"
                  max="99"
                  disabled={saving}
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>DRI (Dribbling)</label>
                <input
                  type="number"
                  className={styles.input}
                  value={card.dri}
                  onChange={(e) => setCard({ ...card, dri: e.target.value })}
                  min="0"
                  max="99"
                  disabled={saving}
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>DEF (Defending)</label>
                <input
                  type="number"
                  className={styles.input}
                  value={card.def}
                  onChange={(e) => setCard({ ...card, def: e.target.value })}
                  min="0"
                  max="99"
                  disabled={saving}
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>PHY (Physical)</label>
                <input
                  type="number"
                  className={styles.input}
                  value={card.phy}
                  onChange={(e) => setCard({ ...card, phy: e.target.value })}
                  min="0"
                  max="99"
                  disabled={saving}
                />
              </div>
            </div>
          </div>

          {/* Training Program Section */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Training Program</h3>
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Season Goals</label>
                <textarea
                  className={styles.textarea}
                  value={program.season_goals}
                  onChange={(e) =>
                    setProgram({ ...program, season_goals: e.target.value })
                  }
                  disabled={saving}
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Weekly Schedule</label>
                <textarea
                  className={styles.textarea}
                  value={program.weekly_schedule}
                  onChange={(e) =>
                    setProgram({ ...program, weekly_schedule: e.target.value })
                  }
                  disabled={saving}
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Strength & Conditioning</label>
                <textarea
                  className={styles.textarea}
                  value={program.strength_conditioning}
                  onChange={(e) =>
                    setProgram({
                      ...program,
                      strength_conditioning: e.target.value,
                    })
                  }
                  disabled={saving}
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Technical / Tactical</label>
                <textarea
                  className={styles.textarea}
                  value={program.technical_tactical}
                  onChange={(e) =>
                    setProgram({
                      ...program,
                      technical_tactical: e.target.value,
                    })
                  }
                  disabled={saving}
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Coach Notes</label>
                <textarea
                  className={styles.textarea}
                  value={program.coach_notes}
                  onChange={(e) =>
                    setProgram({ ...program, coach_notes: e.target.value })
                  }
                  disabled={saving}
                />
              </div>
            </div>
          </div>
        </div>

        <div className={styles.modalFooter}>
          <button
            className={`${styles.button} ${styles.buttonSecondary}`}
            onClick={onClose}
            disabled={saving}
          >
            Cancel
          </button>
          <button
            className={`${styles.button} ${styles.buttonPrimary}`}
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
