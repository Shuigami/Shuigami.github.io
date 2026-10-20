import { useEffect, useId, useRef } from "react";
import { createPortal } from "react-dom";
import { animateMotion } from "./motion";

export default function Modal({ title, onClose, children, className = "", onKeyDown }) {
  const dialogRef = useRef(null);
  const titleId = useId();
  const opening = useRef(null);
  const closing = useRef(false);
  const latestOnClose = useRef(onClose);
  latestOnClose.current = onClose;
  const requestClose = () => {
    if (closing.current) return;
    closing.current = true;
    const dialog = dialogRef.current;
    const current = getComputedStyle(dialog);
    const from = { opacity: current.opacity, transform: current.transform };
    opening.current?.cancel();
    dialog.classList.add("is-closing");
    const exit = animateMotion(dialog, [from, { opacity: 0, transform: "translateY(18px) scale(0.97)" }], { duration: 190, easing: "ease-in" });
    if (exit) exit.finished.then(() => latestOnClose.current(), () => latestOnClose.current());
    else latestOnClose.current();
  };
  useEffect(() => {
    const dialog = dialogRef.current;
    const trigger = document.activeElement;
    if (dialog.showModal) dialog.showModal();
    else dialog.setAttribute("open", "");
    opening.current = animateMotion(dialog, [{ opacity: 0, transform: "translateY(28px) scale(0.95)" }, { opacity: 1, transform: "translateY(0) scale(1)" }], { duration: 430, easing: "cubic-bezier(0.16,1,0.3,1)" });
    return () => {
      opening.current?.cancel();
      if (dialog.open && dialog.close) dialog.close();
      if (trigger?.isConnected) trigger.focus({ preventScroll: true });
    };
  }, []);

  return createPortal(
    <dialog ref={dialogRef} className={`portfolio-modal ${className}`} aria-labelledby={titleId}
      onCancel={(event) => { event.preventDefault(); event.stopPropagation(); requestClose(); }}
      onKeyDown={(event) => {
        if (event.key === "Tab") {
          event.stopPropagation();
          const controls = [...event.currentTarget.querySelectorAll('button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])')].filter((element) => element.getClientRects().length && !element.closest("[hidden]"));
          const first = controls[0];
          const last = controls[controls.length - 1];
          if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
          if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
        }
        onKeyDown?.(event);
      }}
      onClick={(event) => {
        if (event.target !== event.currentTarget) return;
        const rect = event.currentTarget.getBoundingClientRect();
        if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) requestClose();
      }}>
      <div className="modal-scroll">
        <header className="modal-topbar"><h2 id={titleId}>{title}</h2><button type="button" className="modal-close" onClick={requestClose} aria-label={`Close ${title}`}>Close <span aria-hidden="true">×</span></button></header>
        {children}
      </div>
    </dialog>, document.body,
  );
}
