import { fireEvent, render, screen, within } from "@testing-library/react";
import App from "./App";
import CopyEmail from "./CopyEmail";
import Journey from "./Journey";
import { EDUCATION_STOPS } from "./journeyData";

jest.mock("react-chartjs-2", () => ({ Radar: () => <div data-testid="radar-chart" /> }));
jest.mock("./GitHubProjects", () => () => <div>GitHub project browser</div>);

beforeAll(() => {
  window.IntersectionObserver = class { observe() {} disconnect() {} };
});

test("links a skill to relevant case studies and resets the project filter", () => {
  render(<App />);
  fireEvent.click(screen.getByRole("link", { name: "Computer Vision", exact: true }));
  expect(screen.getByRole("button", { name: "Read Sudoku OCR Solver case study" })).toBeInTheDocument();
  expect(screen.queryByRole("button", { name: "Read Raytracer case study" })).not.toBeInTheDocument();
  expect(within(screen.getByRole("group", { name: "Filter featured projects" })).getByRole("button", { name: "Computer Vision" })).toHaveAttribute("aria-pressed", "true");
  fireEvent.click(screen.getByRole("button", { name: "All projects" }));
  expect(screen.getByRole("button", { name: "Read Raytracer case study" })).toBeInTheDocument();
});

test("opens a case study with documented features and clearly pending author content", () => {
  render(<App />);
  fireEvent.click(screen.getByRole("button", { name: "Read Raytracer case study" }));
  const dialog = screen.getByRole("dialog", { name: "Raytracer — case study" });
  expect(within(dialog).getByText(/Personal contribution details coming soon/)).toBeInTheDocument();
  expect(within(dialog).getByText(/Benchmarks and measured results have not been provided/)).toBeInTheDocument();
  expect(within(dialog).getByRole("link", { name: /Explore the repository/ })).toHaveAttribute("href", "https://github.com/shuigami/raytracer");
  fireEvent.click(within(dialog).getByRole("button", { name: "Close Raytracer — case study" }));
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
});

test("navigates supplied Raytracer scenes and closes fullscreen without closing the case study", () => {
  render(<App />);
  fireEvent.click(screen.getByRole("button", { name: "Explore Raytracer" }));
  const study = screen.getByRole("dialog", { name: "Raytracer — case study" });
  expect(within(study).getByRole("img", { name: "Raytracer — Four reflective spheres" })).toHaveAttribute("src", "raytracer/four-reflective-spheres.png");
  fireEvent.click(within(study).getByRole("button", { name: "Next image" }));
  expect(within(study).getByRole("img", { name: "Raytracer — Spheres in perspective" })).toHaveAttribute("src", "raytracer/spheres-in-perspective.png");
  fireEvent.click(within(study).getByRole("button", { name: "Open Raytracer gallery fullscreen" }));
  const fullscreen = screen.getByRole("dialog", { name: "Raytracer gallery" });
  fireEvent.keyDown(fullscreen, { key: "ArrowRight" });
  expect(within(fullscreen).getByRole("img", { name: "Raytracer — Low-light reflections" })).toHaveAttribute("src", "raytracer.png");
  fireEvent.click(within(fullscreen).getByRole("button", { name: "Close Raytracer gallery" }));
  expect(screen.queryByRole("dialog", { name: "Raytracer gallery" })).not.toBeInTheDocument();
  expect(screen.getByRole("dialog", { name: "Raytracer — case study" })).toBeInTheDocument();
});

test("selects journey stops with keyboard navigation and exposes the matching panel", () => {
  render(<Journey items={EDUCATION_STOPS} label="Education journey" prefix="test" />);
  const tabs = screen.getAllByRole("tab");
  fireEvent.keyDown(tabs[0], { key: "ArrowDown" });
  expect(tabs[1]).toHaveAttribute("aria-selected", "true");
  expect(tabs[1]).toHaveFocus();
  expect(screen.getByRole("tabpanel")).toHaveTextContent("EPITA");
  fireEvent.keyDown(tabs[1], { key: "End" });
  expect(screen.getByRole("tabpanel")).toHaveTextContent("Lycée Corot");
  fireEvent.keyDown(tabs[2], { key: "ArrowDown" });
  expect(tabs[0]).toHaveAttribute("aria-selected", "true");
  expect(screen.getByRole("tabpanel")).toHaveTextContent("expected");
});

test("copies the public email address and announces success", async () => {
  const writeText = jest.fn().mockResolvedValue(undefined);
  const descriptor = Object.getOwnPropertyDescriptor(navigator, "clipboard");
  Object.defineProperty(navigator, "clipboard", { configurable: true, value: { writeText } });
  try {
    render(<CopyEmail email="ewan.schwaller@epita.fr" />);
    fireEvent.click(screen.getByRole("button", { name: "Copy email" }));
    expect(await screen.findByRole("button", { name: "Copied" })).toBeInTheDocument();
    expect(writeText).toHaveBeenCalledWith("ewan.schwaller@epita.fr");
    expect(screen.getByRole("status")).toHaveTextContent("Email address copied.");
  } finally {
    if (descriptor) Object.defineProperty(navigator, "clipboard", descriptor);
    else delete navigator.clipboard;
  }
});

test("offers a manual copy fallback when clipboard access is denied", async () => {
  const descriptor = Object.getOwnPropertyDescriptor(navigator, "clipboard");
  Object.defineProperty(navigator, "clipboard", { configurable: true, value: { writeText: jest.fn().mockRejectedValue(new Error("Denied")) } });
  try {
    render(<CopyEmail email="ewan.schwaller@epita.fr" />);
    fireEvent.click(screen.getByRole("button", { name: "Copy email" }));
    const input = await screen.findByRole("textbox", { name: "Email address to copy" });
    expect(input).toHaveValue("ewan.schwaller@epita.fr");
    expect(screen.getByRole("status")).toHaveTextContent("Copy unavailable");
    expect(screen.queryByRole("button", { name: "Copied" })).not.toBeInTheDocument();
  } finally {
    if (descriptor) Object.defineProperty(navigator, "clipboard", descriptor);
    else delete navigator.clipboard;
  }
});
