import { useEffect, type RefObject } from "react";

const FOCUSABLE = [
  "a[href]",
  "button:not([disabled])",
  "textarea:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(",");

/**
 * Traps keyboard focus inside `containerRef` while `active`, restoring focus to
 * the previously focused element on deactivation. Tab/Shift+Tab cycle within
 * the container. Used by Modal and Drawer for WCAG 2.1 AA keyboard support.
 */
export function useFocusTrap(
  containerRef: RefObject<HTMLElement>,
  active: boolean
) {
  useEffect(() => {
    if (!active) return;
    const container = containerRef.current;
    if (!container) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;

    // Move focus into the dialog on open.
    const focusFirst = () => {
      const focusables = container.querySelectorAll<HTMLElement>(FOCUSABLE);
      (focusables[0] ?? container).focus();
    };
    focusFirst();

    function onKeyDown(e: KeyboardEvent) {
      if (e.key !== "Tab") return;
      const focusables = Array.from(
        container!.querySelectorAll<HTMLElement>(FOCUSABLE)
      ).filter((el) => el.offsetParent !== null || el === document.activeElement);
      if (focusables.length === 0) {
        e.preventDefault();
        container!.focus();
        return;
      }
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const activeEl = document.activeElement;

      if (e.shiftKey && activeEl === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && activeEl === last) {
        e.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown, true);
    return () => {
      document.removeEventListener("keydown", onKeyDown, true);
      previouslyFocused?.focus?.();
    };
  }, [active, containerRef]);
}
