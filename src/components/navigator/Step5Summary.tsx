import {
  CheckCircle2,
  ClipboardList,
  FileText,
  Hash,
  Phone,
  Printer,
  RotateCcw,
} from "lucide-react";
import {
  codes,
  contacts,
  distributors,
  forms,
  ordering,
  specialtyPharmacies,
  summaryContent,
  fileLinkProps,
  telHref,
  type CodeGroup,
  type Contact,
  type Distributor,
  type FormAsset,
  type ProcessStep,
} from "../../content";
import type { BenefitType, StepHelpers } from "./types";
import styles from "./Step5Summary.module.css";

type ResolvedContact = { name: string; phone: string };

/** Flatten every code into {label, value} rows for the recap + playbook. */
function codeRows() {
  return (codes.groups as CodeGroup[]).flatMap((g) =>
    g.codes.map((c) => ({ label: g.system, value: c.value })),
  );
}

/** Resolve the pathway-specific data from the content layer. */
function resolvePathway(benefit: "medical" | "pharmacy") {
  const pathway = summaryContent.pathways[benefit];
  const orderingSteps: ProcessStep[] =
    benefit === "medical" ? ordering.buyBill.steps : ordering.aob.steps;

  const source =
    pathway.contactSource === "distributors" ? distributors : specialtyPharmacies;
  const oap = (contacts.items as Contact[]).find((c) => c.id === "oap");
  const pathwayContacts: ResolvedContact[] = [
    ...(source.items as Distributor[]).map((d) => ({ name: d.name, phone: d.phone })),
    ...(oap?.phone ? [{ name: oap.name, phone: oap.phone }] : []),
  ];

  const documents = pathway.documentIds
    .map((id) => (forms.items as FormAsset[]).find((f) => f.id === id))
    .filter((f): f is FormAsset => Boolean(f));

  return { pathway, orderingSteps, pathwayContacts, documents };
}

function buildPrintHtml(
  benefitLabel: string,
  headline: string,
  summary: string,
  orderingSteps: ProcessStep[],
  documents: FormAsset[],
  pathwayContacts: ResolvedContact[],
  nextActions: string[],
) {
  const today = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const esc = (s: string) =>
    s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const rows = codeRows();
  return `<!doctype html>
<html>
<head>
<meta charset="utf-8" />
<title>NEXPLANON Navigator — Playbook</title>
<style>
  * { box-sizing: border-box; }
  body { font-family: Montserrat, system-ui, sans-serif; color: #171717; margin: 0; padding: 32px; }
  h1 { font-size: 22px; margin: 8px 0 4px; color: #e20177; }
  h2 { font-size: 13px; text-transform: uppercase; letter-spacing: .7px; color: #e20177; margin: 20px 0 8px; border-bottom: 1px solid #e8c8db; padding-bottom: 4px; }
  p, li { font-size: 12px; line-height: 1.5; }
  ol, ul { margin: 4px 0 0 18px; padding: 0; }
  .meta { font-size: 11px; color: #555; margin-bottom: 16px; }
  .pill { display: inline-block; background: #ffe5f3; color: #e20177; font-weight: 700; padding: 3px 10px; border-radius: 999px; font-size: 11px; letter-spacing: .5px; text-transform: uppercase; }
  .codes { display: grid; grid-template-columns: repeat(4, 1fr); gap: 6px; }
  .code { border: 1px solid #dfdfdf; border-radius: 6px; padding: 6px 8px; }
  .code .label { font-size: 9px; color: #1b4298; text-transform: uppercase; letter-spacing: .5px; font-weight: 700; }
  .code .value { font-size: 13px; font-weight: 700; }
  .codes-footnote { margin-top: 8px; font-size: 9px; line-height: 1.5; color: #555; }
  .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  .footer { margin-top: 24px; font-size: 10px; color: #555; border-top: 1px solid #dfdfdf; padding-top: 8px; }
  @page { margin: 0.5in; }
</style>
</head>
<body>
  <span class="pill">NEXPLANON Navigator playbook</span>
  <h1>${esc(headline)}</h1>
  <div class="meta">Generated ${esc(today)} · Coverage selected: ${esc(benefitLabel)}</div>
  <p>${esc(summary)}</p>

  <h2>Ordering pathway</h2>
  <ol>${orderingSteps.map((s) => `<li><strong>${esc(s.title)}</strong> — ${esc(s.detail)}</li>`).join("")}</ol>

  <h2>Codes that apply</h2>
  <div class="codes">
    ${rows.map((r) => `<div class="code"><div class="label">${esc(r.label)}</div><div class="value">${esc(r.value)}</div></div>`).join("")}
  </div>
  ${codes.footnote ? `<p class="codes-footnote">${esc(codes.footnote)}</p>` : ""}

  <div class="grid-2">
    <div>
      <h2>Documents</h2>
      <ul>${documents.map((d) => `<li>${esc(d.title)}</li>`).join("")}</ul>
    </div>
    <div>
      <h2>Key contacts</h2>
      <ul>${pathwayContacts.map((c) => `<li><strong>${esc(c.name)}</strong> — ${esc(c.phone)}</li>`).join("")}</ul>
    </div>
  </div>

  <h2>Next actions</h2>
  <ol>${nextActions.map((a) => `<li>${esc(a)}</li>`).join("")}</ol>

  <div class="footer">
    Codes shown are possible codes only and may change. You are solely responsible for determining the appropriate codes for any service rendered. Diagnosis codes are selected only by a healthcare professional. Coverage, coding, and reimbursement policies vary by payer.
  </div>
  <script>window.onload = () => { window.print(); };</script>
</body>
</html>`;
}

/**
 * Step 5 — Summary & resources (PRD §5 Step 5). Recaps the pathway chosen in
 * Step 1, the codes that apply, documents, key contacts, and next actions, with
 * a printable one-page playbook. All content composes from the content layer.
 */
export function Step5Summary({
  benefitType,
  helpers,
}: {
  benefitType: BenefitType | null;
  helpers: StepHelpers;
}) {
  if (benefitType !== "medical" && benefitType !== "pharmacy") {
    return (
      <div className={styles.empty}>
        <p className={styles.emptyText}>
          Choose a coverage type in Step 1 to generate your tailored playbook —
          the recap, codes, documents, and contacts are based on whether
          NEXPLANON is covered under the medical or pharmacy benefit.
        </p>
        <button type="button" className={styles.emptyBtn} onClick={() => helpers.goToStep(0)}>
          Go to Step 1
        </button>
      </div>
    );
  }

  const { pathway, orderingSteps, pathwayContacts, documents } = resolvePathway(benefitType);
  const benefitLabel = benefitType === "medical" ? "Medical benefit" : "Pharmacy benefit";
  const rows = codeRows();

  function printPlaybook() {
    const html = buildPrintHtml(
      benefitLabel,
      pathway.headline,
      pathway.summary,
      orderingSteps,
      documents,
      pathwayContacts,
      pathway.nextActions,
    );
    const w = window.open("", "_blank", "width=900,height=1100");
    if (!w) return;
    w.document.write(html);
    w.document.close();
  }

  return (
    <div className={styles.root}>
      {/* Hero recap */}
      <div className={styles.hero}>
        <div className={styles.heroRow}>
          <div className={styles.heroMain}>
            <span className={styles.heroPill}>
              <CheckCircle2 size={13} aria-hidden /> Your tailored playbook
            </span>
            <h3 className={styles.heroHeadline}>{pathway.headline}</h3>
            <p className={styles.heroSummary}>{pathway.summary}</p>
          </div>
          <div className={styles.heroActions}>
            <button type="button" className={styles.btnPrimary} onClick={printPlaybook}>
              <Printer size={16} aria-hidden />
              Print playbook
            </button>
            <button type="button" className={styles.btnGhost} onClick={helpers.restart}>
              <RotateCcw size={16} aria-hidden />
              Start over
            </button>
          </div>
        </div>
      </div>

      <div className={styles.cardGrid}>
        {/* Ordering recap */}
        <section className={styles.card}>
          <div className={styles.cardHead}>
            <ClipboardList size={18} aria-hidden />
            <h3 className={styles.cardTitle}>Ordering pathway</h3>
          </div>
          <div className={styles.cardBody}>
            <ol className={styles.numberedList}>
              {orderingSteps.map((s, i) => (
                <li key={i}>
                  <span className={styles.stepNum}>{i + 1}</span>
                  <span className={styles.stepText}>
                    {s.title}
                    <span className={styles.stepDetail}>{s.detail}</span>
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Codes recap */}
        <section className={styles.card}>
          <div className={styles.cardHead}>
            <Hash size={18} aria-hidden />
            <h3 className={styles.cardTitle}>Codes that apply</h3>
          </div>
          <div className={styles.cardBody}>
            <div className={styles.codesGrid}>
              {rows.map((r) => (
                <div key={r.value} className={styles.codeChip}>
                  <div className={styles.codeChipLabel}>{r.label}</div>
                  <div className={styles.codeChipValue}>{r.value}</div>
                </div>
              ))}
            </div>
            {pathway.codesNote && <p className={styles.codesNote}>{pathway.codesNote}</p>}
            <p className={styles.codesHint}>Use the Quick Reference drawer to copy any code.</p>
            {codes.footnote && <p className={styles.codesFootnote}>{codes.footnote}</p>}
          </div>
        </section>

        {/* Documents */}
        <section className={styles.card}>
          <div className={styles.cardHead}>
            <FileText size={18} aria-hidden />
            <h3 className={styles.cardTitle}>Documents you'll need</h3>
          </div>
          <div className={styles.cardBody}>
            <ul className={styles.docList}>
              {documents.map((d) => (
                <li key={d.id}>
                  <a className={styles.docLink} {...fileLinkProps(d.href)}>
                    <FileText size={14} aria-hidden />
                    {d.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Contacts */}
        <section className={styles.card}>
          <div className={styles.cardHead}>
            <Phone size={18} aria-hidden />
            <h3 className={styles.cardTitle}>Key contacts</h3>
          </div>
          <div className={styles.cardBody}>
            <ul className={styles.contactList}>
              {pathwayContacts.map((c) => (
                <li key={c.name} className={styles.contactRow}>
                  <span className={styles.contactName}>{c.name}</span>
                  <a className={styles.contactPhone} href={telHref(c.phone)}>
                    {c.phone}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>

      {/* Next actions */}
      <section className={styles.fullCard}>
        <div className={styles.cardHead}>
          <CheckCircle2 size={18} aria-hidden />
          <h3 className={styles.cardTitle}>Next actions</h3>
        </div>
        <div className={styles.cardBody}>
          <ol className={styles.numberedList}>
            {pathway.nextActions.map((a, i) => (
              <li key={i}>
                <span className={styles.stepNumOutline}>{i + 1}</span>
                <span className={styles.stepText}>{a}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <p className={styles.footnote}>
        The playbook is a working summary — coverage, codes, and reimbursement
        policies vary by payer and may change. Final coding is the HCP's
        responsibility.
      </p>
    </div>
  );
}
