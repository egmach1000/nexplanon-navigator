import type { RailSection } from "./useSectionRail";
import styles from "./SectionRail.module.css";

/**
 * Sticky left-gutter navigation for long steps. Lists the current step's
 * sections and highlights the one in view (see {@link useSectionRail}). Hidden
 * on narrow viewports via CSS, where there is no gutter room.
 */
export function SectionRail({
  sections,
  activeId,
  onJump,
}: {
  sections: RailSection[];
  activeId: string | null;
  onJump: (id: string) => void;
}) {
  return (
    <nav className={styles.rail} aria-label="On this step">
      <div className={styles.heading}>On this step</div>
      <ul className={styles.list}>
        {sections.map((s) => {
          const active = s.id === activeId;
          return (
            <li key={s.id}>
              <button
                type="button"
                className={active ? styles.itemActive : styles.item}
                aria-current={active ? "location" : undefined}
                onClick={() => onJump(s.id)}
              >
                {s.label}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
