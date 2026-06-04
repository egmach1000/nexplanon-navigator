import { useEffect, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { useFocusTrap } from "./useFocusTrap";
import styles from "./Modal.module.css";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  /** Accessible name for the dialog (rendered visually-hidden if titleId unset). */
  label: string;
  /** id of an element inside `children` that labels the dialog, if any. */
  labelledById?: string;
  children: ReactNode;
};

/**
 * Full-bleed-on-mobile / inset-on-desktop dialog. Focus-trapped, ESC-to-close,
 * background scroll locked, focus restored on close. Rendered in a portal so it
 * escapes any host stacking context when embedded in the production site.
 */
export function Modal({ open, onClose, label, labelledById, children }: ModalProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  useFocusTrap(contentRef, open);

  useEffect(() => {
    if (!open) return;
    document.body.setAttribute("data-modal-open", "true");

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.stopPropagation();
        onClose();
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.removeAttribute("data-modal-open");
    };
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div className={styles.overlay} onMouseDown={onClose}>
      <div
        ref={contentRef}
        role="dialog"
        aria-modal="true"
        aria-label={labelledById ? undefined : label}
        aria-labelledby={labelledById}
        tabIndex={-1}
        className={styles.content}
        onMouseDown={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>,
    document.body
  );
}
