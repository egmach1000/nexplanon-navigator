# NEXPLANON Navigator

Guided HCP ordering/documents/billing experience for the Organon Access Program
NEXPLANON product-resources tab. A static, zero-backend **Vite + React +
TypeScript** SPA styled with **CSS Modules**.

See `references/plan.md` for the full PRD and `references/design.md` for the
Organon design system. The source of truth for all content is
`sources/resources/NEXPLANON-procurement.pdf`.

## Run

```bash
npm install
npm run dev       # local dev server
npm run build     # typecheck (tsc -b) + production build to dist/
npm run preview   # preview the production build
```

## Structure

```
src/
  App.tsx                     # Site chrome + tabs + NEXPLANON tab + Navigator modal
  content/                    # All volatile content as JSON (PRD §7) + typed loader (index.ts)
  components/
    ui/                       # Reusable a11y primitives: Modal, Drawer, Accordion, CopyButton, useFocusTrap
    site/                     # SiteChrome, ProductTabs, NexplanonTab (BILDYOS-parity baseline)
    navigator/                # NavigatorModal, steps registry, IsiBar, QuickRefDrawer, step bodies
  styles/                     # tokens.css (design tokens as CSS vars) + global.css
```

## Content model

Every record in `src/content/*.json` is editable without touching components and
carries `lastReviewed` + a `sourcePage` reference back to the procurement PDF.
Items flagged `needsVerification: true` (e.g. McKesson phone, enrollment-form
boxes) must be confirmed against the PDF before their parcel ships.

## Build status

- **Parcel A — Foundation:** ✅ content schema + seed JSON; focus-trapped modal
  shell; step framework (progress, clickable stepper, back/continue gating);
  persistent ISI bar; quick-reference drawer; BILDYOS-parity tab page + launch CTA.
- **Parcel B — Steps 1 & 2:** ✅ full coverage triage with "Not sure"
  verification helper (payer-call script + CSCN benefit investigation) and
  Medicaid note; Step 2 ordering branches on `benefitType` — Buy & Bill /
  AOB process strips, distributor & specialty-pharmacy cards, e-prescribe FAQs,
  and a select-state vendors expander. Content verified against PDF pp. 8–21.
- Parcels C–E (steps 3–5 full content) are scaffolded as placeholders in
  `src/components/navigator/steps.tsx`.
