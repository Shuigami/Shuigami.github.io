const activeAnimations = new Set();

export function reducedMotion() {
  return typeof window === "undefined" || Boolean(window.matchMedia?.("(prefers-reduced-motion: reduce)").matches);
}

export function animateMotion(element, keyframes, options) {
  if (!element?.animate || reducedMotion()) return null;
  const animation = element.animate(keyframes, options);
  activeAnimations.add(animation);
  animation.finished.then(() => activeAnimations.delete(animation), () => activeAnimations.delete(animation));
  return animation;
}

export function finishMotion() {
  activeAnimations.forEach((animation) => {
    try { animation.finish(); } catch { animation.cancel(); }
  });
  activeAnimations.clear();
}
