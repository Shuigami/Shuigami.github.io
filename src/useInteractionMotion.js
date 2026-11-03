import { useEffect } from "react";
import { animateMotion, finishMotion } from "./motion";

/** Click sparks and press feedback on buttons and links; nothing runs under reduced motion. */
export default function useInteractionMotion() {
  useEffect(() => {
    if (!window.matchMedia) return;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sparks = new Set();
    const presses = new Map();

    const onClick = (event) => {
      if (preference.matches || !Element.prototype.animate) return;
      const control = event.target.closest?.("button, a[href]");
      if (!control || control.disabled) return;
      const rect = control.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const spark = document.createElement("span");
      spark.className = "interaction-spark";
      spark.setAttribute("aria-hidden", "true");
      spark.style.left = `${event.detail ? event.clientX : rect.left + rect.width / 2}px`;
      spark.style.top = `${event.detail ? event.clientY : rect.top + rect.height / 2}px`;
      document.body.appendChild(spark);
      sparks.add(spark);
      const removeSpark = () => { spark.remove(); sparks.delete(spark); };
      const ripple = animateMotion(spark, [{ transform: "translate(-50%, -50%) scale(0.2)", opacity: 0.8 }, { transform: "translate(-50%, -50%) scale(3.5)", opacity: 0 }], { duration: 550, easing: "cubic-bezier(0.16,1,0.3,1)" });
      if (ripple) ripple.finished.then(removeSpark, removeSpark); else removeSpark();
      presses.get(control)?.cancel();
      const press = animateMotion(control, [{ scale: "1" }, { scale: "0.95", offset: 0.3 }, { scale: "1" }], { duration: 300, easing: "cubic-bezier(0.22,1,0.36,1)" });
      if (press) {
        presses.set(control, press);
        const complete = () => { if (presses.get(control) === press) presses.delete(control); };
        press.finished.then(complete, complete);
      }
    };
    const onPreferenceChange = () => {
      if (!preference.matches) return;
      finishMotion();
      sparks.forEach((spark) => spark.remove()); sparks.clear();
    };

    preference.addEventListener("change", onPreferenceChange);
    document.addEventListener("click", onClick);
    return () => {
      finishMotion();
      sparks.forEach((spark) => spark.remove());
      preference.removeEventListener("change", onPreferenceChange);
      document.removeEventListener("click", onClick);
    };
  }, []);
}
