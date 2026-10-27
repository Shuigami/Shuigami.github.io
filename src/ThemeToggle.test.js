import { act, fireEvent, render, screen } from "@testing-library/react";
import ThemeToggle from "./ThemeToggle";

let originalMatchMedia;
let media;
let changeSystem;

beforeEach(() => {
  localStorage.clear();
  delete document.documentElement.dataset.theme;
  originalMatchMedia = window.matchMedia;
  media = { matches: false, addEventListener: jest.fn((event, listener) => { changeSystem = listener; }), removeEventListener: jest.fn() };
  window.matchMedia = jest.fn(() => media);
});

afterEach(() => {
  window.matchMedia = originalMatchMedia;
  localStorage.clear();
  delete document.documentElement.dataset.theme;
  jest.restoreAllMocks();
});

test("follows the system until the visitor chooses a palette, then persists the choice", () => {
  render(<ThemeToggle />);
  const toggle = screen.getByRole("switch", { name: "Light theme" });
  expect(toggle).toHaveAttribute("aria-checked", "false");
  act(() => { media.matches = true; changeSystem(); });
  expect(toggle).toHaveAttribute("aria-checked", "true");
  fireEvent.click(toggle);
  expect(toggle).toHaveAttribute("aria-checked", "false");
  expect(localStorage.getItem("portfolio-theme")).toBe("dark");
  act(() => { media.matches = false; changeSystem(); });
  act(() => { media.matches = true; changeSystem(); });
  expect(document.documentElement).toHaveAttribute("data-theme", "dark");
});

test("restores a saved choice even when the system prefers the other palette", () => {
  localStorage.setItem("portfolio-theme", "light");
  render(<ThemeToggle />);
  expect(screen.getByRole("switch", { name: "Light theme" })).toHaveAttribute("aria-checked", "true");
  expect(screen.getByRole("status")).toHaveTextContent("The Fremen");
});

test("adopts a preference changed in another tab", () => {
  render(<ThemeToggle />);
  localStorage.setItem("portfolio-theme", "light");
  fireEvent(window, new StorageEvent("storage", { key: "portfolio-theme", newValue: "light" }));
  expect(screen.getByRole("switch", { name: "Light theme" })).toHaveAttribute("aria-checked", "true");
  expect(document.documentElement).toHaveAttribute("data-theme", "light");
});

test("ignores an invalid saved value and falls back to the system", () => {
  localStorage.setItem("portfolio-theme", "unknown");
  media.matches = true;
  const { unmount } = render(<ThemeToggle />);
  expect(screen.getByRole("switch", { name: "Light theme" })).toHaveAttribute("aria-checked", "true");
  unmount();
  expect(media.removeEventListener).toHaveBeenCalledWith("change", changeSystem);
});

test("still switches themes when storage is blocked", () => {
  jest.spyOn(Storage.prototype, "getItem").mockImplementation(() => { throw new Error("Storage disabled"); });
  jest.spyOn(Storage.prototype, "setItem").mockImplementation(() => { throw new Error("Storage disabled"); });
  render(<ThemeToggle />);
  fireEvent.click(screen.getByRole("switch", { name: "Light theme" }));
  expect(document.documentElement).toHaveAttribute("data-theme", "light");
  fireEvent.click(screen.getByRole("switch", { name: "Light theme" }));
  expect(document.documentElement).toHaveAttribute("data-theme", "dark");
});
