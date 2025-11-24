import { useState } from "react";
import styles from "./TrainingProgram.module.css";

export default function TrainingProgram({ program }) {
  const [openSections, setOpenSections] = useState({
    goals: true,
    weekly: false,
    strength: false,
    technical: false,
    notes: false,
  });

  const toggleSection = (section) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const hasAnyContent =
    program &&
    (program.season_goals ||
      program.weekly_schedule ||
      program.strength_conditioning ||
      program.technical_tactical ||
      program.coach_notes);

  const sections = [
    {
      id: "goals",
      title: "Season Goals",
      icon: "🎯",
      content: program?.season_goals || "No goals set yet.",
      isEmpty: !program?.season_goals,
    },
    {
      id: "weekly",
      title: "Weekly Training Schedule",
      icon: "📅",
      content: program?.weekly_schedule || "No weekly schedule yet.",
      isEmpty: !program?.weekly_schedule,
    },
    {
      id: "strength",
      title: "Strength & Conditioning",
      icon: "💪",
      content: program?.strength_conditioning || "No S&C plan yet.",
      isEmpty: !program?.strength_conditioning,
    },
    {
      id: "technical",
      title: "Technical / Tactical Focus",
      icon: "⚽",
      content: program?.technical_tactical || "No technical/tactical notes yet.",
      isEmpty: !program?.technical_tactical,
    },
    {
      id: "notes",
      title: "Coach Notes",
      icon: "📝",
      content: program?.coach_notes || "No coach notes yet.",
      isEmpty: !program?.coach_notes,
    },
  ];

  if (!hasAnyContent) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>Training Program</h2>
          <p className={styles.subtitle}>Your personalized development plan</p>
        </div>
        <div className={styles.emptyProgramState}>
          <div className={styles.emptyProgramIcon}>📋</div>
          <h3 className={styles.emptyProgramTitle}>
            No Training Program Yet
          </h3>
          <p className={styles.emptyProgramText}>
            Your coach hasn't created a training program for you yet. Check
            back soon or contact your coach for more information.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Training Program</h2>
        <p className={styles.subtitle}>Your personalized development plan</p>
      </div>

      {sections.map((section) => (
        <div key={section.id} className={styles.section}>
          <div
            className={`${styles.sectionHeader} ${
              openSections[section.id] ? styles.sectionHeaderActive : ""
            }`}
            onClick={() => toggleSection(section.id)}
          >
            <h3 className={styles.sectionTitle}>
              <span className={styles.icon}>{section.icon}</span>
              {section.title}
            </h3>
            <span
              className={`${styles.chevron} ${
                openSections[section.id] ? styles.chevronOpen : ""
              }`}
            >
              ▼
            </span>
          </div>
          <div
            className={`${styles.sectionContent} ${
              openSections[section.id] ? styles.sectionContentOpen : ""
            }`}
          >
            <div className={styles.content}>
              <p className={section.isEmpty ? styles.emptyState : ""}>
                {section.content}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
