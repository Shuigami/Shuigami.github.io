import { useState } from "react";
import { PROJECTS, PROJECT_SKILLS } from "./projectData";
import { SKILL_AREAS, DEVELOPMENT_TOOLKIT } from "./profileData";
import Waypoint from "./Waypoint";

const MATRIX_COLUMNS = [
  ...PROJECTS.map((project) => ({ id: project.id, label: project.title.replace(" Solver", "") })),
  { id: "adp", label: "Groupe ADP" },
];
const areaNumber = (index) => String(index + 1).padStart(2, "0");

function ToolChip({ tool, onSelect }) {
  if (!PROJECT_SKILLS.includes(tool)) return <li><span className="tool-chip"><span className="tool-dot" aria-hidden="true" />{tool}</span></li>;
  return <li><button type="button" className="tool-chip is-lit" onClick={() => onSelect(tool)} aria-label={`${tool}: show matching projects`}>
    <span className="tool-dot" aria-hidden="true" />{tool}
  </button></li>;
}

function SkillMatrix({ activeArea, onActivate }) {
  const related = SKILL_AREAS[activeArea]?.relatedProjects || [];
  return <div className="matrix">
    <p className="matrix-heading" id="matrix-title">Where each skill was used</p>
    <div className="matrix-scroll" tabIndex="0" role="region" aria-labelledby="matrix-title">
      <div className="matrix-grid" role="table" aria-labelledby="matrix-title">
        <div className="matrix-row matrix-head" role="row">
          <span role="columnheader"><span className="sr-only">Skill area</span></span>
          {MATRIX_COLUMNS.map((column) => <span key={column.id} role="columnheader" className={related.includes(column.id) ? "is-related" : undefined}>{column.label}</span>)}
        </div>
        {SKILL_AREAS.map((area, index) => <div key={area.id} role="row" className={`matrix-row${index === activeArea ? " is-active" : ""}`} onMouseEnter={() => onActivate(index)}>
          <span role="rowheader" className="matrix-area"><span className="matrix-number">{areaNumber(index)}</span>{area.title}</span>
          {MATRIX_COLUMNS.map((column) => {
            const used = area.relatedProjects.includes(column.id);
            return <span key={column.id} role="cell" className="matrix-cell">
              <span className={`matrix-dot${used ? " is-used" : ""}`} aria-hidden="true" />
              <span className="sr-only">{used ? "Used" : "Not used"}</span>
            </span>;
          })}
        </div>)}
      </div>
    </div>
  </div>;
}

export default function Skills({ onSelectSkill }) {
  const [activeArea, setActiveArea] = useState(0);
  return <section id="kit" className="section skills-section" aria-labelledby="skills-title">
    <div className="container">
      <Waypoint number="Waypoint 03" label="Skills & practice" />
      <h2 id="skills-title" className="section-title skills-title">Built through projects and experience.</h2>
      <p className="skills-hint"><span className="glow-dot" aria-hidden="true" />Lit tools open the projects that use them.</p>
      <div className="skill-cards">
        {SKILL_AREAS.map((area, index) => <article key={area.id} aria-labelledby={`skill-${area.id}`}
          className={`skill-card${index === activeArea ? " is-active" : ""}`}
          onMouseEnter={() => setActiveArea(index)} onFocus={() => setActiveArea(index)}>
          <div className="skill-card-head">
            <h3 id={`skill-${area.id}`}>{area.title}</h3>
            <span className="skill-card-number" aria-hidden="true">{areaNumber(index)}</span>
          </div>
          <ul className="tool-chips" aria-label={`${area.title} tools`}>
            {area.technologies.map((tool) => <ToolChip key={tool} tool={tool} onSelect={onSelectSkill} />)}
          </ul>
        </article>)}
      </div>
      <SkillMatrix activeArea={activeArea} onActivate={setActiveArea} />
      <div className="toolkit"><h3>Development toolkit</h3><ul>{DEVELOPMENT_TOOLKIT.map((tool) => <li key={tool}>{tool}</li>)}</ul></div>
    </div>
  </section>;
}
