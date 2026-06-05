import { ArrowDown } from "lucide-react";
import type { RailSection } from "./useSectionRail";
import styles from "./SectionJumpBar.module.css";

/**
 * Mobile counterpart to {@link SectionRail}. Instead of a sticky gutter rail
 * (no room on narrow viewports), the same sections render once, inline at the
 * top of the step, as a subtle "On this step" jump list — one row per section
 * with a downward arrow. Shown only below the rail's breakpoint via CSS.
 */
export function SectionJumpBar({
  sections,
  onJump,
}: {
  sections: RailSection[];
  onJump: (id: string) => void;
}) {
  return (
    <nav className={styles.bar} aria-label="Jump to a section on this step">
      <span className={styles.label}>On this step</span>
      <ul className={styles.list}>
        {sections.map((s) => (
          <li key={s.id}>
            <button
              type="button"
              className={styles.row}
              onClick={() => onJump(s.id)}
            >
              <ArrowDown size={14} aria-hidden className={styles.rowIcon} />
              <span className={styles.rowLabel}>{s.label}</span>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
