import { useEffect, useId, useRef } from "react";
import { createPortal } from "react-dom";

export default function Modal({ title, onClose, children, className = "", onKeyDown }) {
  const dialogRef = useRef(null);
  const titleId = useId();
  useEffect(() => {
    const dialog = dialogRef.current;
    const trigger = document.activeElement;
    if (dialog.showModal) dialog.showModal();
    else dialog.setAttribute("open", "");
    return () => {
      if (dialog.open && dialog.close) dialog.close();
      if (trigger?.isConnected) trigger.focus({ preventScroll: true });
    };
  }, []);

  return createPortal(
    <dialog ref={dialogRef} className={`portfolio-modal ${className}`} aria-labelledby={titleId}
      onCancel={(event) => { event.preventDefault(); event.stopPropagation(); onClose(); }}
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
        if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) onClose();
      }}>
      <div className="modal-scroll">
        <header className="modal-topbar"><h2 id={titleId}>{title}</h2><button type="button" className="modal-close" onClick={onClose} aria-label={`Close ${title}`}>Close <span aria-hidden="true">×</span></button></header>
        {children}
      </div>
    </dialog>, document.body,
  );
}
