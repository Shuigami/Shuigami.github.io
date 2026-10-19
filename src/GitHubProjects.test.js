import { act, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import GitHubProjects from "./GitHubProjects";

const repositories = [
  { id: 1, name: "raytracer", html_url: "https://github.com/Shuigami/raytracer", description: "Ray tracing in C++", language: "C++", stargazers_count: 3, updated_at: "2026-08-01T00:00:00Z", topics: ["graphics"] },
  { id: 2, name: "ocr", html_url: "https://github.com/Shuigami/ocr", description: "Sudoku recognition", language: "Python", stargazers_count: 8, updated_at: "2026-09-01T00:00:00Z", topics: ["vision"] },
  { id: 3, name: "archive", html_url: "https://github.com/Shuigami/archive", description: null, language: null, stargazers_count: 0, updated_at: "2026-07-01T00:00:00Z", fork: true, archived: true },
];
const response = (data) => ({ ok: true, status: 200, json: async () => data });
const originalFetch = global.fetch;

beforeEach(() => {
  sessionStorage.clear();
  global.fetch = jest.fn().mockResolvedValue(response(repositories));
});

afterEach(() => {
  global.fetch = originalFetch;
});

async function renderLoaded() {
  render(<GitHubProjects />);
  await screen.findByRole("list", { name: "Public GitHub repositories" });
}

test("loads public repositories without credentials and shows their links and badges", async () => {
  await renderLoaded();
  expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining("api.github.com/users/Shuigami/repos"), expect.objectContaining({ signal: expect.any(AbortSignal) }));
  const list = screen.getByRole("list", { name: "Public GitHub repositories" });
  expect(within(list).getAllByRole("link")).toHaveLength(3);
  expect(within(list).getByRole("link", { name: /raytracer/ })).toHaveAttribute("href", "https://github.com/Shuigami/raytracer");
  expect(screen.getByText("Fork")).toBeInTheDocument();
  expect(screen.getByText("Archived")).toBeInTheDocument();
  expect(within(list).getAllByRole("link")[0]).toHaveTextContent("ocr");
});

test("searches descriptions and topics, combines language filtering and clears empty results", async () => {
  await renderLoaded();
  fireEvent.change(screen.getByLabelText("Search projects"), { target: { value: "GRAPHICS" } });
  expect(screen.getByRole("status")).toHaveTextContent("Showing 1 of 1 repository");
  expect(screen.getByRole("list")).toHaveTextContent("raytracer");
  fireEvent.change(screen.getByLabelText("Language"), { target: { value: "Python" } });
  expect(screen.getByText("No projects match these filters.")).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Clear filters" }));
  fireEvent.change(screen.getByLabelText("Search projects"), { target: { value: "Sudoku" } });
  expect(within(screen.getByRole("list")).getAllByRole("link")).toHaveLength(1);
  expect(screen.getByRole("list")).toHaveTextContent("ocr");
});

test("sorts by name or stars and filters repositories with no declared language", async () => {
  await renderLoaded();
  fireEvent.change(screen.getByLabelText("Sort by"), { target: { value: "name" } });
  expect(within(screen.getByRole("list")).getAllByRole("link")[0]).toHaveTextContent("archive");
  fireEvent.change(screen.getByLabelText("Sort by"), { target: { value: "stars" } });
  expect(within(screen.getByRole("list")).getAllByRole("link")[0]).toHaveTextContent("ocr");
  fireEvent.change(screen.getByLabelText("Language"), { target: { value: "Not specified" } });
  expect(within(screen.getByRole("list")).getAllByRole("link")).toHaveLength(1);
  expect(screen.getByRole("list")).toHaveTextContent("archive");
});

test("reveals more repositories and resets the visible count when filters change", async () => {
  global.fetch.mockResolvedValue(response(Array.from({ length: 8 }, (_, index) => ({ ...repositories[0], id: index, name: `project-${index}` }))));
  await renderLoaded();
  expect(within(screen.getByRole("list")).getAllByRole("link")).toHaveLength(6);
  fireEvent.click(screen.getByRole("button", { name: "Show 2 more projects" }));
  expect(within(screen.getByRole("list")).getAllByRole("link")).toHaveLength(8);
  fireEvent.change(screen.getByLabelText("Search projects"), { target: { value: "project" } });
  expect(within(screen.getByRole("list")).getAllByRole("link")).toHaveLength(6);
});

test("handles network failure with a working fallback link and retry", async () => {
  global.fetch.mockRejectedValueOnce(new TypeError("Failed to fetch"));
  render(<GitHubProjects />);
  expect(await screen.findByRole("alert")).toHaveTextContent("GitHub couldn't be reached");
  expect(screen.getByRole("link", { name: /All repositories on GitHub/ })).toHaveAttribute("href", "https://github.com/Shuigami?tab=repositories");
  fireEvent.click(screen.getByRole("button", { name: "Try again" }));
  await screen.findByRole("list");
  expect(global.fetch).toHaveBeenCalledTimes(2);
});

test("distinguishes a GitHub rate limit from an empty repository list", async () => {
  global.fetch.mockResolvedValue({ ok: false, status: 403 });
  render(<GitHubProjects />);
  expect(await screen.findByRole("alert")).toHaveTextContent("GitHub is limiting requests");
  expect(screen.queryByText("No public repositories to display yet.")).not.toBeInTheDocument();
});

test("shows an empty account and a loading state without inventing projects", async () => {
  let resolveFetch;
  global.fetch.mockImplementation(() => new Promise((resolve) => { resolveFetch = resolve; }));
  render(<GitHubProjects />);
  expect(screen.getByRole("status")).toHaveTextContent("Loading my GitHub projects");
  resolveFetch(response([]));
  expect(await screen.findByText("No public repositories to display yet.")).toBeInTheDocument();
});

test("loads a second API page when the first page contains 100 repositories", async () => {
  global.fetch.mockResolvedValueOnce(response(Array.from({ length: 100 }, (_, index) => ({ ...repositories[0], id: index, name: `repo-${index}` }))));
  global.fetch.mockResolvedValueOnce(response([{ ...repositories[1], id: 101 }]));
  await renderLoaded();
  expect(screen.getByRole("status")).toHaveTextContent("of 101 repositories");
  expect(global.fetch.mock.calls[1][0]).toContain("page=2");
});

test("reuses a recent session cache without another request", async () => {
  const view = render(<GitHubProjects />);
  await screen.findByRole("list");
  view.unmount();
  render(<GitHubProjects />);
  await screen.findByRole("list");
  expect(global.fetch).toHaveBeenCalledTimes(1);
  await waitFor(() => expect(global.fetch.mock.calls[0][1].signal.aborted).toBe(true));
});

test("stops a stalled request and provides recovery instead of loading indefinitely", () => {
  jest.useFakeTimers();
  try {
    global.fetch.mockImplementation(() => new Promise(() => {}));
    render(<GitHubProjects />);
    act(() => jest.advanceTimersByTime(20000));
    expect(screen.getByRole("alert")).toHaveTextContent("GitHub is taking too long");
    expect(global.fetch.mock.calls[0][1].signal.aborted).toBe(true);
    expect(screen.getByRole("button", { name: "Try again" })).toBeInTheDocument();
  } finally {
    jest.useRealTimers();
  }
});
