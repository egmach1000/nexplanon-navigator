import styles from "./ProductTabs.module.css";

const PRODUCTS = [
  "BILDYOS",
  "BILPREVDA",
  "HADLIMA",
  "NEXPLANON",
  "ONTRUZANT",
  "RENFLEXIS",
  "TOFIDENCE",
];

export function ProductTabs({
  active,
  onChange,
}: {
  active: string;
  onChange: (p: string) => void;
}) {
  return (
    <div className={styles.wrap}>
      <div className={styles.inner}>
        <div className={styles.rail} role="tablist" aria-label="Product resources">
          {PRODUCTS.map((p) => {
            const isActive = p === active;
            return (
              <button
                key={p}
                type="button"
                role="tab"
                aria-selected={isActive}
                className={isActive ? styles.tabActive : styles.tab}
                onClick={() => onChange(p)}
              >
                <span className={styles.tabLabel}>
                  {p}
                  <sup className={styles.reg}>®</sup>
                </span>
                {isActive && <span aria-hidden className={styles.underline} />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
