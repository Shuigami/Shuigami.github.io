import { useEffect } from "react";
import { animateMotion, finishMotion } from "./motion";

export default function useInteractionMotion() {
  useEffect(() => {
    if (!window.matchMedia) return;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const cards = new Set();
    const visibleCards = new Set();
    const sparks = new Set();
    const presses = new Map();
    let frame = 0;
    let hoveredCard = null;
    let pointer = null;

    const resetTilt = () => {
      if (!hoveredCard) return;
      hoveredCard.style.removeProperty("--tilt-x");
      hoveredCard.style.removeProperty("--tilt-y");
      hoveredCard.removeAttribute("data-tilting");
      hoveredCard = null;
      pointer = null;
    };
    const update = () => {
      frame = 0;
      if (preference.matches) return;
      visibleCards.forEach((card) => {
        const rect = card.getBoundingClientRect();
        const progress = Math.max(-1, Math.min(1, (rect.top + rect.height / 2 - window.innerHeight / 2) / window.innerHeight));
        card.style.setProperty("--image-shift", `${(progress * 10).toFixed(2)}px`);
      });
      if (hoveredCard && pointer && hoveredCard.isConnected) {
        const rect = hoveredCard.getBoundingClientRect();
        const x = Math.max(-1, Math.min(1, (pointer.x - rect.left) / rect.width * 2 - 1));
        const y = Math.max(-1, Math.min(1, (pointer.y - rect.top) / rect.height * 2 - 1));
        hoveredCard.style.setProperty("--tilt-x", `${(-y * 2.5).toFixed(2)}deg`);
        hoveredCard.style.setProperty("--tilt-y", `${(x * 2.5).toFixed(2)}deg`);
      }
    };
    const schedule = () => { if (!preference.matches && !frame) frame = requestAnimationFrame(update); };
    const observer = typeof IntersectionObserver !== "undefined" ? new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) visibleCards.add(entry.target);
        else visibleCards.delete(entry.target);
      });
      schedule();
    }, { rootMargin: "100px" }) : null;
    const syncCards = () => {
      const current = new Set(document.querySelectorAll(".project-card"));
      cards.forEach((card) => { if (!current.has(card)) { observer?.unobserve(card); visibleCards.delete(card); cards.delete(card); } });
      current.forEach((card) => { if (!cards.has(card)) { cards.add(card); observer?.observe(card); } });
      schedule();
    };
    const mutations = new MutationObserver((records) => {
      if (records.some((record) => [...record.addedNodes, ...record.removedNodes].some((node) => node.nodeType === 1 && (node.matches(".project-card") || node.querySelector(".project-card"))))) syncCards();
    });
    const onPointerMove = (event) => {
      if (preference.matches || event.pointerType !== "mouse" || window.innerWidth <= 760) return;
      const card = event.target.closest?.(".project-card, .skill-category");
      if (card !== hoveredCard) resetTilt();
      if (!card) return;
      hoveredCard = card;
      pointer = { x: event.clientX, y: event.clientY };
      card.setAttribute("data-tilting", "true");
      schedule();
    };
    const onPointerOut = (event) => { if (hoveredCard && !hoveredCard.contains(event.relatedTarget)) resetTilt(); };
    const onResize = () => { if (window.innerWidth <= 760) resetTilt(); schedule(); };
    const onClick = (event) => {
      if (preference.matches || !Element.prototype.animate) return;
      const control = event.target.closest?.("button, a[href]");
      if (!control || control.disabled) return;
      const rect = control.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const spark = document.createElement("span");
      spark.className = "interaction-spark";
      spark.setAttribute("aria-hidden", "true");
      const x = event.detail ? event.clientX : rect.left + rect.width / 2;
      const y = event.detail ? event.clientY : rect.top + rect.height / 2;
      spark.style.left = `${x}px`;
      spark.style.top = `${y}px`;
      // A native dialog is in the top layer, so its feedback must live inside it.
      const dialog = control.closest("dialog[open]");
      if (dialog) {
        const bounds = dialog.getBoundingClientRect();
        spark.style.position = "absolute";
        spark.style.left = `${(x - bounds.left) * dialog.clientWidth / bounds.width}px`;
        spark.style.top = `${(y - bounds.top) * dialog.clientHeight / bounds.height}px`;
      }
      (dialog || document.body).appendChild(spark);
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
    const onInvalid = (event) => {
      animateMotion(event.target, [{ translate: "0 0" }, { translate: "-5px 0" }, { translate: "4px 0" }, { translate: "-2px 0" }, { translate: "0 0" }], { duration: 320, easing: "ease-out" });
    };
    const onPreferenceChange = () => {
      if (preference.matches) {
        finishMotion();
        cancelAnimationFrame(frame); frame = 0;
        resetTilt();
        sparks.forEach((spark) => spark.remove()); sparks.clear();
        cards.forEach((card) => card.style.removeProperty("--image-shift"));
      } else schedule();
    };

    syncCards();
    mutations.observe(document.body, { childList: true, subtree: true });
    preference.addEventListener("change", onPreferenceChange);
    document.addEventListener("click", onClick);
    document.addEventListener("invalid", onInvalid, true);
    document.addEventListener("pointermove", onPointerMove, { passive: true });
    document.addEventListener("pointerout", onPointerOut, { passive: true });
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });
    return () => {
      finishMotion(); resetTilt(); cancelAnimationFrame(frame);
      observer?.disconnect(); mutations.disconnect();
      sparks.forEach((spark) => spark.remove());
      cards.forEach((card) => card.style.removeProperty("--image-shift"));
      preference.removeEventListener("change", onPreferenceChange);
      document.removeEventListener("click", onClick);
      document.removeEventListener("invalid", onInvalid, true);
      document.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("pointerout", onPointerOut);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", onResize);
    };
  }, []);
}
