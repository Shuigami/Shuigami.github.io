import { useState } from "react";
import { PROJECTS, PROJECT_SKILLS } from "./projectData";
import { ArrowIcon } from "./Icons";
import GitHubProjects from "./GitHubProjects";
import Waypoint from "./Waypoint";

const number = (project) => String(PROJECTS.indexOf(project) + 1).padStart(2, "0");
const matches = (project, skill) => !skill || project.skills.includes(skill);

/** Matching projects first, original order kept within each group. */
export function orderProjects(skill) {
  return [...PROJECTS.filter((project) => matches(project, skill)), ...PROJECTS.filter((project) => !matches(project, skill))];
}

function CoverPlaceholder({ title }) {
  return <span className="cover-placeholder">
    <span className="pending-badge">Preview pending</span>
    <span className="cover-placeholder-caption" aria-hidden="true">[ {title} — project capture ]</span>
  </span>;
}

function CaseStudy({ project, id }) {
  return <div className="case-study" id={id} role="region" aria-label={`${project.title} case study`}>
    <div>
      <p className="case-label">01 / The goal</p>
      <p>{project.objective}</p>
      <p className="case-context">{project.context}</p>
    </div>
    <div>
      <p className="case-label">02 / The approach</p>
      <ul>{project.approach.map((item) => <li key={item}>{item}</li>)}</ul>
    </div>
    <div>
      <p className="case-label">03 / The outcome</p>
      <p>{project.outcome}</p>
      {project.resultNote && <p className="pending-note">{project.resultNote}</p>}
    </div>
  </div>;
}

function ProjectSpread({ project, lit, open, onToggle, spreadRef }) {
  const caseId = `case-${project.id}`;
  const reversed = PROJECTS.indexOf(project) % 2 === 1; // Fixed per project, never changes when filtering.
  const cta = open ? "Close case study" : "Read case study";
  return <article ref={spreadRef} data-lit={lit} aria-labelledby={`project-${project.id}`}
    className={`spread${reversed ? " is-reversed" : ""}${lit ? "" : " is-dimmed"}${open ? " is-open" : ""}`}>
    <button type="button" className={`spread-cover${project.coverFit === "contain" ? " is-contained" : ""}`}
      aria-expanded={open} aria-controls={open ? caseId : undefined} aria-label={`${cta} — ${project.title} cover`} onClick={onToggle}>
      {project.image ? <img src={project.image} alt={`${project.title} project screenshot`} loading="lazy" /> : <CoverPlaceholder title={project.title} />}
      <span className="spread-cover-label" aria-hidden="true">{cta} <ArrowIcon /></span>
    </button>
    <div className="spread-text">
      <span className="spread-number" aria-hidden="true">{number(project)}</span>
      <p className="eyebrow">{project.category}</p>
      <h3 id={`project-${project.id}`}>{project.title}</h3>
      <p className="spread-summary">{project.summary}</p>
      <p className="spread-objective">{project.objective}</p>
      <div className="tag-list">{project.technologies.map((technology) => <span className="tech-tag" key={technology}>{technology}</span>)}</div>
      <div className="spread-actions">
        <button type="button" className="text-button" aria-expanded={open} aria-controls={open ? caseId : undefined} onClick={onToggle}>
          {cta}<span className="sr-only"> — {project.title}</span> <span aria-hidden="true">{open ? "↑" : "↓"}</span>
        </button>
        {project.demo && <a className="pill-link" href={project.demo} target="_blank" rel="noopener noreferrer">
          <span className="pill-dot" aria-hidden="true" />Project page <span aria-hidden="true">↗</span><span className="sr-only"> for {project.title} (opens in a new tab)</span>
        </a>}
        <a className="quiet-link" href={project.github} target="_blank" rel="noopener noreferrer" aria-label={`View ${project.title} on GitHub (opens in a new tab)`}>GitHub <span aria-hidden="true">↗</span></a>
      </div>
    </div>
    {open && <CaseStudy project={project} id={caseId} />}
  </article>;
}

export default function Projects({ selectedSkill, onSelectSkill, registerSpread }) {
  const [openCaseId, setOpenCaseId] = useState(null);
  const ordered = orderProjects(selectedSkill);
  const litCount = PROJECTS.filter((project) => matches(project, selectedSkill)).length;
  return <section id="discoveries" className="section projects-section" aria-labelledby="projects-title">
    <div className="container">
      <div className="projects-header">
        <div>
          <Waypoint number="Waypoint 02" label="Discoveries" />
          <h2 id="projects-title" className="section-title">Projects I've built.</h2>
        </div>
        <p className="section-intro">Selected work in computer vision, 3D reconstruction, machine learning, cloud applications and rendering. Pick a trail to light up matching work.</p>
      </div>
      <div className="trail-filters" role="group" aria-label="Trail filters">
        {[null, ...PROJECT_SKILLS].map((skill) => <button type="button" key={skill || "all"} aria-pressed={selectedSkill === skill} onClick={() => onSelectSkill(skill)}>{skill || "All trails"}</button>)}
      </div>
      <p className="sr-only" role="status">{selectedSkill ? `${litCount} of ${PROJECTS.length} projects use ${selectedSkill}, listed first.` : ""}</p>
      <div className="spreads">
        {ordered.map((project) => <ProjectSpread key={project.id} project={project} lit={matches(project, selectedSkill)}
          open={openCaseId === project.id} spreadRef={registerSpread(project.id)}
          onToggle={() => setOpenCaseId((current) => (current === project.id ? null : project.id))} />)}
      </div>
      <GitHubProjects />
    </div>
  </section>;
}
