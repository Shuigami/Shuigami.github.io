import { useEffect, useMemo, useState } from "react";

const PROFILE_URL = "https://github.com/Shuigami?tab=repositories";
const API_URL = "https://api.github.com/users/Shuigami/repos";
const CACHE_KEY = "shuigami-public-repositories-v1";
const CACHE_DURATION = 30 * 60 * 1000;
const PAGE_SIZE = 6;

function readCache() {
  try {
    const cached = JSON.parse(sessionStorage.getItem(CACHE_KEY));
    if (cached && Array.isArray(cached.repositories) && Date.now() - cached.savedAt < CACHE_DURATION) {
      return cached.repositories;
    }
  } catch {
    // Storage may be disabled; the public API remains usable without it.
  }
  return null;
}

export default function GitHubProjects() {
  const [repositories, setRepositories] = useState([]);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);
  const [search, setSearch] = useState("");
  const [language, setLanguage] = useState("");
  const [sort, setSort] = useState("updated");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  useEffect(() => {
    const controller = new AbortController();
    let timeout;
    const cached = readCache();
    if (cached !== null) {
      setRepositories(cached);
      setStatus("ready");
      return () => controller.abort();
    }

    async function loadRepositories() {
      setStatus("loading");
      setError("");
      timeout = setTimeout(() => {
        setError("GitHub is taking too long to respond. Please try again or view my repositories directly.");
        setStatus("error");
        controller.abort();
      }, 20000);
      try {
        const allRepositories = [];
        let page = 1;
        let batch;
        do {
          const response = await fetch(`${API_URL}?per_page=100&type=owner&sort=updated&page=${page}`, {
            signal: controller.signal,
            headers: { Accept: "application/vnd.github+json" },
          });
          if (!response.ok) {
            throw new Error(response.status === 403 || response.status === 429
              ? "GitHub is limiting requests right now. Please try again later."
              : "My GitHub repositories couldn't be loaded. Please try again.");
          }
          batch = await response.json();
          if (!Array.isArray(batch)) throw new Error("GitHub returned an unexpected response. Please try again.");
          allRepositories.push(...batch.filter((repository) => !repository.private));
          page += 1;
        } while (batch.length === 100);

        if (controller.signal.aborted) return;
        setRepositories(allRepositories);
        setStatus("ready");
        try {
          sessionStorage.setItem(CACHE_KEY, JSON.stringify({ savedAt: Date.now(), repositories: allRepositories }));
        } catch {
          // Caching is optional and must not prevent the list from rendering.
        }
      } catch (loadError) {
        if (controller.signal.aborted) return;
        setError(loadError instanceof TypeError
          ? "GitHub couldn't be reached. Check your connection or view my repositories directly."
          : loadError.message);
        setStatus("error");
      } finally {
        clearTimeout(timeout);
      }
    }

    loadRepositories();
    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, [attempt]);

  const languages = useMemo(() => [...new Set(repositories.map((repository) => repository.language || "Not specified"))].sort(), [repositories]);
  const filteredRepositories = useMemo(() => {
    const query = search.trim().toLowerCase();
    return repositories.filter((repository) => {
      const text = [repository.name, repository.description, ...(repository.topics || [])].join(" ").toLowerCase();
      return (!query || text.includes(query)) && (!language || (repository.language || "Not specified") === language);
    }).sort((a, b) => {
      if (sort === "name") return a.name.localeCompare(b.name);
      if (sort === "stars") return b.stargazers_count - a.stargazers_count || a.name.localeCompare(b.name);
      return new Date(b.updated_at) - new Date(a.updated_at) || a.name.localeCompare(b.name);
    });
  }, [repositories, search, language, sort]);

  const resetFilters = () => {
    setSearch("");
    setLanguage("");
    setVisibleCount(PAGE_SIZE);
  };

  return (
    <section className="github-projects" aria-labelledby="github-projects-title">
      <div className="github-projects-header">
        <div>
          <p className="section-eyebrow">More to explore</p>
          <h3 id="github-projects-title">My public GitHub projects</h3>
          <p>Browse my public repositories, including forks and archived work. This list updates from GitHub.</p>
        </div>
        <a className="project-link" href={PROFILE_URL} target="_blank" rel="noopener noreferrer">All repositories on GitHub <span className="sr-only">(opens in a new tab)</span></a>
      </div>

      {status === "loading" && <p className="github-feedback" role="status">Loading my GitHub projects…</p>}
      {status === "error" && <div className="github-feedback">
        <p role="alert">{error}</p>
        <button className="github-button" type="button" onClick={() => setAttempt((previous) => previous + 1)}>Try again</button>
      </div>}
      {status === "ready" && <>
        <div className="github-controls">
          <div className="github-control">
            <label htmlFor="repository-search">Search projects</label>
            <input id="repository-search" type="search" placeholder="Name, description or topic…" value={search} onChange={(event) => { setSearch(event.target.value); setVisibleCount(PAGE_SIZE); }} />
          </div>
          <div className="github-control">
            <label htmlFor="repository-language">Language</label>
            <select id="repository-language" value={language} onChange={(event) => { setLanguage(event.target.value); setVisibleCount(PAGE_SIZE); }}>
              <option value="">All languages</option>
              {languages.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </div>
          <div className="github-control">
            <label htmlFor="repository-sort">Sort by</label>
            <select id="repository-sort" value={sort} onChange={(event) => { setSort(event.target.value); setVisibleCount(PAGE_SIZE); }}>
              <option value="updated">Recently updated</option>
              <option value="name">Name A–Z</option>
              <option value="stars">Most stars</option>
            </select>
          </div>
        </div>
        <p className="github-result-count" role="status">Showing {Math.min(visibleCount, filteredRepositories.length)} of {filteredRepositories.length} {filteredRepositories.length === 1 ? "repository" : "repositories"}{search.trim() || language ? " matching your filters" : ""}.</p>
        {filteredRepositories.length > 0 ? <ul className="github-repo-list" aria-label="Public GitHub repositories">
          {filteredRepositories.slice(0, visibleCount).map((repository) => <li key={repository.id}>
            <a href={repository.html_url} target="_blank" rel="noopener noreferrer" className="github-repo-link">
              <span className="github-repo-info">
                <span className="github-repo-name">{repository.name}</span>
                <span className="github-repo-description">{repository.description || "Explore the code and README on GitHub."}</span>
              </span>
              <span className="github-repo-meta">
                <span>{repository.language || "Not specified"}</span>
                {repository.fork && <span className="tech-tag">Fork</span>}
                {repository.archived && <span className="tech-tag">Archived</span>}
                <span>{repository.stargazers_count || 0} {repository.stargazers_count === 1 ? "star" : "stars"}</span>
              </span>
              <svg className="arrow-icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1" aria-hidden="true" focusable="false"><path d="M3 13 13 3M3 3h10v10" /></svg>
              <span className="sr-only">Open on GitHub (opens in a new tab)</span>
            </a>
          </li>)}
        </ul> : <div className="github-feedback">
          <p>{repositories.length ? "No projects match these filters." : "No public repositories to display yet."}</p>
          {(search.trim() || language) && <button className="github-button" type="button" onClick={resetFilters}>Clear filters</button>}
        </div>}
        {visibleCount < filteredRepositories.length && <button className="github-button github-show-more" type="button" onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}>Show {Math.min(PAGE_SIZE, filteredRepositories.length - visibleCount)} more projects</button>}
      </>}
    </section>
  );
}
