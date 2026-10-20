import { useState } from "react";
import { PROJECTS, PROJECT_SKILLS } from "./projectData";
import { ArrowIcon } from "./Icons";
import Modal from "./Modal";
import ProjectGallery from "./ProjectGallery";
import GitHubProjects from "./GitHubProjects";

function ProjectDetails({ project, onClose }) {
  return <Modal title={`${project.title} — case study`} onClose={onClose}>
    <div className="case-study">
      <div className="case-intro"><p className="section-eyebrow">Field notes / {project.category}</p><p className="case-lead">{project.summary}</p><p className="case-context">{project.context}</p><div className="project-tech">{project.technologies.map((technology) => <span className="tech-tag" key={technology}>{technology}</span>)}</div></div>
      <ProjectGallery project={project} />
      <div className="case-notes">
        <section><span className="case-note-number">01 / The goal</span><h3>What I set out to explore.</h3><p>{project.objective}</p></section>
        <section><span className="case-note-number">02 / The approach</span><h3>Inside the project.</h3><ul>{project.approach.map((item) => <li key={item}>{item}</li>)}</ul></section>
        <section className="case-pending"><span className="case-note-number">03 / My contribution</span><h3>My role, in detail.</h3><p>Personal contribution details coming soon.</p><span className="pending-badge">Details to be provided</span></section>
        <section className="case-pending"><span className="case-note-number">04 / Challenges</span><h3>Lessons from the build.</h3><p>Technical challenges and how I addressed them coming soon.</p><span className="pending-badge">Details to be provided</span></section>
        <section className="case-outcome"><span className="case-note-number">05 / The outcome</span><h3>From code to a result.</h3><p>{project.outcome}</p><p className="pending-note">Benchmarks and measured results have not been provided yet.</p></section>
      </div>
      <a className="btn-primary case-github" href={project.github} target="_blank" rel="noopener noreferrer">Explore the repository <ArrowIcon /><span className="sr-only">(opens in a new tab)</span></a>
    </div>
  </Modal>;
}

export default function FeaturedProjects({ selectedSkill, onSelectSkill }) {
  const [openedProject, setOpenedProject] = useState(null);
  const visible = PROJECTS.filter((project) => !selectedSkill || project.skills.includes(selectedSkill));
  return <>
    <div className="project-filters" role="group" aria-label="Filter featured projects">
      {[null, ...PROJECT_SKILLS].map((skill) => <button type="button" key={skill || "all"} aria-pressed={selectedSkill === skill} onClick={() => onSelectSkill(skill)}>{skill || "All projects"}</button>)}
    </div>
    <p className="featured-count" role="status">{visible.length} {visible.length === 1 ? "case study" : "case studies"}{selectedSkill ? ` using ${selectedSkill}` : " to explore"}.</p>
    <div className="projects-grid" key={selectedSkill || "all"}>
      {visible.map((project) => <article key={project.id} className="project-card">
        <button type="button" className="project-image project-cover" aria-label={`Explore ${project.title}`} onClick={() => setOpenedProject(project)}><img src={project.image} alt={`${project.title} project screenshot`} loading="lazy" /><span className="project-cover-action">Open field notes <ArrowIcon /></span></button>
        <div className="project-content"><span className="project-number">0{PROJECTS.indexOf(project) + 1} / {project.category}</span><h3><button type="button" className="project-title-button" onClick={() => setOpenedProject(project)}>{project.title}</button></h3><p>{project.summary}</p>
          <div className="project-tech">{project.technologies.map((technology) => <span className="tech-tag" key={technology}>{technology}</span>)}</div>
          <div className="project-links"><button type="button" className="project-link" aria-label={`Read ${project.title} case study`} onClick={() => setOpenedProject(project)}>Read case study <ArrowIcon /></button><a className="project-link project-source" href={project.github} target="_blank" rel="noopener noreferrer" aria-label={`View ${project.title} on GitHub (opens in a new tab)`}>GitHub <ArrowIcon /></a></div>
        </div>
      </article>)}
    </div>
    <GitHubProjects />
    {openedProject && <ProjectDetails key={openedProject.id} project={openedProject} onClose={() => setOpenedProject(null)} />}
  </>;
}
