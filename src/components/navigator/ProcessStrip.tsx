import type { ProcessStep } from "../../content";
import styles from "./ProcessStrip.module.css";

/** Numbered, connected step strip used for ordering-pathway processes. */
export function ProcessStrip({ steps }: { steps: ProcessStep[] }) {
  return (
    <ol className={styles.strip}>
      {steps.map((step, i) => (
        <li key={i} className={styles.step}>
          <div className={styles.markerCol}>
            <span className={styles.marker}>{i + 1}</span>
            {i < steps.length - 1 && <span aria-hidden className={styles.connector} />}
          </div>
          <div className={styles.content}>
            <div className={styles.title}>{step.title}</div>
            <p className={styles.detail}>{step.detail}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
