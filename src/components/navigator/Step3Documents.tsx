import { useMemo, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  FileDown,
  FileText,
  PenLine,
  ShieldCheck,
  User,
  Users,
} from "lucide-react";
import { fileLinkProps, formHelp, forms, type FormAsset, type FormHelpBox } from "../../content";
import styles from "./Step3Documents.module.css";

/**
 * Step 3 — Patient & office documents (PRD §5 Step 3, PDF pp. 14, 31–32).
 *
 * Content is the source-validated enrollment walkthrough from
 * `formHelp.enrollment` (15 numbered callouts confirmed against the Version 4.0
 * form and procurement PDF pp.31–32). The Figma prototype supplied the
 * interaction design only — its box content was not source-accurate.
 */

type Who = "Office" | "Patient" | "Prescriber" | "Office + Patient";

/** Who acts on each box, derived from the form's printed section structure. */
const SECTION_WHO: Record<string, Who> = {
  "Form header": "Office",
  "Support options": "Office",
  "Patient Information": "Office + Patient",
  "Insurance Information": "Office + Patient",
  "Patient Authorization": "Patient",
  "Version control": "Office",
  "Prescription Information": "Prescriber",
  "Prescriber Information": "Prescriber",
  "Prescriber Authorization": "Prescriber",
};

const WHO_STYLE: Record<Who, { bg: string; color: string; Icon: typeof User }> = {
  Office: { bg: "var(--color-surface-blue-subtle)", color: "var(--color-brand-secondary)", Icon: FileText },
  Patient: { bg: "var(--color-surface-pink)", color: "var(--color-brand-primary)", Icon: User },
  Prescriber: { bg: "var(--color-surface-blue)", color: "var(--color-brand-secondary)", Icon: ShieldCheck },
  "Office + Patient": { bg: "var(--color-surface-muted)", color: "var(--color-text-primary)", Icon: Users },
};

function whoForBox(box: FormHelpBox): Who {
  return (box.section && SECTION_WHO[box.section]) || "Office";
}

function WhoBadge({ who }: { who: Who }) {
  const { bg, color, Icon } = WHO_STYLE[who];
  return (
    <span className={styles.whoBadge} style={{ backgroundColor: bg, color }}>
      <Icon size={12} aria-hidden />
      {who}
    </span>
  );
}

function Callout({
  tone,
  icon: Icon,
  title,
  children,
}: {
  tone: "warn" | "info";
  icon: typeof AlertCircle;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`${styles.callout} ${tone === "warn" ? styles.calloutWarn : styles.calloutInfo}`}>
      <Icon size={18} aria-hidden />
      <div>
        <div className={styles.calloutTitle}>{title}</div>
        <div className={styles.calloutBody}>{children}</div>
      </div>
    </div>
  );
}

const MINOR_STEPS = [
  "A parent or legal guardian may sign the patient authorization on the patient's behalf (Box 6).",
  'Record the relationship in the "Relationship to patient if signing on their behalf" line on page 2.',
  "List the patient's name on the form even when a parent/guardian signs (Box 8).",
  "On page 3, the prescriber certifies that the minor's parent/guardian has consented to treatment, or that the patient has capacity to consent under state law.",
];

const SIGNED_BY = [
  ["Patient Authorization (Boxes 5–8)", "Patient or guardian", "Required once a Prescription Order is requested"],
  ["Prescription signature line (Box 11)", "Prescriber", "To complete the prescription"],
  ["Prescriber Authorization (Box 14)", "Prescriber", "On ALL submissions"],
  ["Version number (Box 10)", "Office", "Match across all pages before submitting"],
];

export function Step3Documents() {
  const enrollment = formHelp.enrollment;
  const boxes = enrollment.boxes as FormHelpBox[];
  const [selected, setSelected] = useState(0);

  const formItems = forms.items as FormAsset[];
  const interactive = formItems.find((f) => f.id === "enrollment-interactive");
  const sample = formItems.find((f) => f.id === "enrollment-sample");

  const current = boxes[selected];

  /** Group boxes by page so the list shows the 3-page structure. */
  const pageGroups = useMemo(() => {
    const groups: { page: number; items: { box: FormHelpBox; index: number }[] }[] = [];
    boxes.forEach((box, index) => {
      const page = box.page ?? 1;
      let group = groups.find((g) => g.page === page);
      if (!group) {
        group = { page, items: [] };
        groups.push(group);
      }
      group.items.push({ box, index });
    });
    return groups;
  }, [boxes]);

  return (
    <div className={styles.root}>
      <p className={styles.intro}>
        The enrollment form is completed with the patient. Walk through each of
        the 15 numbered callouts on the form to see what it requires, who
        completes it, and the signature rules that keep a submission from being
        rejected.
      </p>

      {/* Form download band */}
      <div className={styles.downloadBand}>
        <div className={styles.downloadInfo}>
          <FileText size={22} aria-hidden />
          <div>
            <div className={styles.downloadTitle}>{enrollment.title}</div>
            <div className={styles.downloadMeta}>
              Version {enrollment.formVersion} · {enrollment.pageCount} pages ·
              fax to {enrollment.fax}
            </div>
          </div>
        </div>
        <div className={styles.downloadActions}>
          {interactive && (
            <a className={styles.btnPrimary} {...fileLinkProps(interactive.href)}>
              <FileDown size={14} aria-hidden />
              Interactive PDF
            </a>
          )}
          {sample && (
            <a className={styles.btnSecondary} {...fileLinkProps(sample.href)}>
              <FileDown size={14} aria-hidden />
              Sample (printable)
            </a>
          )}
        </div>
      </div>

      {/* Box-by-box walkthrough */}
      <div>
        <div className={styles.kicker}>Box-by-box walkthrough</div>
        <p className={styles.kickerSub}>Select a callout to see what it requires.</p>

        <div className={styles.walkthrough}>
          <ol className={styles.boxList} aria-label="Enrollment form callouts">
            {pageGroups.map((group) => (
              <li key={group.page}>
                <div className={styles.pageGroupLabel}>Page {group.page}</div>
                <ul>
                  {group.items.map(({ box, index }) => {
                    const active = index === selected;
                    return (
                      <li key={box.box}>
                        <button
                          type="button"
                          className={`${styles.boxItem} ${active ? styles.boxItemActive : ""}`}
                          aria-current={active ? "true" : undefined}
                          onClick={() => setSelected(index)}
                        >
                          <span className={`${styles.boxNum} ${active ? styles.boxNumActive : ""}`}>
                            {box.box}
                          </span>
                          <span className={styles.boxLabel}>{box.label}</span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </li>
            ))}
          </ol>

          <div className={styles.detail} aria-live="polite">
            <div className={styles.detailHead}>
              <span className={styles.detailNum}>{current.box}</span>
              <h4 className={styles.detailTitle}>{current.label}</h4>
              <WhoBadge who={whoForBox(current)} />
            </div>

            <div className={styles.detailField}>
              <div className={styles.detailFieldLabel}>What this callout tells you</div>
              <p className={styles.detailGuidance}>{current.guidance}</p>
            </div>

            {current.rule === "signature" && (
              <div className={styles.calloutGrid}>
                <Callout tone="warn" icon={PenLine} title="Signature rule">
                  This is a signature requirement — confirm it before faxing the form.
                </Callout>
              </div>
            )}

            <div className={styles.detailNav}>
              <button
                type="button"
                className={styles.navPrev}
                disabled={selected === 0}
                onClick={() => setSelected((n) => Math.max(0, n - 1))}
              >
                ← Previous
              </button>
              <button
                type="button"
                className={styles.navNext}
                disabled={selected === boxes.length - 1}
                onClick={() => setSelected((n) => Math.min(boxes.length - 1, n + 1))}
              >
                Next →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Signature rules */}
      <div>
        <div className={styles.kicker}>Signature rules</div>
        <div className={styles.calloutGrid}>
          <Callout tone="warn" icon={PenLine} title="Patient signature">
            Not required if only a Patient Benefit Investigation is requested.
            Once a Prescription Order is requested, the patient (or
            parent/guardian if &lt; 18) must sign and date (Boxes 5–7).
          </Callout>
          <Callout tone="warn" icon={ShieldCheck} title="Prescriber authorization">
            Required on <strong>ALL</strong> Organon Access Program Enrollment
            Form submissions, with a date (Boxes 14–15).
          </Callout>
          <Callout tone="info" icon={CheckCircle2} title="Version-control number">
            Printed on every page. All pages submitted must share the same
            version number or the form is incomplete (Box 10).
          </Callout>
          <Callout tone="info" icon={User} title="Patient name on every page">
            List the patient's name even when a parent or guardian signs on their
            behalf (Box 8).
          </Callout>
        </div>
      </div>

      {/* Minor handling */}
      <div>
        <div className={styles.kicker}>Patient is under 18</div>
        <div className={styles.minorCard}>
          <ol className={styles.minorList}>
            {MINOR_STEPS.map((step, i) => (
              <li key={step}>
                <span className={styles.minorStepNum}>{i + 1}</span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>

      {/* Who signs what */}
      <div>
        <div className={styles.kicker}>Who signs what — with the patient present</div>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Section</th>
                <th>Signed by</th>
                <th>When</th>
              </tr>
            </thead>
            <tbody>
              {SIGNED_BY.map(([section, who, when]) => (
                <tr key={section}>
                  <td>{section}</td>
                  <td className={styles.signedBy}>{who}</td>
                  <td>{when}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
