

In /references look at plan.md. It can guide you through a phased approach to create an experience for the Nexplanon Navigator. 

First review: plan.md then as you work through the phase you can reference the following materials as needed:

##DESIGN VALUES
design.md has information about the Organon design tokens — the pink, typography, spacing, component styles, the tab/card patterns.  If design.md and plan.md ever conflict on UI, design.md wins.

##FIGMA MAKE PROTOTYPE
located in references/figma-make-prototype this is a fully interactive experience that you can use as your model for building. However, you must reference the source PDF when creating copy. The Figma Make prototype is mostly accurate but is not the content source of truth, only the design model for implementation. You can reference /references/figma-make-prototype/HANDOFF.md for further information.

##SUMMARY
summary.md  — definitely useful, arguably the most useful after plan.md. The plan tells Claude Code what to build; summary.md tells it why each step exists and what the source actually says. When it's wiring up Step 4 and needs to confirm a code description or a program rule, summary.md is faster and less error-prone than re-reading the PDF. 

##SOURCE PDF
NEXPLANON-procurement.pdf — It's the ground truth. plan.md and SUMMARY.md are my interpretation just as the Figma Make prototype is the visual expression; if there's ever a discrepancy or a box-level detail I summarized loosely (e.g., exact CMS-1500 box wording, the McKesson phone number I had as 855-571-21xx), you should be able to open the original and confirm. Treat the PDF as authoritative, the .md files as the fast path and the Figma Make prototype as the design framework.

##TABLE OF CONTENTS
table-of-contents.md — useful but secondary. Its main value is as a lookup index ("which page covers UB-04?") so you can jump to the right spot in the PDF to verify a detail. If you give it the PDF, the TOC is a nice accelerant but not load-bearing. 

##FORM ASSETS
In /resources for your edification but mostly additive to the available SOURCE PDF knowledge