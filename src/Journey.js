import { useEffect, useRef, useState } from "react";

/** Horizontal route of stops (tablist) with a detail panel for the selected one. */
export default function Journey({ items, label, prefix, defaultIndex = 0 }) {
  const [selected, setSelected] = useState(defaultIndex);
  const buttons = useRef([]);
  const scroller = useRef(null);
  const select = (index) => {
    setSelected(index);
    buttons.current[index]?.focus();
  };
  // On narrow screens the route scrolls sideways: start with the default stop in view, without moving the page.
  useEffect(() => {
    const strip = scroller.current;
    const stop = buttons.current[defaultIndex];
    if (strip && stop && strip.scrollWidth > strip.clientWidth) strip.scrollLeft = Math.max(0, stop.offsetLeft - 16);
  }, [defaultIndex]);
  return <div className="journey">
    <div className="route-scroll" ref={scroller}>
      <div className="route-stops" role="tablist" aria-label={label} aria-orientation="horizontal" style={{ "--stop-count": items.length }}>
        <span className="route-line" aria-hidden="true" />
        {items.map((item, index) => <button type="button" role="tab" id={`${prefix}-tab-${item.id}`} aria-controls={`${prefix}-panel-${item.id}`}
          aria-selected={selected === index} tabIndex={selected === index ? 0 : -1} className="route-stop"
          ref={(element) => { buttons.current[index] = element; }} key={item.id} onClick={() => setSelected(index)}
          onKeyDown={(event) => {
            let next;
            if (event.key === "ArrowRight") next = (index + 1) % items.length;
            if (event.key === "ArrowLeft") next = (index - 1 + items.length) % items.length;
            if (event.key === "Home") next = 0;
            if (event.key === "End") next = items.length - 1;
            if (next === undefined) return;
            event.preventDefault();
            select(next);
          }}>
          <span className="route-marker">{item.marker}</span>
          <span className="route-dot-box" aria-hidden="true"><span className="route-dot" /></span>
          <span className="route-kind">{item.kind}</span>
          <span className="route-title">{item.title}</span>
        </button>)}
      </div>
    </div>
    {items.map((item, index) => <div key={item.id} role="tabpanel" id={`${prefix}-panel-${item.id}`} aria-labelledby={`${prefix}-tab-${item.id}`}
      hidden={selected !== index} tabIndex="0" className="journey-detail">
      <div>
        <p className="eyebrow">{item.kind} / {item.period}</p>
        <h3>{item.title}</h3>
        <p className="journey-organization">{item.organization}</p>
        <p className="journey-summary">{item.summary}</p>
      </div>
      <div>
        {item.details.length > 0 && <ul>{item.details.map((detail) => <li key={detail}>{detail}</li>)}</ul>}
        <div className="tag-list">{item.tags.map((tag) => <span key={tag} className="tech-tag">{tag}</span>)}</div>
      </div>
    </div>)}
  </div>;
}
