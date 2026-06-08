import { useId, useState } from "react";
import { ExternalLink, Minus, Plus } from "lucide-react";
import { isi } from "../../content";
import styles from "./IsiBar.module.css";

/**
 * Persistent Important Safety Information disclosure, anchored to the bottom of
 * the modal (PRD §6). Always present, never a workflow step; surfaces the REMS
 * note, Indication, Boxed Warning summary, and links to full PI / Boxed Warning
 * / Patient Information. Collapsed by default to stay out of the workflow.
 */
export function IsiBar() {
  const [open, setOpen] = useState(false);
  const panelId = useId();

  return (
    <div className={styles.root}>
      <button
        type="button"
        className={styles.toggle}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((o) => !o)}
      >
        <span className={styles.title}>{isi.heading}</span>
        <span className={styles.action} aria-hidden>
          {open ? <Minus size={16} /> : <Plus size={16} />}
        </span>
      </button>

      {open && (
        <div id={panelId} className={styles.panel}>
          {isi.remsNote && (
            <p className={styles.rems}>
              <strong>REMS:</strong> {isi.remsNote}
            </p>
          )}

          <h4 className={styles.heading}>{isi.indication.heading}</h4>
          <p className={styles.body}>{isi.indication.body}</p>

          <h4 className={styles.heading}>{isi.boxedWarningSummary.heading}</h4>
          <p className={styles.body}>{isi.boxedWarningSummary.body}</p>

          <h4 className={styles.heading}>{isi.selectedSafety.heading}</h4>
          {isi.selectedSafety.paragraphs.map((p, i) => (
            <p key={i} className={styles.body}>
              {p}
            </p>
          ))}

          <div className={styles.links}>
            {isi.links.map((l) => (
              <a
                key={l.label}
                href={l.href}
                target="_blank"
                rel="noreferrer"
                className={styles.link}
              >
                {l.label}
                <ExternalLink size={12} aria-hidden />
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
