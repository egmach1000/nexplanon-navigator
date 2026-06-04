import { Drawer } from "../ui/Drawer";
import { CopyButton } from "../ui/CopyButton";
import {
  flatCodes,
  getContact,
  quickRefContactIds,
  telHref,
} from "../../content";
import styles from "./QuickRefDrawer.module.css";

/**
 * Slide-out quick reference available from every step (PRD §6): all billing
 * codes (copyable) and key contacts. Reads entirely from the content layer.
 */
export function QuickRefDrawer({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  return (
    <Drawer
      open={open}
      onClose={onClose}
      title="Quick Reference"
      description="Copyable codes and key contacts — available from every step."
    >
      <h3 className={styles.sectionHeading}>Billing &amp; Coding Reference</h3>
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
    </Drawer>
  );
}
