import { useEffect, useRef } from "react";
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
  const railRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef<HTMLButtonElement>(null);

  // The rail scrolls horizontally on mobile; the active tab (e.g. NEXPLANON,
  // which sits mid-list) would otherwise load off-screen to the right. Center
  // it within the rail without scrolling the page itself.
  useEffect(() => {
    const rail = railRef.current;
    const btn = activeRef.current;
    if (!rail || !btn) return;
    const target = btn.offsetLeft - (rail.clientWidth - btn.clientWidth) / 2;
    rail.scrollLeft = Math.max(0, target);
  }, [active]);

  return (
    <div className={styles.wrap}>
      <div className={styles.inner}>
        <div className={styles.rail} ref={railRef} role="tablist" aria-label="Product resources">
          {PRODUCTS.map((p) => {
            const isActive = p === active;
            return (
              <button
                key={p}
                ref={isActive ? activeRef : undefined}
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
