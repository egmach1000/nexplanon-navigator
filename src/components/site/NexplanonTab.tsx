import {
  Download,
  ExternalLink,
  Sparkles,
  SquareArrowOutUpRight,
} from "lucide-react";
import { Accordion, type AccordionItemDef } from "../ui/Accordion";
import {
  distributors,
  forms,
  isi,
  specialtyPharmacies,
  fileLinkProps,
  telHref,
  enrollmentFormIds,
  billingResourceIds,
  type Distributor,
  type FormAsset,
} from "../../content";
import styles from "./NexplanonTab.module.css";

const PI_LINK =
  isi.links.find((l) => l.label === "Prescribing Information")?.href ?? "#";

function FormTile({ form }: { form: FormAsset }) {
  return (
    <a {...fileLinkProps(form.href)} className={styles.tile}>
      <span>
        <span className={styles.tileTitle}>{form.title}</span>
        {form.description && (
          <span className={styles.tileDesc}>{form.description}</span>
        )}
      </span>
      <Download size={20} aria-hidden className={styles.tileIcon} />
    </a>
  );
}

function ContactCard({ d }: { d: Distributor }) {
  return (
    <div className={styles.contactCard}>
      <div className={styles.contactName}>{d.name}</div>
      {d.description && <p className={styles.contactDesc}>{d.description}</p>}
      <p className={styles.contactLine}>
        <span className={styles.contactKey}>Phone:</span>{" "}
        <a href={telHref(d.phone)}>{d.phone}</a>
      </p>
      {d.fax && (
        <p className={styles.contactLine}>
          <span className={styles.contactKey}>Fax:</span> {d.fax}
        </p>
      )}
      {d.website && (
        <p className={styles.contactLine}>
          <span className={styles.contactKey}>Web:</span>{" "}
          <a {...fileLinkProps(d.website)} className={styles.contactWebLink}>
            {d.website.replace(/^https?:\/\//, "")}
            <ExternalLink size={12} aria-hidden />
          </a>
        </p>
      )}
    </div>
  );
}

export function NexplanonTab({ onLaunch }: { onLaunch: () => void }) {
  const byIds = (ids: string[]) =>
    ids
      .map((id) => (forms.items as FormAsset[]).find((f) => f.id === id))
      .filter((f): f is FormAsset => Boolean(f));

  const enrollmentForms = byIds(enrollmentFormIds);
  const billingResources = byIds(billingResourceIds);

  const accordionItems: AccordionItemDef[] = [
    {
      id: "forms",
      label: "Download and Fax Enrollment",
      content: (
        <div className={styles.tileGrid}>
          {enrollmentForms.map((f) => (
            <FormTile key={f.id} form={f} />
          ))}
        </div>
      ),
    },
    {
      id: "billing",
      label: "Billing & Reimbursement",
      content: (
        <div className={styles.tileGrid}>
          {billingResources.map((f) => (
            <FormTile key={f.id} form={f} />
          ))}
        </div>
      ),
    },
    {
      id: "medical",
      label: "Medical Benefits",
      content: (
        <div className={styles.benefitBody}>
          <p className={styles.benefitLead}>
            This is the most common form of coverage for NEXPLANON. Both the
            drug and the procedure are covered under the same benefit.
          </p>
          <p className={styles.benefitText}>{distributors.intro}</p>
          <div className={styles.cardGrid}>
            {(distributors.items as Distributor[]).map((d) => (
              <ContactCard key={d.id} d={d} />
            ))}
          </div>
        </div>
      ),
    },
    {
      id: "pharmacy",
      label: "Pharmacy Benefits",
      content: (
        <div className={styles.benefitBody}>
          <p className={styles.benefitLead}>
            This is the less common form of coverage for NEXPLANON. The drug is
            covered separately from the procedure.
          </p>
          <p className={styles.benefitText}>{specialtyPharmacies.intro}</p>
          <div className={styles.cardGrid}>
            {(specialtyPharmacies.items as Distributor[]).map((d) => (
              <ContactCard key={d.id} d={d} />
            ))}
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className={styles.root}>
      {/* Product header */}
      <section className={styles.section}>
        <div className={styles.productHeader}>
          <img
            src="/logos/nexplanon.png"
            alt="NEXPLANON (etonogestrel implant) 68 mg, Radiopaque"
            className={styles.productLockup}
          />
          <div className={styles.productMeta}>
            <p className={styles.piLine}>
              Before prescribing NEXPLANON, please read the{" "}
              <a href={PI_LINK} target="_blank" rel="noreferrer" className={styles.piLink}>
                Prescribing Information
              </a>
              , including the Boxed Warning.
            </p>
            <a href="#" className={styles.hcpLink}>
              Visit the health care professional site for NEXPLANON
              <ExternalLink size={18} aria-hidden />
            </a>
          </div>
        </div>
      </section>

      {/* Navigator launch block */}
      <section className={styles.section}>
        <div className={styles.launchBlock}>
          <div className={styles.launchText}>
            <span className={styles.guidedPill}>
              <Sparkles size={14} aria-hidden /> Guided Tool
            </span>
            <h2 className={styles.launchHeadline}>Launch the NEXPLANON Navigator</h2>
            <p className={styles.launchSummary}>
              A 5-step guided walkthrough that takes your office from coverage
              verification to ordering, paperwork, and billing. Includes the
              codes, contacts, and forms you’ll need.
            </p>
            <ul className={styles.featureList}>
              <li>Coverage triage (medical vs. pharmacy)</li>
              <li>Ordering pathway by benefit type</li>
              <li>Enrollment form walkthrough</li>
              <li>Copyable billing and coding references</li>
              <li>Information about appealing denied claims</li>
            </ul>
          </div>
          <button type="button" className={styles.launchCta} onClick={onLaunch}>
            Launch Navigator
            <SquareArrowOutUpRight size={18} aria-hidden />
          </button>
        </div>
        <p className={styles.fallbackNote}>
          Prefer to browse through the resources instead? Billing and coding
          resource forms are available below.
        </p>
      </section>

      {/* Resources */}
      <section className={styles.section}>
        <h2 className={styles.resourcesHeading}>Product Billing and Coding Resources</h2>
        <div className={styles.accordionWrap}>
          <Accordion items={accordionItems} defaultOpen={[]} />
        </div>
      </section>
    </div>
  );
}
