import styles from "./StepPlaceholder.module.css";

/**
 * Stand-in for step bodies delivered in later parcels. Keeps the step framework
 * (navigation, gating, progress) fully exercisable in Parcel A.
 */
export function StepPlaceholder({
  parcel,
  children,
}: {
  parcel: string;
  children: React.ReactNode;
}) {
  return (
    <div className={styles.root}>
      <span className={styles.badge}>Coming in {parcel}</span>
      <div className={styles.body}>{children}</div>
    </div>
  );
}
