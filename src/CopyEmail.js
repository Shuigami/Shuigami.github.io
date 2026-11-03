import { useEffect, useRef, useState } from "react";

export default function CopyEmail({ email, className = "", icon = false }) {
  const [status, setStatus] = useState("");
  const manualInput = useRef(null);
  useEffect(() => {
    if (status === "manual") manualInput.current?.select();
    if (status !== "copied") return;
    const timeout = setTimeout(() => setStatus(""), 2500);
    return () => clearTimeout(timeout);
  }, [status]);
  const copy = async () => {
    try {
      if (!navigator.clipboard?.writeText) throw new Error("Clipboard unavailable");
      await navigator.clipboard.writeText(email);
      setStatus("copied");
    } catch {
      setStatus("manual");
    }
  };
  const copied = status === "copied";
  return <div className={`email-copy${copied ? " is-copied" : ""}`}>
    <button type="button" className={`copy-email-button ${className}`.trim()} onClick={copy}>
      <span>{copied ? "Email copied" : "Copy email"}{copied && <span aria-hidden="true"> ✓</span>}</span>
      {icon && <span className="copy-icon" aria-hidden="true">⧉</span>}
    </button>
    <span className={`copy-status${copied ? " sr-only" : ""}`} role="status">{copied ? "Email address copied." : status === "manual" ? "Copy unavailable. Select and copy the address below." : ""}</span>
    {status === "manual" && <input ref={manualInput} className="manual-copy-input" aria-label="Email address to copy" readOnly value={email} onFocus={(event) => event.target.select()} />}
  </div>;
}
