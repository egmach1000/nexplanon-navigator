import { useId, useState } from "react";
import { ArrowLeft, ArrowRight, BookOpen, Phone, X } from "lucide-react";
import { Modal } from "../ui/Modal";
import { IsiBar } from "./IsiBar";
import { QuickRefDrawer } from "./QuickRefDrawer";
import { BILLING_STEP_INDEX, STEPS } from "./steps";
import { INITIAL_STATE, type NavigatorState } from "./types";
import { getContact, telHref } from "../../content";
import styles from "./NavigatorModal.module.css";

export function NavigatorModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [stepIdx, setStepIdx] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [state, setState] = useState<NavigatorState>(INITIAL_STATE);
  const titleId = useId();

  const update = (patch: Partial<NavigatorState>) =>
    setState((s) => ({ ...s, ...patch }));
  const restart = () => {
    setState(INITIAL_STATE);
    setStepIdx(0);
  };
  const goToStep = (i: number) =>
    setStepIdx(Math.max(0, Math.min(STEPS.length - 1, i)));

  function handleClose() {
    setStepIdx(0);
    setState(INITIAL_STATE);
    setDrawerOpen(false);
    onClose();
  }

  const step = STEPS[stepIdx];
  const isFirst = stepIdx === 0;
  const isLast = stepIdx === STEPS.length - 1;
  const canContinue = step.canContinue(state);
  const progressPct = ((stepIdx + 1) / STEPS.length) * 100;
  const oap = getContact("oap");

  return (
    <Modal open={open} onClose={handleClose} label="NEXPLANON Navigator" labelledById={titleId}>
      {/* Header: title + escape hatches + close */}
      <header className={styles.header}>
        <div className={styles.headerText}>
          <div className={styles.eyebrow}>NEXPLANON Navigator</div>
          <h1 id={titleId} className={styles.stepTitle}>
            Step {stepIdx + 1} of {STEPS.length} · {step.summary}
          </h1>
        </div>
        <div className={styles.hatches}>
          {BILLING_STEP_INDEX >= 0 && (
            <button
              type="button"
              className={styles.hatch}
              onClick={() => goToStep(BILLING_STEP_INDEX)}
            >
              Jump to billing codes
            </button>
          )}
          <button
            type="button"
            className={styles.hatch}
            onClick={() => setDrawerOpen(true)}
          >
            <BookOpen size={14} aria-hidden />
            Quick reference
          </button>
          {oap?.phone && (
            <a className={styles.hatch} href={telHref(oap.phone)}>
              <Phone size={14} aria-hidden />
              Contact us
            </a>
          )}
          <button
            type="button"
            className={styles.close}
            onClick={handleClose}
            aria-label="Close Navigator"
          >
            <X size={20} aria-hidden />
          </button>
        </div>
      </header>

      {/* Progress + clickable stepper */}
      <div className={styles.progress}>
        <div className={styles.progressRow}>
          <div
            className={styles.track}
            role="progressbar"
            aria-valuenow={stepIdx + 1}
            aria-valuemin={1}
            aria-valuemax={STEPS.length}
            aria-label={`Step ${stepIdx + 1} of ${STEPS.length}`}
          >
            <div className={styles.fill} style={{ width: `${progressPct}%` }} />
          </div>
          <div className={styles.count}>
            {stepIdx + 1} / {STEPS.length}
          </div>
        </div>
        <ol className={styles.stepper}>
          {STEPS.map((s, i) => {
            const cls =
              i === stepIdx
                ? styles.stepCurrent
                : i < stepIdx
                  ? styles.stepDone
                  : styles.stepUpcoming;
            return (
              <li key={s.key}>
                <button
                  type="button"
                  className={styles.stepButton}
                  aria-current={i === stepIdx ? "step" : undefined}
                  onClick={() => goToStep(i)}
                >
                  <span className={cls}>{i + 1}</span>
                  <span
                    className={i === stepIdx ? styles.stepLabelCurrent : styles.stepLabel}
                  >
                    {s.summary}
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      </div>

      {/* Step body (scrollable) */}
      <div className={styles.body}>
        <div className={styles.bodyInner}>
          <h2 className={styles.question}>{step.title(state)}</h2>
          <div className={styles.stepContent}>
            {step.render(state, { update, restart, goToStep })}
          </div>
        </div>
      </div>

      {/* Footer: back / continue / finish */}
      <div className={styles.footer}>
        <button
          type="button"
          className={styles.back}
          onClick={() => goToStep(stepIdx - 1)}
          disabled={isFirst}
        >
          <ArrowLeft size={16} aria-hidden />
          Back
        </button>
        {isLast ? (
          <button type="button" className={styles.primary} onClick={handleClose}>
            Finish
          </button>
        ) : (
          <button
            type="button"
            className={styles.primary}
            onClick={() => goToStep(stepIdx + 1)}
            disabled={!canContinue}
          >
            Continue
            <ArrowRight size={16} aria-hidden />
          </button>
        )}
      </div>

      {/* Persistent ISI */}
      <IsiBar />

      <QuickRefDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </Modal>
  );
}
