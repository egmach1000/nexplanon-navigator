import { useState } from "react";
import {
  AlertTriangle,
  Building2,
  DollarSign,
  ExternalLink,
  FileText,
  Info,
  Package,
  ShieldCheck,
} from "lucide-react";
import { Accordion, type AccordionItemDef } from "../ui/Accordion";
import { CopyButton } from "../ui/CopyButton";
import {
  billingGuidance,
  codes,
  formHelp,
  programs,
  type Code,
  type CodeGroup,
  type FormHelpBox,
  type Program,
} from "../../content";
import styles from "./Step4Billing.module.css";

/**
 * Step 4 — Billing & coding (PRD §5 Step 4, PDF pp. 26–36). Highest-value core.
 *
 * All codes, box guidance, and program rules come from the verified content
 * layer (codes.json, formHelp.json, programs.json, billingGuidance.json). The
 * Figma prototype supplied the interaction design only.
 */

function CodeCard({ system, code }: { system: string; code: Code }) {
  return (
    <div className={styles.codeCard}>
      <div>
        <div className={styles.codeSystem}>{system}</div>
        <div className={styles.codeValue}>{code.value}</div>
        <p className={styles.codeDesc}>{code.description}</p>
      </div>
      <div className={styles.codeCopy}>
        <CopyButton value={code.value} label={`Copy ${code.value}`} />
      </div>
    </div>
  );
}

function FormBoxHelper({ boxes, label }: { boxes: FormHelpBox[]; label: string }) {
  const [selected, setSelected] = useState(0);
  const current = boxes[selected];
  return (
    <div className={styles.helper}>
      <ol className={styles.boxList} aria-label={`${label} boxes`}>
        {boxes.map((b, i) => {
          const active = i === selected;
          return (
            <li key={b.box}>
              <button
                type="button"
                className={`${styles.boxItem} ${active ? styles.boxItemActive : ""}`}
                aria-current={active ? "true" : undefined}
                onClick={() => setSelected(i)}
              >
                <span className={`${styles.boxNum} ${active ? styles.boxNumActive : ""}`}>
                  {b.box}
                </span>
                <span className={styles.boxLabel}>{b.label}</span>
              </button>
            </li>
          );
        })}
      </ol>

      <div className={styles.detail} aria-live="polite">
        <div className={styles.detailHead}>
          <span className={styles.detailBadge}>Box {current.box}</span>
          <h4 className={styles.detailTitle}>{current.label}</h4>
        </div>
        <p className={styles.detailGuidance}>{current.guidance}</p>
        {current.example && (
          <div className={styles.example}>
            <div className={styles.exampleLabel}>Example</div>
            <div className={styles.exampleValue}>{current.example}</div>
          </div>
        )}
        {current.watchOut && (
          <div className={styles.watchOut}>
            <AlertTriangle size={16} aria-hidden />
            <span>{current.watchOut}</span>
          </div>
        )}
      </div>
    </div>
  );
}

function DenialsRouter() {
  const [scenario, setScenario] = useState<"" | "partial" | "full">("");
  const items = programs.items as Program[];
  const rebate = items.find((p) => p.trigger === "under-reimbursement");
  const replacement = items.find((p) => p.trigger === "full-denial");
  const program = scenario === "partial" ? rebate : scenario === "full" ? replacement : undefined;

  return (
    <div className={styles.card}>
      <div className={styles.routerPrompt}>
        Was the claim under-reimbursed or fully denied?
      </div>
      <div className={styles.scenarioRow}>
        <button
          type="button"
          className={`${styles.scenarioBtn} ${scenario === "partial" ? styles.scenarioBtnActive : ""}`}
          aria-pressed={scenario === "partial"}
          onClick={() => setScenario("partial")}
        >
          Under-reimbursed (paid below acquisition cost)
        </button>
        <button
          type="button"
          className={`${styles.scenarioBtn} ${scenario === "full" ? styles.scenarioBtnActive : ""}`}
          aria-pressed={scenario === "full"}
          onClick={() => setScenario("full")}
        >
          Fully denied
        </button>
      </div>

      {program && (
        <div
          className={`${styles.routeResult} ${scenario === "partial" ? styles.routeRebate : styles.routeReplacement}`}
        >
          <div className={styles.routeHead}>
            {scenario === "partial" ? (
              <DollarSign size={18} aria-hidden />
            ) : (
              <Package size={18} aria-hidden />
            )}
            Route to: {scenario === "partial" ? "Rebate" : "Replacement"} program
          </div>
          <p className={styles.routeSummary}>
            {program.summary} <strong>{program.cap}.</strong>
          </p>
          <dl className={styles.routeMeta}>
            <div className={styles.routeMetaRow}>
              <dt>Eligibility</dt>
              <dd>{program.eligibility.join(" · ")}</dd>
            </div>
            {program.excludes.length > 0 && (
              <div className={styles.routeMetaRow}>
                <dt>Excludes</dt>
                <dd>{program.excludes.join(", ")}</dd>
              </div>
            )}
            <div className={styles.routeMetaRow}>
              <dt>Required</dt>
              <dd>{program.requiredDocs.join(" · ")}</dd>
            </div>
          </dl>
          <div className={styles.routeActions}>
            <a className={styles.btnPrimary} href={program.formLink} target="_blank" rel="noreferrer">
              <FileText size={14} aria-hidden />
              {scenario === "partial" ? "Rebate Request Form" : "Replacement Request Form"}
            </a>
            <a className={styles.btnSecondary} href={program.formLink} target="_blank" rel="noreferrer">
              NexplanonPro.com
              <ExternalLink size={13} aria-hidden />
            </a>
          </div>
        </div>
      )}

      {scenario && (
        <p className={styles.phiNote}>
          <ShieldCheck size={15} aria-hidden />
          {billingGuidance.phiNote}
        </p>
      )}
    </div>
  );
}

export function Step4Billing() {
  const [formTab, setFormTab] = useState<"cms" | "ub">("cms");
  const codeGroups = codes.groups as CodeGroup[];
  const cmsBoxes = formHelp.cms1500.boxes as FormHelpBox[];
  const ubBoxes = formHelp.ub04.boxes as FormHelpBox[];
  const { preAppeal, appeal, edgeCases } = billingGuidance;

  const edgeIcons: Record<string, typeof Building2> = {
    fqhc: Building2,
    "expired-rod": Package,
  };
  const edgeItems: AccordionItemDef[] = edgeCases.map((e) => {
    const Icon = edgeIcons[e.id] ?? Info;
    return {
      id: e.id,
      label: e.label,
      content: (
        <div className={styles.edgeBody}>
          <p>{e.body}</p>
          {"note" in e && e.note && <p className={styles.edgeNote}>{e.note}</p>}
          <a className={styles.edgeLink} href={e.linkUrl} target="_blank" rel="noreferrer">
            <Icon size={14} aria-hidden />
            {e.linkLabel}
            <ExternalLink size={13} aria-hidden />
          </a>
        </div>
      ),
    };
  });

  return (
    <div className={styles.root}>
      {/* Code reference */}
      <section className={styles.section} data-rail="Code reference">
        <div className={styles.sectionHead}>
          <div className={styles.kicker}>Code reference</div>
          <span className={styles.hint}>Click any code to copy.</span>
        </div>
        <p className={styles.sectionIntro}>
          Possible codes for NEXPLANON insertion, removal, and supply. Final code
          selection is the HCP's responsibility.
        </p>
        <div className={styles.codeGrid}>
          {codeGroups.flatMap((group) =>
            group.codes.map((code) => (
              <CodeCard key={`${group.system}-${code.value}`} system={group.system} code={code} />
            )),
          )}
        </div>
        {codes.footnote && <p className={styles.codeFootnote}>{codes.footnote}</p>}
      </section>

      {/* Claim form helpers */}
      <section className={styles.section} data-rail="Claim form helpers">
        <div className={styles.kicker}>Claim form helpers</div>
        <p className={styles.sectionIntro}>
          Select a box to see what to enter and where mistakes commonly happen.
        </p>
        <div className={styles.formTabs} role="tablist" aria-label="Claim form">
          <button
            type="button"
            role="tab"
            aria-selected={formTab === "cms"}
            className={`${styles.formTab} ${formTab === "cms" ? styles.formTabActive : ""}`}
            onClick={() => setFormTab("cms")}
          >
            CMS-1500 (professional)
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={formTab === "ub"}
            className={`${styles.formTab} ${formTab === "ub" ? styles.formTabActive : ""}`}
            onClick={() => setFormTab("ub")}
          >
            UB-04 (institutional)
          </button>
        </div>
        {formTab === "cms" ? (
          <FormBoxHelper boxes={cmsBoxes} label="CMS-1500" />
        ) : (
          <FormBoxHelper boxes={ubBoxes} label="UB-04" />
        )}
      </section>

      {/* Denials & coverage assurance */}
      <section className={styles.section} data-rail="Denials & appeals">
        <div className={styles.kicker}>Denials &amp; coverage assurance</div>
        <p className={styles.sectionIntro}>
          If a claim was denied or under-reimbursed, work the pre-appeal checklist
          first, then route eligible cases to Rebate or Replacement.
        </p>

        <div className={styles.card}>
          <div className={styles.cardTitle}>{preAppeal.heading}</div>
          <p className={styles.cardIntro}>{preAppeal.intro}</p>
          <ol className={styles.numberedList}>
            {preAppeal.items.map((item, i) => (
              <li key={i}>
                <span className={styles.stepNum}>{i + 1}</span>
                <span className={styles.stepText}>{item}</span>
              </li>
            ))}
          </ol>
          <p className={styles.closing}>{preAppeal.closing}</p>
        </div>

        <div className={styles.card}>
          <div className={styles.cardTitle}>{appeal.heading}</div>
          <p className={styles.cardIntro}>{appeal.intro}</p>
          <ol className={styles.numberedList}>
            {appeal.steps.map((step, i) => (
              <li key={i}>
                <span className={styles.stepNum}>{i + 1}</span>
                <span className={styles.stepText}>
                  {step.title}
                  <span className={styles.stepDetail}>{step.detail}</span>
                </span>
              </li>
            ))}
          </ol>
          <p className={styles.closing}>{appeal.routing}</p>
        </div>

        <DenialsRouter />
      </section>

      {/* Reimbursements & returns */}
      <section className={styles.section} data-rail="Reimbursements & returns">
        <div className={styles.kicker}>Reimbursements & returns</div>
        <div className={styles.edgeWrap}>
          <Accordion items={edgeItems} />
        </div>
      </section>
    </div>
  );
}
