/**
 * Typed content layer.
 *
 * All volatile content (codes, contacts, distributors, rebate/replacement
 * rules, form links, ISI) lives in the sibling JSON files so non-engineers can
 * update codes/contacts/rules without a code change (PRD §7). Components must
 * read from here rather than hardcoding values.
 *
 * Every record carries `lastReviewed` and a `sourcePage` back to
 * NEXPLANON-procurement.pdf for auditability.
 */
import codesJson from "./codes.json";
import distributorsJson from "./distributors.json";
import specialtyPharmaciesJson from "./specialtyPharmacies.json";
import stateVendorsJson from "./stateVendors.json";
import contactsJson from "./contacts.json";
import programsJson from "./programs.json";
import formsJson from "./forms.json";
import isiJson from "./isi.json";
import formHelpJson from "./formHelp.json";
import coverageHelpJson from "./coverageHelp.json";
import orderingJson from "./ordering.json";
import billingGuidanceJson from "./billingGuidance.json";
import summaryContentJson from "./summaryContent.json";

/* ------------------------------------------------------------------ types */

export type Auditable = {
  lastReviewed: string;
  sourcePage?: string;
};

export type Code = {
  value: string;
  description: string;
  sourcePage?: string;
};

export type CodeGroup = {
  system: string;
  label: string;
  codes: Code[];
};

export type Distributor = {
  id: string;
  name: string;
  description?: string;
  phone: string;
  fax?: string;
  website?: string;
  hours?: string;
  needsVerification?: boolean;
  verificationNote?: string;
  sourcePage?: string;
};

export type StateVendor = {
  id: string;
  name: string;
  website?: string;
  process: string[];
  sourcePage?: string;
};

export type Contact = {
  id: string;
  name: string;
  description?: string;
  phone?: string;
  fax?: string;
  website?: string;
  hours?: string;
  sourcePage?: string;
};

export type Program = {
  id: string;
  name: string;
  trigger: "under-reimbursement" | "full-denial";
  summary: string;
  eligibility: string[];
  cap: string;
  excludes: string[];
  requiredDocs: string[];
  formLink: string;
  sourcePage?: string;
};

export type FormAsset = {
  id: string;
  title: string;
  description?: string;
  href: string;
  sourceAsset?: string;
  kind: string;
  needsVerification?: boolean;
  sourcePage?: string;
};

export type FormHelpBox = {
  box: string;
  label: string;
  guidance: string;
  page?: number;
  section?: string;
  rule?: "signature" | "minor";
  example?: string;
  watchOut?: string;
  sourcePage?: string;
};

export type ProcessStep = {
  title: string;
  detail: string;
};

export type EnrollmentOption = {
  id: string;
  title: string;
  detail: string;
  formId: string;
};

/* ------------------------------------------------------------ accessors */

export const codes = codesJson;
export const distributors = distributorsJson;
export const specialtyPharmacies = specialtyPharmaciesJson;
export const stateVendors = stateVendorsJson;
export const contacts = contactsJson;
export const programs = programsJson;
export const forms = formsJson;
export const isi = isiJson;
export const formHelp = formHelpJson;
export const coverageHelp = coverageHelpJson;
export const ordering = orderingJson;
export const billingGuidance = billingGuidanceJson;
export const summaryContent = summaryContentJson;

/** Flat list of every code value + description, for the quick-reference drawer. */
export const flatCodes: Array<Code & { system: string; systemLabel: string }> =
  (codes.groups as CodeGroup[]).flatMap((g) =>
    g.codes.map((c) => ({ ...c, system: g.system, systemLabel: g.label }))
  );

/** Contacts shown in the quick-reference drawer, in priority order. */
export const quickRefContactIds = ["oap", "rems"] as const;

/** Look up a single contact by id. */
export function getContact(id: string): Contact | undefined {
  return (contacts.items as Contact[]).find((c) => c.id === id);
}

/**
 * Form/resource id groups shared by the landing "Product Billing and Coding
 * Resources" accordion and the quick-reference drawer, so the two can't drift.
 * Excludes the Medical/Pharmacy Benefits panels (those are contact cards, not
 * downloadable links).
 */
export const enrollmentFormIds = [
  "enrollment-interactive",
  "enrollment-sample",
  "eprescribe",
];
export const billingResourceIds = ["rebate", "replacement", "fqhc-policies"];

/** The above, grouped with headings for the quick-reference drawer. */
export const quickRefFormGroups: Array<{ heading: string; formIds: string[] }> = [
  { heading: "Enrollment", formIds: enrollmentFormIds },
  { heading: "Billing & Reimbursement", formIds: billingResourceIds },
];

/** Look up a single form/resource by id. */
export function getForm(id: string): FormAsset | undefined {
  return (forms.items as FormAsset[]).find((f) => f.id === id);
}

/** Strip a phone/fax string down to digits for a `tel:` href. */
export function telHref(value: string): string {
  return `tel:${value.replace(/\D/g, "")}`;
}

/**
 * Anchor props for a downloadable file / form link. Every real download opens
 * in a new tab so the navigator modal stays open behind it; placeholder hrefs
 * ("#") get no target. Spread onto an <a>: `<a {...fileLinkProps(href)}>`.
 */
export function fileLinkProps(href: string): {
  href: string;
  target?: "_blank";
  rel?: "noreferrer";
} {
  if (!href || href === "#") return { href: href || "#" };
  return { href, target: "_blank", rel: "noreferrer" };
}
