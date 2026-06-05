import { Step1Coverage } from "./Step1Coverage";
import { Step2Ordering } from "./Step2Ordering";
import { Step3Documents } from "./Step3Documents";
import { Step4Billing } from "./Step4Billing";
import { Step5Summary } from "./Step5Summary";
import type { BenefitType, StepDef } from "./types";

/**
 * Step registry. Each step declares its title, stepper label, body renderer,
 * and Continue gate. State from earlier steps filters later ones — e.g. the
 * ordering step branches on `benefitType`.
 */
export const STEPS: StepDef[] = [
  {
    key: "coverage",
    summary: "Coverage check",
    title: () => "How is NEXPLANON covered for this patient?",
    render: (state, { update }) => (
      <Step1Coverage
        value={state.benefitType}
        onChange={(v: BenefitType) => update({ benefitType: v })}
      />
    ),
    canContinue: (s) => s.benefitType !== null,
  },
  {
    key: "ordering",
    summary: "Ordering pathway",
    title: (s) =>
      s.benefitType === "pharmacy"
        ? "Order through a specialty pharmacy (AOB)"
        : s.benefitType === "medical"
          ? "Order through a specialty distributor (Buy & Bill)"
          : "Choose your ordering pathway",
    render: (state) => <Step2Ordering benefitType={state.benefitType} />,
    canContinue: () => true,
  },
  {
    key: "documents",
    summary: "Document preparation",
    title: () => "Complete patient & office documents",
    render: () => <Step3Documents />,
    canContinue: () => true,
  },
  {
    key: "billing",
    summary: "Billing & coding",
    title: () => "Bill and code the claim correctly",
    render: () => <Step4Billing />,
    canContinue: () => true,
  },
  {
    key: "summary",
    summary: "Summary report",
    title: () => "Your summary report",
    render: (state, helpers) => (
      <Step5Summary benefitType={state.benefitType} helpers={helpers} />
    ),
    canContinue: () => true,
  },
];

/** Index of the billing step, for the "Jump to billing codes" escape hatch. */
export const BILLING_STEP_INDEX = STEPS.findIndex((s) => s.key === "billing");
