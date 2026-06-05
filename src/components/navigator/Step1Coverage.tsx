import { Building2, HelpCircle, Phone, Pill } from "lucide-react";
import { coverageHelp, getContact, telHref } from "../../content";
import type { BenefitType } from "./types";
import styles from "./Step1Coverage.module.css";

/**
 * Icon per benefit choice — the only part of a choice that lives in code (React
 * components can't be stored in JSON). Label/blurb/sourcePage come from the
 * content layer (coverageHelp.benefitChoices) so the client can update copy.
 */
const CHOICE_ICONS: Record<BenefitType, typeof Building2> = {
  medical: Building2,
  pharmacy: Pill,
  unsure: HelpCircle,
};

/** "Not sure" verification helper: payer-call script + Organon Access Program benefit investigation. */
function VerificationHelper() {
  const { callScript, investigation, costNote } = coverageHelp;
  const contact = getContact(investigation.contactId);
  return (
    <div className={styles.helper}>
      <div className={styles.helperPanel}>
        <h3 className={styles.helperHeading}>{callScript.heading}</h3>
        <ol className={styles.numList}>
          {callScript.steps.map((s, i) => (
            <li key={i} className={styles.numItem}>
              <span className={styles.numMarker}>{i + 1}</span>
              <span>{s}</span>
            </li>
          ))}
        </ol>
        <h4 className={styles.subHeading}>Questions to ask if NEXPLANON is covered</h4>
        <ul className={styles.bulletList}>
          {callScript.questionsIfCovered.map((q, i) => (
            <li key={i}>{q}</li>
          ))}
        </ul>
        <p className={styles.costNote}>{costNote}</p>
      </div>

      <div className={styles.investigatePanel}>
        <h3 className={styles.investigateHeading}>{investigation.heading}</h3>
        <p className={styles.investigateBody}>{investigation.body}</p>
        <div className={styles.investigateActions}>
          {contact?.phone && (
            <a href={telHref(contact.phone)} className={styles.primaryAction}>
              <Phone size={15} aria-hidden />
              Call {contact.name} {contact.phone}
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Coverage triage — the medical-vs-pharmacy fork that drives Steps 2–4 (PRD
 * §5 Step 1). Selecting "Not sure" reveals the verification helper. The
 * Medicaid note is shown for all selections.
 */
export function Step1Coverage({
  value,
  onChange,
}: {
  value: BenefitType | null;
  onChange: (v: BenefitType) => void;
}) {
  const { medicaid, benefitChoices } = coverageHelp;
  return (
    <div className={styles.root}>
      <div
        role="radiogroup"
        aria-label="How is NEXPLANON covered for this patient?"
        className={styles.group}
      >
        {benefitChoices.map(({ value: v, label, blurb }) => {
          const choiceValue = v as BenefitType;
          const Icon = CHOICE_ICONS[choiceValue];
          const selected = value === choiceValue;
          return (
            <button
              key={choiceValue}
              type="button"
              role="radio"
              aria-checked={selected}
              className={selected ? styles.cardSelected : styles.card}
              onClick={() => onChange(choiceValue)}
            >
              <span className={styles.icon}>
                <Icon size={22} aria-hidden />
              </span>
              <span className={styles.text}>
                <span className={styles.label}>{label}</span>
                <span className={styles.blurb}>{blurb}</span>
              </span>
            </button>
          );
        })}
      </div>

      {value === "unsure" && <VerificationHelper />}

      <div className={styles.medicaid}>
        <h4 className={styles.medicaidHeading}>{medicaid.heading}</h4>
        <p className={styles.medicaidNote}>{medicaid.note}</p>
        <ul className={styles.medicaidPoints}>
          {medicaid.points.map((p, i) => (
            <li key={i}>{p}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
