import { useEffect, useRef, useState } from "react";

export default function CopyEmail({ email }) {
  const [status, setStatus] = useState("");
  const manualInput = useRef(null);
  useEffect(() => {
    if (status === "manual") manualInput.current?.select();
    if (status !== "copied") return;
    const timeout = setTimeout(() => setStatus(""), 3000);
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
  return <div className={`email-copy${status === "copied" ? " is-copied" : ""}`}><button type="button" className="copy-email-button" onClick={copy}>
    <svg className="arrow-icon" viewBox="0 0 20 20" fill="none" stroke="currentColor" aria-hidden="true" focusable="false">{status === "copied" ? <path className="copy-check" d="m4 10 4 4 8-9" /> : <><rect x="7" y="7" width="10" height="10" rx="1" /><path d="M13 7V3H3v10h4" /></>}</svg>{status === "copied" ? "Copied" : "Copy email"}
  </button><span className="copy-status" role="status">{status === "copied" ? "Email address copied." : status === "manual" ? "Copy unavailable. Select and copy the address below." : ""}</span>
    {status === "manual" && <input ref={manualInput} className="manual-copy-input" aria-label="Email address to copy" readOnly value={email} onFocus={(event) => event.target.select()} />}
  </div>;
}
