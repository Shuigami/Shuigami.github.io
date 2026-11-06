import { useState } from "react";
import { act, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import App from "./App";
import CopyEmail from "./CopyEmail";
import Journey from "./Journey";
import useFlipReorder from "./useFlipReorder";
import { DEFAULT_ROUTE_STOP, ROUTE_STOPS } from "./journeyData";

jest.mock("./GitHubProjects", () => () => <div>GitHub project browser</div>);

const projectsRegion = () => screen.getByRole("region", { name: "Projects I've built." });
const filters = () => within(screen.getByRole("group", { name: "Trail filters" }));
const spreadTitles = () => within(projectsRegion()).getAllByRole("article").map((spread) => within(spread).getByRole("heading", { level: 3 }).textContent);
const spread = (title) => within(projectsRegion()).getByRole("article", { name: title });

test("a trail filter sorts matching projects first and dims the others", () => {
  render(<App />);
  expect(filters().getByRole("button", { name: "All trails" })).toHaveAttribute("aria-pressed", "true");
  fireEvent.click(filters().getByRole("button", { name: "Computer Graphics", exact: true }));
  expect(filters().getByRole("button", { name: "Computer Graphics", exact: true })).toHaveAttribute("aria-pressed", "true");
  expect(spreadTitles()).toEqual(["Rasterizer", "Raytracer", "FormaScale", "RaceForesight", "VideoFlow", "VITK-Project", "Sudoku OCR Solver"]);
  for (const title of ["Rasterizer", "Raytracer"]) expect(spread(title)).toHaveAttribute("data-lit", "true");
  for (const title of ["FormaScale", "VideoFlow", "Sudoku OCR Solver"]) {
    expect(spread(title)).toHaveAttribute("data-lit", "false");
    expect(spread(title)).toHaveClass("is-dimmed");
  }
  expect(screen.getByText("2 of 7 projects use Computer Graphics, listed first.")).toBeInTheDocument();

  fireEvent.click(filters().getByRole("button", { name: "Machine Learning", exact: true }));
  expect(spreadTitles()[0]).toBe("RaceForesight");
  expect(spreadTitles().slice(1)).toEqual(["FormaScale", "Rasterizer", "VideoFlow", "VITK-Project", "Raytracer", "Sudoku OCR Solver"]);

  fireEvent.click(filters().getByRole("button", { name: "All trails" }));
  expect(spreadTitles()).toEqual(["FormaScale", "Rasterizer", "RaceForesight", "VideoFlow", "VITK-Project", "Raytracer", "Sudoku OCR Solver"]);
  for (const article of within(projectsRegion()).getAllByRole("article")) expect(article).not.toHaveClass("is-dimmed");
});

test("the image side is fixed per project and does not change when filtering", () => {
  render(<App />);
  const sides = () => Object.fromEntries(within(projectsRegion()).getAllByRole("article").map((article) => [article.getAttribute("aria-labelledby"), article.classList.contains("is-reversed")]));
  const before = sides();
  expect(before).toMatchObject({ "project-formascale": false, "project-rasterizer": true, "project-raceforesight": false, "project-ocr": false });
  fireEvent.click(filters().getByRole("button", { name: "Medical Imaging" }));
  expect(sides()).toEqual(before);
});

test("opens one inline case study at a time and closes it again", () => {
  render(<App />);
  const read = screen.getByRole("button", { name: "Read case study — Raytracer" });
  fireEvent.click(read);
  const study = screen.getByRole("region", { name: "Raytracer case study" });
  expect(within(study).getByText("01 / The goal")).toBeInTheDocument();
  expect(within(study).getByText("Phong illumination, shadow rays and plastic or metal materials.")).toBeInTheDocument();
  expect(within(study).getByText("03 / The outcome")).toBeInTheDocument();
  expect(read).toHaveAccessibleName("Close case study — Raytracer");
  expect(read).toHaveAttribute("aria-expanded", "true");
  expect(read).toHaveAttribute("aria-controls", study.id);
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

  fireEvent.click(screen.getByRole("button", { name: "Read case study — VITK-Project cover" }));
  expect(screen.queryByRole("region", { name: "Raytracer case study" })).not.toBeInTheDocument();
  const vitk = screen.getByRole("region", { name: "VITK-Project case study" });
  expect(within(vitk).getByText(/example-mask measurements, without clinical validation/)).toBeInTheDocument();

  fireEvent.click(screen.getByRole("button", { name: "Close case study — VITK-Project" }));
  expect(screen.queryByRole("region", { name: /case study$/ })).not.toBeInTheDocument();
});

test("covers show real captures, a contained VITK figure or an explicit placeholder", () => {
  render(<App />);
  const cover = (name) => screen.getByRole("button", { name: `Read case study — ${name} cover` });
  for (const name of ["FormaScale", "VideoFlow"]) {
    expect(within(cover(name)).getByText("Preview pending")).toBeInTheDocument();
    expect(within(cover(name)).queryByRole("img")).not.toBeInTheDocument();
  }
  expect(within(cover("RaceForesight")).getByRole("img")).toHaveAttribute("src", "raceforesight/predicted-standings.jpg");
  expect(within(cover("VITK-Project")).getByRole("img")).toHaveAttribute("src", "vitk/3d-segmentations.jpg");
  expect(cover("VITK-Project")).toHaveClass("is-contained");
  expect(within(cover("Raytracer")).getByRole("img", { name: "Raytracer project screenshot" })).toHaveAttribute("src", "raytracer/four-reflective-spheres.png");
});

test("a lit skill chip sets the trail filter and scrolls to the projects", () => {
  const scrollTo = jest.spyOn(window, "scrollTo").mockImplementation(() => {});
  try {
    render(<App />);
    const skills = screen.getByRole("region", { name: "Built through projects and experience." });
    fireEvent.click(within(skills).getByRole("button", { name: "SDL2: show matching projects" }));
    expect(filters().getByRole("button", { name: "SDL2" })).toHaveAttribute("aria-pressed", "true");
    expect(spreadTitles().slice(0, 2)).toEqual(["Rasterizer", "Sudoku OCR Solver"]);
    expect(scrollTo).toHaveBeenCalledWith(expect.objectContaining({ behavior: "smooth" }));
  } finally {
    scrollTo.mockRestore();
  }
});

test("hovering a skill card or a matrix row activates the same area", () => {
  render(<App />);
  const skills = screen.getByRole("region", { name: "Built through projects and experience." });
  const cards = within(skills).getAllByRole("article");
  const rows = within(screen.getByRole("table", { name: "Where each skill was used" })).getAllByRole("row").slice(1);
  fireEvent.mouseEnter(cards[2]);
  expect(cards[2]).toHaveClass("is-active");
  expect(rows[2]).toHaveClass("is-active");
  fireEvent.mouseEnter(rows[4]);
  expect(cards[4]).toHaveClass("is-active");
  expect(cards[2]).not.toHaveClass("is-active");
});

test("the journey route opens on the latest study stop and merges work and education", () => {
  render(<App />);
  const route = screen.getByRole("tablist", { name: "Experience and education route" });
  expect(route).toHaveAttribute("aria-orientation", "horizontal");
  const tabs = within(route).getAllByRole("tab");
  ["2018", "2019–21", "2021–26", "2022", "2023", "2024–25", "2025–26", "Next"].forEach((marker, index) => expect(tabs[index].textContent.startsWith(marker)).toBe(true));
  expect(tabs[DEFAULT_ROUTE_STOP]).toHaveAttribute("aria-selected", "true");
  expect(screen.getByRole("tabpanel")).toHaveTextContent("UQAC");
  fireEvent.click(tabs[0]);
  expect(screen.getByRole("tabpanel")).toHaveTextContent("Paris-Orly Airport");
  expect(screen.getByRole("tabpanel")).toHaveTextContent("Work / 2018");
});

test("selects journey stops with horizontal keyboard navigation", () => {
  render(<Journey items={ROUTE_STOPS} defaultIndex={0} label="Route" prefix="test" />);
  const tabs = screen.getAllByRole("tab");
  fireEvent.keyDown(tabs[0], { key: "ArrowRight" });
  expect(tabs[1]).toHaveAttribute("aria-selected", "true");
  expect(tabs[1]).toHaveFocus();
  expect(screen.getByRole("tabpanel")).toHaveTextContent("Lycée Corot");
  fireEvent.keyDown(tabs[1], { key: "ArrowDown" });
  expect(tabs[1]).toHaveAttribute("aria-selected", "true");
  fireEvent.keyDown(tabs[1], { key: "End" });
  expect(tabs[7]).toHaveFocus();
  expect(screen.getByRole("tabpanel")).toHaveTextContent("Your team?");
  fireEvent.keyDown(tabs[7], { key: "ArrowRight" });
  expect(tabs[0]).toHaveAttribute("aria-selected", "true");
  fireEvent.keyDown(tabs[0], { key: "ArrowLeft" });
  expect(tabs[7]).toHaveAttribute("aria-selected", "true");
  fireEvent.keyDown(tabs[7], { key: "Home" });
  expect(tabs[0]).toHaveAttribute("aria-selected", "true");
  expect(tabs[0]).toHaveFocus();
});

// Three 100px rows; "reorder" moves c to the top and dims b.
function FlipHarness() {
  const [order, setOrder] = useState(["a", "b", "c"]);
  const { register, capture } = useFlipReorder(order.join());
  return <div>
    <button type="button" onClick={() => { capture(); setOrder(["c", "a", "b"]); }}>reorder</button>
    {order.map((id) => <div key={id} data-testid={id} data-lit={String(id !== "b" || order[0] !== "c")} ref={register(id)} />)}
  </div>;
}

test("the FLIP reorder measures before and after the commit and animates moved items in 3D, then dims", async () => {
  const animate = jest.fn(() => ({ cancel() {} }));
  const originalRect = Element.prototype.getBoundingClientRect;
  const originalAnimate = Element.prototype.animate;
  Element.prototype.animate = animate;
  Element.prototype.getAnimations = () => [];
  // Each item is 100px tall, positioned by its DOM index.
  /* eslint-disable testing-library/no-node-access -- layout mock derived from DOM position */
  Element.prototype.getBoundingClientRect = function rect() {
    const index = this.parentElement ? [...this.parentElement.children].indexOf(this) - 1 : 0;
    return { top: index * 100, left: 0, width: 100, height: 100, right: 100, bottom: index * 100 + 100 };
  };
  /* eslint-enable testing-library/no-node-access */
  try {
    render(<FlipHarness />);
    fireEvent.click(screen.getByRole("button", { name: "reorder" }));
    await waitFor(() => expect(animate).toHaveBeenCalled());
    const calls = animate.mock.calls.map(([keyframes, options], index) => ({ element: animate.mock.instances[index], keyframes, options }));
    const moves = calls.filter((call) => call.keyframes[0].transform);
    // c moved up by 200px, a and b moved down by 100px.
    expect(moves.map((call) => call.element.dataset.testid)).toEqual(["c", "a", "b"]);
    expect(moves[0].keyframes[0].transform).toContain("translate3d(0px, 200px, 0)");
    expect(moves[0].keyframes[1]).toMatchObject({ offset: 0.3, transform: expect.stringContaining("rotateX(-10deg) rotateY(-7deg) scale(0.92)") });
    expect(moves[1].keyframes[1].transform).toContain("rotateX(10deg) rotateY(7deg)");
    expect(moves.map((call) => call.options.delay)).toEqual([0, 60, 120]);
    expect(moves[0].options).toMatchObject({ duration: 1000, fill: "backwards", easing: "cubic-bezier(0.65,0,0.35,1)" });
    // b went from lit to dim: the fade holds the old look until 85%, after the 1000ms move.
    const fades = calls.filter((call) => call.keyframes[0].opacity);
    expect(fades).toHaveLength(1);
    expect(fades[0].element.dataset.testid).toBe("b");
    expect(fades[0].keyframes).toEqual([
      { opacity: "1", filter: "grayscale(0)" },
      { offset: 0.85, opacity: "1", filter: "grayscale(0)" },
      { opacity: "0.25", filter: "grayscale(1)" },
    ]);
    expect(fades[0].options).toMatchObject({ duration: 1450, delay: 120 });
  } finally {
    Element.prototype.getBoundingClientRect = originalRect;
    Element.prototype.animate = originalAnimate;
    delete Element.prototype.getAnimations;
  }
});

test("the FLIP reorder is skipped under prefers-reduced-motion", async () => {
  const animate = jest.fn();
  const originalAnimate = Element.prototype.animate;
  const originalMatchMedia = window.matchMedia;
  Element.prototype.animate = animate;
  window.matchMedia = (query) => ({ matches: query.includes("reduce"), addEventListener() {}, removeEventListener() {} });
  try {
    render(<FlipHarness />);
    fireEvent.click(screen.getByRole("button", { name: "reorder" }));
    await new Promise((resolve) => requestAnimationFrame(resolve));
    await new Promise((resolve) => requestAnimationFrame(resolve));
    expect(animate).not.toHaveBeenCalled();
  } finally {
    Element.prototype.animate = originalAnimate;
    window.matchMedia = originalMatchMedia;
  }
});

describe("CopyEmail", () => {
  const withClipboard = async (value, run) => {
    const descriptor = Object.getOwnPropertyDescriptor(navigator, "clipboard");
    Object.defineProperty(navigator, "clipboard", { configurable: true, value });
    try { await run(); } finally {
      if (descriptor) Object.defineProperty(navigator, "clipboard", descriptor);
      else delete navigator.clipboard;
    }
  };

  test("copies the public email address and announces success", () => withClipboard({ writeText: jest.fn().mockResolvedValue(undefined) }, async () => {
    render(<CopyEmail email="ewan.schwaller@epita.fr" />);
    fireEvent.click(screen.getByRole("button", { name: "Copy email" }));
    expect(await screen.findByRole("button", { name: "Email copied" })).toHaveTextContent("Email copied ✓");
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith("ewan.schwaller@epita.fr");
    expect(screen.getByRole("status")).toHaveTextContent("Email address copied.");
  }));

  test("returns to its idle label after 2.5 seconds", () => withClipboard({ writeText: jest.fn().mockResolvedValue(undefined) }, async () => {
    jest.useFakeTimers();
    try {
      render(<CopyEmail email="ewan.schwaller@epita.fr" />);
      fireEvent.click(screen.getByRole("button", { name: "Copy email" }));
      await screen.findByRole("button", { name: "Email copied" });
      act(() => { jest.advanceTimersByTime(2400); });
      expect(screen.getByRole("button", { name: "Email copied" })).toBeInTheDocument();
      act(() => { jest.advanceTimersByTime(200); });
      expect(await screen.findByRole("button", { name: "Copy email" })).toBeInTheDocument();
    } finally {
      jest.useRealTimers();
    }
  }));

  test("offers a manual copy fallback when clipboard access is denied", () => withClipboard({ writeText: jest.fn().mockRejectedValue(new Error("Denied")) }, async () => {
    render(<CopyEmail email="ewan.schwaller@epita.fr" />);
    fireEvent.click(screen.getByRole("button", { name: "Copy email" }));
    const input = await screen.findByRole("textbox", { name: "Email address to copy" });
    expect(input).toHaveValue("ewan.schwaller@epita.fr");
    expect(screen.getByRole("status")).toHaveTextContent("Copy unavailable");
    expect(screen.queryByRole("button", { name: "Email copied" })).not.toBeInTheDocument();
  }));
});
