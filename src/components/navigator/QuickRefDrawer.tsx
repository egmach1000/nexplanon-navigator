import { Download, ExternalLink } from "lucide-react";
import { Drawer } from "../ui/Drawer";
import { Accordion, type AccordionItemDef } from "../ui/Accordion";
import { CopyButton } from "../ui/CopyButton";
import {
  fileLinkProps,
  flatCodes,
  getContact,
  getForm,
  quickRefContactIds,
  quickRefFormGroups,
  telHref,
} from "../../content";
import styles from "./QuickRefDrawer.module.css";

/**
 * Slide-out quick reference available from every step (PRD §6): key contacts
 * (always visible), plus the enrollment / billing resource downloads and the
 * copyable billing codes in collapsible panels. Reads entirely from the
 * content layer.
 */
export function QuickRefDrawer({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const collapsible: AccordionItemDef[] = [
    {
      id: "forms",
      label: "Forms & Resources",
      content: (
        <>
          {quickRefFormGroups.map((group) => (
            <div key={group.heading} className={styles.formGroup}>
              <h4 className={styles.groupHeading}>{group.heading}</h4>
              <ul className={styles.list}>
                {group.formIds.map((id) => {
                  const f = getForm(id);
                  if (!f || !f.href || f.href === "#") return null;
                  const external = /^https?:/.test(f.href);
                  const Icon = external ? ExternalLink : Download;
                  return (
                    <li key={f.id}>
                      <a {...fileLinkProps(f.href)} className={styles.formCard}>
                        <span className={styles.formMain}>
                          <span className={styles.formTitle}>{f.title}</span>
                          {f.description && (
                            <span className={styles.formDesc}>{f.description}</span>
                          )}
                        </span>
                        <Icon size={18} aria-hidden className={styles.formIcon} />
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </>
      ),
    },
    {
      id: "codes",
      label: "Billing & Coding Reference",
      content: (
        <ul className={styles.list}>
          {flatCodes.map((c) => (
            <li key={`${c.system}-${c.value}`} className={styles.codeCard}>
              <div className={styles.codeMain}>
                <div className={styles.codeSystem}>{c.system}</div>
                <div className={styles.codeValue}>{c.value}</div>
                <div className={styles.codeNote}>{c.description}</div>
              </div>
              <CopyButton value={c.value} />
            </li>
          ))}
        </ul>
      ),
    },
  ];

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title="Quick Reference"
      description="Key contacts, copyable codes, and forms — available from every step."
    >
      <h3 className={styles.sectionHeading}>Key Contacts</h3>
      <ul className={styles.list}>
        {quickRefContactIds.map((id) => {
          const c = getContact(id);
          if (!c) return null;
          return (
            <li key={c.id} className={styles.contactCard}>
              <div className={styles.contactName}>{c.name}</div>
              {c.phone && (
                <div className={styles.contactLine}>
                  <span className={styles.contactKey}>Phone:</span>{" "}
                  <a href={telHref(c.phone)} className={styles.contactLink}>
                    {c.phone}
                  </a>
                </div>
              )}
              {c.fax && (
                <div className={styles.contactLine}>
                  <span className={styles.contactKey}>Fax:</span> {c.fax}
                </div>
              )}
              {c.hours && (
                <div className={styles.contactLine}>
                  <span className={styles.contactKey}>Hours:</span> {c.hours}
                </div>
              )}
            </li>
          );
        })}
      </ul>

      <div className={styles.collapsibleWrap}>
        <Accordion items={collapsible} defaultOpen={["codes"]} />
      </div>
    </Drawer>
  );
}
