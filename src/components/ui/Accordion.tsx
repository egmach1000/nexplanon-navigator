import { useId, useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import styles from "./Accordion.module.css";

export type AccordionItemDef = {
  id: string;
  label: string;
  content: ReactNode;
};

type AccordionProps = {
  items: AccordionItemDef[];
  /** ids open on first render. */
  defaultOpen?: string[];
  /** Allow only one panel open at a time. */
  single?: boolean;
};

/** Accessible disclosure group: button-controlled regions with aria-expanded. */
export function Accordion({ items, defaultOpen = [], single = false }: AccordionProps) {
  const [open, setOpen] = useState<Set<string>>(new Set(defaultOpen));
  const baseId = useId();

  function toggle(id: string) {
    setOpen((prev) => {
      const next = new Set(single ? [] : prev);
      if (prev.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <div className={styles.root}>
      {items.map((item) => {
        const isOpen = open.has(item.id);
        const headerId = `${baseId}-${item.id}-header`;
        const panelId = `${baseId}-${item.id}-panel`;
        return (
          <div key={item.id} className={styles.item}>
            <h3 className={styles.heading}>
              <button
                type="button"
                id={headerId}
                aria-expanded={isOpen}
                aria-controls={panelId}
                className={styles.trigger}
                onClick={() => toggle(item.id)}
              >
                <span>{item.label}</span>
                <ChevronDown
                  size={18}
                  aria-hidden
                  className={isOpen ? styles.chevronOpen : styles.chevron}
                />
              </button>
            </h3>
            {isOpen && (
              <div
                id={panelId}
                role="region"
                aria-labelledby={headerId}
                className={styles.panel}
              >
                {item.content}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
