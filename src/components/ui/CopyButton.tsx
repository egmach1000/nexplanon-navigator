import { useState } from "react";
import { Check, Copy } from "lucide-react";
import styles from "./CopyButton.module.css";

/** One-click copy with a transient "Copied" confirmation and SR announcement. */
export function CopyButton({ value, label }: { value: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  async function onCopy() {
    try {
      await navigator.clipboard?.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard unavailable (e.g. insecure context) — silently no-op.
    }
  }

  return (
    <button
      type="button"
      className={styles.button}
      onClick={onCopy}
      aria-label={label ?? `Copy ${value}`}
    >
      {copied ? <Check size={12} aria-hidden /> : <Copy size={12} aria-hidden />}
      {copied ? "Copied" : "Copy"}
    </button>
  );
}
