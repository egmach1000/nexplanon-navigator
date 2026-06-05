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

export function SiteDisclaimer() {
  return (
    <section className={styles.siteDisclaimer} aria-label="Billing and coding disclaimer">
      <div className={styles.siteDisclaimerInner}>
        <p>
          The information available here is compiled from sources believed to be
          accurate, but Organon makes no representation that it is accurate. This
          information is subject to change. Payer coding requirements may vary or
          change over time, so it is important to regularly check with each payer
          as to payer-specific requirements.
        </p>
        <p>
          The information available here is not intended to be definitive or
          exhaustive, and is not intended to replace the guidance of a qualified
          professional advisor. Organon and its agents make no warranties or
          guarantees, express or implied, concerning the accuracy or
          appropriateness of this information for your particular use given the
          frequent changes in public and private payer billing. The use of this
          information does not guarantee payment or that any payment received will
          cover your costs.
        </p>
        <p>
          You are solely responsible for determining the appropriate codes and for
          any action you take in billing. Information about HCPCS codes is based
          on guidance issued by the Centers for Medicare &amp; Medicaid Services
          applicable to Medicare Part B and may not apply to other public or
          private payers. Consult the relevant manual and/or other guidelines for
          a description of each code to determine the appropriateness of a
          particular code and for information on additional codes. Diagnosis codes
          should be selected only by a health care professional.
        </p>
        <p>HCPCS, Healthcare Common Procedure Coding System.</p>
      </div>
    </section>
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
