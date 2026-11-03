import { useEffect, useState } from "react";
import { reducedMotion } from "./motion";

export const WAYPOINTS = [
  { id: "home", label: "Departure" },
  { id: "brief", label: "Brief" },
  { id: "camp", label: "About" },
  { id: "discoveries", label: "Projects" },
  { id: "kit", label: "Skills" },
  { id: "route", label: "Journey" },
  { id: "contact", label: "Contact" },
];

const MOTION_PROPERTIES = ["--sky-y", "--hero-shift", "--sun-top"];

/**
 * Scroll-driven expedition values, rAF-throttled.
 * Continuous values are written as CSS variables on `appRef` so scrolling
 * doesn't re-render React; discrete ones are returned as state.
 */
export default function useExpeditionScroll(appRef) {
  const [state, setState] = useState({ current: 0, scrolled: false, railVisible: false });

  useEffect(() => {
    const app = appRef.current;
    if (!app) return undefined;
    let frame = 0;

    const update = () => {
      frame = 0;
      const y = window.scrollY;
      const vh = window.innerHeight || 1;
      const range = document.documentElement.scrollHeight - vh;
      const progress = range > 0 ? Math.min(1, Math.max(0, y / range)) : 0;
      const still = reducedMotion();

      app.style.setProperty("--progress", progress.toFixed(4));
      app.style.setProperty("--stars", Math.min(0.9, progress * 1.4).toFixed(2));
      if (still) {
        MOTION_PROPERTIES.forEach((property) => app.style.removeProperty(property));
      } else {
        app.style.setProperty("--sky-y", `${(10 + progress * 70).toFixed(1)}%`);
        app.style.setProperty("--hero-shift", `${(y * 0.25).toFixed(0)}px`);
        app.style.setProperty("--sun-top", `${(16 + (Math.min(y, vh) / vh) * 40).toFixed(1)}%`);
      }

      // Current waypoint: the last section whose top is above 45% of the viewport.
      let current = 0;
      WAYPOINTS.forEach(({ id }, index) => {
        const section = document.getElementById(id);
        if (section && section.getBoundingClientRect().top < vh * 0.45) current = index;
      });
      const scrolled = y > 40;
      const railVisible = y > vh * 0.6;
      setState((previous) => (previous.current === current && previous.scrolled === scrolled && previous.railVisible === railVisible
        ? previous
        : { current, scrolled, railVisible }));
    };

    const schedule = () => { if (!frame) frame = window.requestAnimationFrame(update); };
    const preference = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    const resizeObserver = typeof ResizeObserver !== "undefined" ? new ResizeObserver(schedule) : null;
    resizeObserver?.observe(document.body);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    preference?.addEventListener?.("change", schedule);
    update();
    return () => {
      window.cancelAnimationFrame(frame);
      resizeObserver?.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      preference?.removeEventListener?.("change", schedule);
    };
  }, [appRef]);

  return state;
}
