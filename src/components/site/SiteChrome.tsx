import { ChevronDown } from "lucide-react";
import { getContact } from "../../content";
import styles from "./SiteChrome.module.css";

export function TopUtilityBar() {
  return (
    <div className={styles.utilityBar}>
      <div className={styles.utilityInner}>
        <a href="#" className={styles.audienceActive}>
          For Health Care Professionals
        </a>
        <a href="#" className={styles.audience}>
          For Patients &amp; Caregivers
        </a>
      </div>
    </div>
  );
}

export function SiteHeader() {
  const links = ["Product Resources", "Coverage & Reimbursement"];
  return (
    <header className={styles.header}>
      <div className={styles.headerInner}>
        <a href="#" className={styles.logo} aria-label="Organon Access Program home">
          <img src="/logos/organon.png" alt="Organon" className={styles.logoImg} />
        </a>
        <nav className={styles.nav} aria-label="Primary">
          {links.map((label) => (
            <a key={label} href="#" className={styles.navLink}>
              {label}
            </a>
          ))}
          <a href="#" className={styles.navLink} aria-haspopup="true">
            Financial Assistance
            <ChevronDown size={16} aria-hidden className={styles.navIcon} />
          </a>
          <button type="button" className={styles.enroll}>
            Enroll Now
          </button>
        </nav>
      </div>
    </header>
  );
}

export function ServiceBanner() {
  const oap = getContact("oap");
  return (
    <div className={styles.serviceBanner}>
      <div className={styles.serviceInner}>
        <p className={styles.serviceText}>
          Contact The Organon Access Program {oap?.hours ? `${oap.hours}, ` : ""}
          at {oap?.phone ?? "1-866-809-9515"}.
        </p>
      </div>
    </div>
  );
}

export function PageHeading({ title }: { title: string }) {
  return (
    <div className={styles.pageHeading}>
      <h1 className={styles.pageTitle}>{title}</h1>
    </div>
  );
}

export function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerInner}>
        <div className={styles.footerTop}>
          <div className={styles.footerBrandColumn}>
            <img src="/logos/organon.png" alt="Organon" className={styles.footerLogo} />
            <p className={styles.footerCopy}>
              © 2026 Organon group of companies. All rights reserved. ORGANON and
              the ORGANON Logo are trademarks of the Organon group of companies.
              This site is intended for US health care professionals. US-TOF-110113
              06/26
            </p>
          </div>
          <div className={styles.footerLegalColumn}>
            <nav className={styles.footerLinks} aria-label="Legal">
              <a href="#" className={styles.footerLink}>
                Privacy Policy
              </a>
              <a href="#" className={styles.footerLink}>
                Terms of Use
              </a>
              <a href="#" className={styles.footerPrivacyChoice}>
                <img
                  src="/footer/privacy-choices.png"
                  alt=""
                  aria-hidden
                  className={styles.privacyIcon}
                />
                <span className={styles.footerLink}>Your Privacy Choices</span>
              </a>
            </nav>
            <img
              src="/footer/accessibility-badges.svg"
              alt="TRUSTe APEC Privacy certification and accessibility badges"
              className={styles.footerBadges}
            />
          </div>
        </div>
      </div>
    </footer>
  );
}
