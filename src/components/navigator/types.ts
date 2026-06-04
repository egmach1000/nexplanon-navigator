import type { ReactNode } from "react";

export type BenefitType = "medical" | "pharmacy" | "unsure";

/** Cross-step state. Earlier selections filter later steps (PRD §5). */
export type NavigatorState = {
  benefitType: BenefitType | null;
};

export const INITIAL_STATE: NavigatorState = {
  benefitType: null,
};

export type StepHelpers = {
  /** Patch the shared navigator state. */
  update: (patch: Partial<NavigatorState>) => void;
  /** Clear state and return to Step 1. */
  restart: () => void;
  /** Jump to a step by index (used by escape hatches like "Jump to billing codes"). */
  goToStep: (index: number) => void;
};

export type StepDef = {
  key: string;
  /** Short label for the stepper and header. */
  summary: string;
  /** Full question/title, may depend on state. */
  title: (state: NavigatorState) => string;
  render: (state: NavigatorState, helpers: StepHelpers) => ReactNode;
  /** Gate the Continue button (e.g. Step 1 requires a benefit selection). */
  canContinue: (state: NavigatorState) => boolean;
};
