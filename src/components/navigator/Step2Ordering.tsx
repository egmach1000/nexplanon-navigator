import { Download, ExternalLink, Info } from "lucide-react";
import { Accordion, type AccordionItemDef } from "../ui/Accordion";
import { ProcessStrip } from "./ProcessStrip";
import {
  distributors,
  forms,
  ordering,
  specialtyPharmacies,
  stateVendors,
  fileLinkProps,
  telHref,
  type Distributor,
  type EnrollmentOption,
  type FormAsset,
} from "../../content";
import type { BenefitType } from "./types";
import styles from "./Step2Ordering.module.css";

function ContactCard({ d }: { d: Distributor }) {
  return (
    <div className={styles.card}>
      <div className={styles.cardName}>{d.name}</div>
      {d.description && <p className={styles.cardDesc}>{d.description}</p>}
      <dl className={styles.cardMeta}>
        <div className={styles.metaRow}>
          <dt>Phone</dt>
          <dd>
            <a href={telHref(d.phone)}>{d.phone}</a>
          </dd>
        </div>
        {d.fax && (
          <div className={styles.metaRow}>
            <dt>Fax</dt>
            <dd>{d.fax}</dd>
          </div>
        )}
        {d.hours && (
          <div className={styles.metaRow}>
            <dt>Hours</dt>
            <dd>{d.hours}</dd>
          </div>
        )}
        {d.website && (
          <div className={styles.metaRow}>
            <dt>Web</dt>
            <dd>
              <a href={d.website} target="_blank" rel="noreferrer" className={styles.webLink}>
                {d.website.replace(/^https?:\/\//, "")}
                <ExternalLink size={12} aria-hidden />
              </a>
            </dd>
          </div>
        )}
      </dl>
    </div>
  );
}

function EnrollmentOptionCard({ option }: { option: EnrollmentOption }) {
  const form = (forms.items as FormAsset[]).find((f) => f.id === option.formId);
  return (
    <a {...fileLinkProps(form?.href ?? "#")} className={styles.enrollCard}>
      <span>
        <span className={styles.enrollTitle}>{option.title}</span>
        <span className={styles.enrollDetail}>{option.detail}</span>
      </span>
      <Download size={20} aria-hidden className={styles.enrollIcon} />
    </a>
  );
}

function MedicalPath() {
  return (
    <section className={styles.path}>
      <p className={styles.pathIntro}>{ordering.buyBill.intro}</p>
      <div className={styles.processCard}>
        <ProcessStrip steps={ordering.buyBill.steps} />
      </div>

      <h3 className={styles.sectionHeading}>Specialty distributor accounts</h3>
      <p className={styles.neutrality}>{distributors.intro}</p>
      <div className={styles.cardGrid}>
        {(distributors.items as Distributor[]).map((d) => (
          <ContactCard key={d.id} d={d} />
        ))}
      </div>
      {distributors.promptPayNote && (
        <p className={styles.note}>
          <Info size={14} aria-hidden /> {distributors.promptPayNote}
        </p>
      )}
    </section>
  );
}

function PharmacyPath() {
  const faqItems: AccordionItemDef[] = ordering.eprescribeFaqs.items.map((f, i) => ({
    id: `faq-${i}`,
    label: f.q,
    content: <p className={styles.faqAnswer}>{f.a}</p>,
  }));

  return (
    <section className={styles.path}>
      <p className={styles.pathIntro}>{ordering.aob.intro}</p>
      <div className={styles.processCard}>
        <ProcessStrip steps={ordering.aob.steps} />
      </div>

      <h3 className={styles.sectionHeading}>Two ways to enroll</h3>
      <div className={styles.cardGrid}>
        {(ordering.enrollmentOptions as EnrollmentOption[]).map((o) => (
          <EnrollmentOptionCard key={o.id} option={o} />
        ))}
      </div>

      <h3 className={styles.sectionHeading}>Specialty pharmacy network</h3>
      <p className={styles.neutrality}>{specialtyPharmacies.intro}</p>
      <div className={styles.cardGrid}>
        {(specialtyPharmacies.items as Distributor[]).map((d) => (
          <ContactCard key={d.id} d={d} />
        ))}
      </div>

      <h3 className={styles.faqKicker}>{ordering.eprescribeFaqs.heading}</h3>
      <div className={styles.faqWrap}>
        <Accordion items={faqItems} single />
      </div>
    </section>
  );
}

function SelectStateVendors() {
  const items: AccordionItemDef[] = [
    {
      id: "state-vendors",
      label: "Available in select states",
      content: (
        <div className={styles.vendorList}>
          <p className={styles.neutrality}>{stateVendors.intro}</p>
          {stateVendors.items.map((v) => (
            <div key={v.id} className={styles.vendor}>
              <div className={styles.vendorName}>
                {v.name}
                {v.website && (
                  <a
                    href={v.website}
                    target="_blank"
                    rel="noreferrer"
                    className={styles.vendorLink}
                  >
                    <ExternalLink size={13} aria-hidden />
                  </a>
                )}
              </div>
              <ol className={styles.vendorProcess}>
                {v.process.map((p, i) => (
                  <li key={i}>
                    <span className={styles.vendorStepNum}>{i + 1}</span>
                    {p}
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>
      ),
    },
  ];
  return (
    <div className={styles.stateWrap}>
      <Accordion items={items} />
    </div>
  );
}

/** Step 2 — ordering pathway, branched on the Step 1 benefit selection. */
export function Step2Ordering({ benefitType }: { benefitType: BenefitType | null }) {
  return (
    <div>
      {benefitType === "medical" && <MedicalPath />}
      {benefitType === "pharmacy" && <PharmacyPath />}
      {(benefitType === "unsure" || benefitType === null) && (
        <>
          <div className={styles.banner}>
            <Info size={16} aria-hidden />
            <span>
              Coverage type isn’t confirmed yet. Both pathways are shown below —
              go back to Step 1 to verify, or review whichever applies.
            </span>
          </div>
          <h2 className={styles.pathLabel}>Medical benefit → Buy &amp; Bill</h2>
          <MedicalPath />
          <h2 className={styles.pathLabel}>Pharmacy benefit → AOB</h2>
          <PharmacyPath />
        </>
      )}

      <h3 className={styles.faqKicker}>Other ordering methods</h3>
      <SelectStateVendors />
    </div>
  );
}
