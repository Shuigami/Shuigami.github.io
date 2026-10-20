import { useRef, useState } from "react";

export default function Journey({ items, label, prefix }) {
  const [selected, setSelected] = useState(0);
  const buttons = useRef([]);
  return <div className="journey">
    <div className="journey-stops" role="tablist" aria-label={label} aria-orientation="vertical">
      {items.map((item, index) => <button type="button" role="tab" id={`${prefix}-tab-${item.id}`} aria-controls={`${prefix}-panel-${item.id}`} aria-selected={selected === index} tabIndex={selected === index ? 0 : -1}
        ref={(element) => { buttons.current[index] = element; }} key={item.id} onClick={() => setSelected(index)}
        onKeyDown={(event) => {
          let next;
          if (event.key === "ArrowDown") next = (index + 1) % items.length;
          if (event.key === "ArrowUp") next = (index - 1 + items.length) % items.length;
          if (event.key === "Home") next = 0;
          if (event.key === "End") next = items.length - 1;
          if (next === undefined) return;
          event.preventDefault(); setSelected(next); buttons.current[next]?.focus();
        }}>
        <span className="journey-marker">{item.marker}</span><span className="journey-stop-title">{item.title}</span><span className="journey-stop-organization">{item.organization}</span><span className="journey-stop-number" aria-hidden="true">0{index + 1}</span>
      </button>)}
    </div>
    <div className="journey-panels">
      {items.map((item, index) => <div key={item.id} role="tabpanel" id={`${prefix}-panel-${item.id}`} aria-labelledby={`${prefix}-tab-${item.id}`} hidden={selected !== index} tabIndex="0" className="journey-detail">
        <p className="section-eyebrow">Field notes / {String(index + 1).padStart(2, "0")}</p><h3>{item.title}</h3><p className="journey-organization">{item.organization}</p><p className="journey-period">{item.period}</p>
        <p className="journey-summary">{item.summary}</p>
        <ul>{item.details.map((detail) => <li key={detail}>{detail}</li>)}</ul>
        <div className="project-tech">{item.tags.map((tag) => <span key={tag} className="tech-tag">{tag}</span>)}</div>
        {prefix === "work" && index < 2 && <div className="journey-results"><h4>Impact & results</h4><p className="pending-note">Detailed outcomes and measured impact to be provided.</p></div>}
      </div>)}
    </div>
  </div>;
}
