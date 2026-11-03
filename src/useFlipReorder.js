import { useCallback, useLayoutEffect, useRef } from "react";
import { reducedMotion } from "./motion";

const DURATION = 1000;
const FADE = 450;
const LIT = { opacity: "1", filter: "grayscale(0)" };
const DIM = { opacity: "0.25", filter: "grayscale(1)" };
const look = (element) => (element.dataset.lit === "true" ? LIT : DIM);

/**
 * 3D FLIP reorder for a keyed list.
 * - `register(id)` returns a ref callback for the element with that stable id.
 * - Call `capture()` *before* the state change that reorders the list.
 * - After the commit (`dependency` changed) every moved element glides from its
 *   old position with a 3D tilt; its lit/dim change runs once it has landed.
 * Elements expose their lit state through `data-lit="true|false"`.
 */
export default function useFlipReorder(dependency) {
  const elements = useRef(new Map());
  const snapshot = useRef(null);
  const frame = useRef(0);

  const callbacks = useRef(new Map());
  const register = useCallback((id) => {
    if (!callbacks.current.has(id)) {
      callbacks.current.set(id, (element) => {
        if (element) elements.current.set(id, element);
        else elements.current.delete(id);
      });
    }
    return callbacks.current.get(id);
  }, []);

  const capture = useCallback(() => {
    if (reducedMotion()) { snapshot.current = null; return; }
    const first = new Map();
    elements.current.forEach((element, id) => {
      first.set(id, { rect: element.getBoundingClientRect(), look: look(element) });
    });
    snapshot.current = first;
  }, []);

  useLayoutEffect(() => {
    const first = snapshot.current;
    snapshot.current = null;
    if (!first) return undefined;
    frame.current = window.requestAnimationFrame(() => {
      frame.current = 0;
      void document.body.offsetHeight; // Flush layout before measuring the final positions.
      const ordered = [...elements.current.entries()]
        .sort(([, a], [, b]) => (a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1));
      ordered.forEach(([id, element], index) => {
        if (!element.animate) return;
        element.getAnimations?.().forEach((animation) => animation.cancel());
        const before = first.get(id);
        if (!before) return;
        const last = element.getBoundingClientRect();
        const dx = before.rect.left - last.left;
        const dy = before.rect.top - last.top;
        const moved = Math.abs(dx) > 1 || Math.abs(dy) > 1;
        const delay = Math.min(index * 60, 360);
        const after = look(element);

        if (moved) {
          const tilt = dy > 0 ? -10 : 10;
          const yaw = index % 2 ? 7 : -7;
          element.animate([
            { transform: `perspective(1400px) translate3d(${dx}px, ${dy}px, 0) rotateX(0deg) rotateY(0deg) scale(1)` },
            { offset: 0.3, transform: `perspective(1400px) translate3d(${dx * 0.75}px, ${dy * 0.75}px, -140px) rotateX(${tilt}deg) rotateY(${yaw}deg) scale(0.92)` },
            { offset: 0.75, transform: `perspective(1400px) translate3d(0, 0, -40px) rotateX(${-tilt * 0.3}deg) rotateY(0deg) scale(0.98)` },
            { transform: "perspective(1400px) translate3d(0, 0, 0) rotateX(0deg) rotateY(0deg) scale(1)" },
          ], { duration: DURATION, delay, easing: "cubic-bezier(0.65,0,0.35,1)", fill: "backwards" });
        }
        if (before.look !== after) {
          element.animate(
            [before.look, { offset: 0.85, ...before.look }, after],
            { duration: moved ? DURATION + FADE : FADE, delay, easing: "ease-out", fill: "backwards" },
          );
        }
      });
    });
    return () => {
      window.cancelAnimationFrame(frame.current);
      frame.current = 0;
    };
  }, [dependency]);

  return { register, capture };
}
