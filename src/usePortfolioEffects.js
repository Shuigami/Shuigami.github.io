import { useEffect, useRef } from "react";

const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
const REVEAL_SELECTOR = ".section-heading, .about-content, .skill-category, .project-card, .journey, .contact-content";

export default function usePortfolioEffects() {
  const appRef = useRef(null);

  useEffect(() => {
    const app = appRef.current;
    const hero = app?.querySelector(".hero");
    // Leave all content visible when progressive enhancement is unavailable.
    if (!app || !hero || !window.matchMedia || !window.IntersectionObserver) return;

    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let observer;
    let frame = 0;
    let pointerX = 0;
    let pointerY = 0;
    let targetX = 0;
    let targetY = 0;
    let lastPointerFrame = 0;
    let pointerFocus = false;
    const targets = [...app.querySelectorAll(REVEAL_SELECTOR)];

    const reveal = (element) => {
      element.classList.remove("reveal-pending");
      element.dataset.revealed = "true";
      observer?.unobserve(element);
    };

    const revealHashTarget = () => {
      let id;
      try { id = decodeURIComponent(window.location.hash.slice(1)); } catch { return; }
      const target = id && document.getElementById(id);
      if (!target || !app.contains(target)) return;
      const section = target.closest("section") || target;
      section.querySelectorAll(".reveal-pending").forEach(reveal);
    };

    const update = (timestamp) => {
      frame = 0;
      if (preference.matches) return;
      // Ease only the mouse offset: scroll depth stays directly tied to scrolling.
      const elapsed = lastPointerFrame ? clamp(timestamp - lastPointerFrame, 0, 50) : 1000 / 60;
      const easing = 1 - Math.exp(-elapsed / 110);
      lastPointerFrame = timestamp;
      pointerX += (targetX - pointerX) * easing;
      pointerY += (targetY - pointerY) * easing;
      if (Math.abs(targetX - pointerX) < 0.001) pointerX = targetX;
      if (Math.abs(targetY - pointerY) < 0.001) pointerY = targetY;
      const rect = hero.getBoundingClientRect();
      app.dataset.heroVisible = String(rect.bottom > 0 && rect.top < window.innerHeight);
      const distance = clamp(-rect.top, 0, rect.height);
      const mobile = window.innerWidth <= 760;
      if (mobile) pointerX = pointerY = targetX = targetY = 0;
      const depth = mobile ? 0.55 : 1;
      const lookX = mobile ? 0 : pointerX;
      const lookY = mobile ? 0 : pointerY;
      app.style.setProperty("--landscape-y", `${(distance * 0.16 * depth + lookY * 5).toFixed(2)}px`);
      app.style.setProperty("--landscape-x", `${(lookX * 9).toFixed(2)}px`);
      app.style.setProperty("--dune-y", `${(distance * 0.045 * depth - lookY * 3).toFixed(2)}px`);
      app.style.setProperty("--dune-x", `${(-lookX * 14).toFixed(2)}px`);
      app.style.setProperty("--copy-y", `${(-distance * 0.035 * depth).toFixed(2)}px`);
      const range = document.documentElement.scrollHeight - window.innerHeight;
      const progress = clamp((window.scrollY - rect.height * 0.3) / Math.max(1, range - rect.height * 0.3));
      const dusk = progress * progress * (3 - 2 * progress);
      app.style.setProperty("--twilight", dusk.toFixed(3));
      app.style.setProperty("--night-percent", `${(dusk * 100).toFixed(1)}%`);
      if (pointerX !== targetX || pointerY !== targetY) frame = window.requestAnimationFrame(update);
      else lastPointerFrame = 0;
    };

    const requestUpdate = () => {
      if (!preference.matches && !frame) frame = window.requestAnimationFrame(update);
    };

    const configure = () => {
      observer?.disconnect();
      window.cancelAnimationFrame(frame);
      frame = 0;
      pointerX = 0;
      pointerY = 0;
      targetX = 0;
      targetY = 0;
      lastPointerFrame = 0;
      targets.forEach((target) => target.classList.remove("reveal-pending"));
      app.dataset.motion = preference.matches ? "off" : "on";
      if (preference.matches) {
        ["--landscape-y", "--landscape-x", "--dune-y", "--dune-x", "--copy-y", "--twilight", "--night-percent"].forEach((property) => app.style.removeProperty(property));
        return;
      }
      observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) reveal(entry.target);
        });
      }, { threshold: 0, rootMargin: "0px 0px -30px 0px" });
      targets.forEach((target) => {
        target.classList.add("reveal-target");
        if (target.dataset.revealed === "true" || target.getBoundingClientRect().top < window.innerHeight - 30) {
          reveal(target);
        } else {
          target.classList.add("reveal-pending");
          observer.observe(target);
        }
      });
      revealHashTarget();
      requestUpdate();
    };

    const onPointerMove = (event) => {
      if (preference.matches || event.pointerType !== "mouse" || window.innerWidth <= 760) return;
      const rect = hero.getBoundingClientRect();
      targetX = clamp((event.clientX - rect.left) / rect.width * 2 - 1, -1, 1);
      targetY = clamp((event.clientY - rect.top) / rect.height * 2 - 1, -1, 1);
      requestUpdate();
    };
    const resetPointer = () => { targetX = 0; targetY = 0; requestUpdate(); };
    const onPointerDown = () => { pointerFocus = true; };
    const onKeyDown = () => { pointerFocus = false; };
    const onFocus = (event) => {
      const target = event.target.closest?.(".reveal-target");
      if (target && !pointerFocus) {
        target.classList.add("reveal-instant");
        reveal(target);
      }
    };
    const onHashChange = () => { revealHashTarget(); requestUpdate(); };
    const resizeObserver = typeof ResizeObserver !== "undefined" ? new ResizeObserver(requestUpdate) : null;

    configure();
    resizeObserver?.observe(app);
    preference.addEventListener("change", configure);
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate, { passive: true });
    window.addEventListener("hashchange", onHashChange);
    window.addEventListener("pageshow", requestUpdate);
    hero.addEventListener("pointermove", onPointerMove, { passive: true });
    hero.addEventListener("pointerleave", resetPointer);
    hero.addEventListener("pointercancel", resetPointer);
    window.addEventListener("blur", resetPointer);
    app.addEventListener("focusin", onFocus);
    document.addEventListener("pointerdown", onPointerDown, { capture: true, passive: true });
    document.addEventListener("keydown", onKeyDown, true);

    return () => {
      observer?.disconnect();
      resizeObserver?.disconnect();
      window.cancelAnimationFrame(frame);
      preference.removeEventListener("change", configure);
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      window.removeEventListener("hashchange", onHashChange);
      window.removeEventListener("pageshow", requestUpdate);
      hero.removeEventListener("pointermove", onPointerMove);
      hero.removeEventListener("pointerleave", resetPointer);
      hero.removeEventListener("pointercancel", resetPointer);
      window.removeEventListener("blur", resetPointer);
      app.removeEventListener("focusin", onFocus);
      document.removeEventListener("pointerdown", onPointerDown, true);
      document.removeEventListener("keydown", onKeyDown, true);
      targets.forEach((target) => target.classList.remove("reveal-pending", "reveal-target", "reveal-instant"));
    };
  }, []);

  return appRef;
}
