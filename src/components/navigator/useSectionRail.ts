import { useEffect, useLayoutEffect, useState, type RefObject } from "react";

export type RailSection = { id: string; label: string };

/**
 * Scrollspy for the navigator's left rail. Collects `[data-rail]` anchors inside
 * `contentRef` (their `data-rail` value is the rail label), then tracks which one
 * is currently in view within the `scrollRef` scroll container as the user
 * scrolls. Re-collects whenever `resetKey` changes — i.e. when the step or its
 * conditional branch swaps the rendered sections.
 */
export function useSectionRail(
  scrollRef: RefObject<HTMLElement | null>,
  contentRef: RefObject<HTMLElement | null>,
  resetKey: unknown,
) {
  const [sections, setSections] = useState<RailSection[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  // Collect anchors after each step/branch render.
  useLayoutEffect(() => {
    const content = contentRef.current;
    if (!content) {
      setSections([]);
      return;
    }
    const els = Array.from(content.querySelectorAll<HTMLElement>("[data-rail]"));
    const list = els.map((el, i) => {
      if (!el.id) el.id = `rail-section-${i}`;
      return { id: el.id, label: el.dataset.rail ?? "" };
    });
    setSections(list);
    setActiveId(list[0]?.id ?? null);
    // resetKey intentionally drives re-collection; refs are stable.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetKey]);

  // Track the section nearest the top of the scroll container.
  useEffect(() => {
    const scroller = scrollRef.current;
    if (!scroller || sections.length === 0) return;

    let raf = 0;
    const measure = () => {
      raf = 0;
      const scrollerTop = scroller.getBoundingClientRect().top;
      const line = 100; // activation line, px below the scroll container top
      let current = sections[0].id;
      for (const s of sections) {
        const el = document.getElementById(s.id);
        if (!el) continue;
        if (el.getBoundingClientRect().top - scrollerTop <= line) current = s.id;
        else break;
      }
      setActiveId(current);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(measure);
    };

    measure();
    scroller.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      scroller.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [scrollRef, sections]);

  const scrollTo = (id: string) => {
    const scroller = scrollRef.current;
    const el = document.getElementById(id);
    if (!scroller || !el) return;
    const top =
      el.getBoundingClientRect().top -
      scroller.getBoundingClientRect().top +
      scroller.scrollTop -
      24;
    scroller.scrollTo({ top, behavior: "smooth" });
  };

  return { sections, activeId, scrollTo };
}
