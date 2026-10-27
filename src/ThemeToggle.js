import { useEffect, useState } from "react";

const STORAGE_KEY = "portfolio-theme";
const validTheme = (value) => value === "light" || value === "dark" ? value : null;

function savedTheme() {
  try { return validTheme(window.localStorage.getItem(STORAGE_KEY)); }
  catch { return null; }
}

export default function ThemeToggle() {
  const [preference, setPreference] = useState(savedTheme);
  const [systemTheme, setSystemTheme] = useState(() => window.matchMedia?.("(prefers-color-scheme: light)").matches ? "light" : "dark");
  const theme = preference || systemTheme;
  const name = theme === "light" ? "The Fremen" : "The Sandworm Encounter";

  useEffect(() => {
    const media = window.matchMedia?.("(prefers-color-scheme: light)");
    const updateSystem = () => setSystemTheme(media?.matches ? "light" : "dark");
    const updatePreference = (event) => {
      if (event.key === STORAGE_KEY || event.key === null) setPreference(savedTheme());
    };
    media?.addEventListener("change", updateSystem);
    window.addEventListener("storage", updatePreference);
    return () => {
      media?.removeEventListener("change", updateSystem);
      window.removeEventListener("storage", updatePreference);
    };
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", theme === "light" ? "#dbc2ab" : "#192325");
  }, [theme]);

  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    setPreference(next);
    try { window.localStorage.setItem(STORAGE_KEY, next); }
    catch { /* Keep the choice for this visit when storage is unavailable. */ }
  };

  return <>
    <button type="button" className="theme-toggle" role="switch" aria-label="Light theme" aria-checked={theme === "light"}
      title={`${name} · Switch to ${theme === "light" ? "dark" : "light"} theme`} onClick={toggle}>
      <span className="theme-symbol" aria-hidden="true">
        {theme === "light" ? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="4" /><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5" /></svg>
          : <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20.5 14.5A9 9 0 0 1 9.5 3.5a9 9 0 1 0 11 11Z" /></svg>}
      </span>
      <span className="theme-label-name" aria-hidden="true">{theme === "light" ? "Fremen" : "Sandworm"}</span>
      <span className="theme-label-short" aria-hidden="true">{theme === "light" ? "Light" : "Dark"}</span>
    </button>
    <span className="sr-only" role="status" aria-live="polite">{name} · {theme} theme</span>
  </>;
}
