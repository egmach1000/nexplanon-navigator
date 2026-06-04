import { useState } from "react";
import { Menu, X } from "lucide-react";
import styles from "./MobileBottomNav.module.css";

const NAV_LINKS = [
  "Product Resources",
  "Coverage & Reimbursement",
  "Financial Assistance",
];

/**
 * Mobile navigation, anchored to the bottom of the viewport per the Figma
 * `Mobile-NavPosition` frame: a sticky audience switcher above a header row
 * (hamburger left, Organon logo right). Shown below 1024px, where the desktop
 * header nav is hidden. The hamburger toggles a menu panel that opens upward.
 */
export function MobileBottomNav() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className={styles.root}>
      {menuOpen && (
        <div id="mobile-menu" className={styles.menu}>
          <nav aria-label="Mobile primary">
            <ul className={styles.menuList}>
              {NAV_LINKS.map((label) => (
                <li key={label}>
                  <a href="#" className={styles.menuLink} onClick={() => setMenuOpen(false)}>
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <button type="button" className={styles.menuEnroll} onClick={() => setMenuOpen(false)}>
            Enroll Now
          </button>
        </div>
      )}

      {/* Sticky audience switcher */}
      <div className={styles.audience} role="group" aria-label="Audience">
        <a href="#" className={styles.audienceActive} aria-current="true">
          For Health Care
          <br />
          Professionals
        </a>
        <a href="#" className={styles.audienceAlt}>
          For Patients
          <br />
          &amp; Caregivers
        </a>
      </div>

      {/* Header row: hamburger + logo */}
      <div className={styles.header}>
        <button
          type="button"
          className={styles.hamburger}
          aria-label={menuOpen ? "Close menu" : "Open main navigation"}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          onClick={() => setMenuOpen((o) => !o)}
        >
          {menuOpen ? <X size={28} aria-hidden /> : <Menu size={28} aria-hidden />}
        </button>
        <a href="#" className={styles.logo} aria-label="Organon Access Program home">
          <img src="/logos/organon.png" alt="Organon" className={styles.logoImg} />
        </a>
      </div>
    </div>
  );
}
