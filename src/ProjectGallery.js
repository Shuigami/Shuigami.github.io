import { useRef, useState } from "react";
import Modal from "./Modal";
import { ExpandIcon } from "./Icons";

export function GalleryPlaceholder({ slide, compact = false }) {
  return <div className={`gallery-placeholder${compact ? " is-compact" : ""}`}>
    <span className="placeholder-frame" aria-hidden="true"><span /></span>
    {!compact && <><span className="pending-badge">Preview pending</span><h4>{slide.title}</h4><p>{slide.caption}</p></>}
  </div>;
}

function GalleryContent({ project, index, onChange, onExpand, fullscreen }) {
  const touchStart = useRef(null);
  const slide = project.gallery[index];
  const step = (direction) => onChange((index + direction + project.gallery.length) % project.gallery.length);
  return <div className={`project-gallery${fullscreen ? " is-fullscreen" : ""}`} role="region" aria-roledescription="carousel" aria-label={`${project.title} images`} onKeyDown={(event) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault(); event.stopPropagation(); step(event.key === "ArrowRight" ? 1 : -1);
  }}>
    <div className="gallery-stage" onTouchStart={(event) => { const touch = event.touches[0]; touchStart.current = { x: touch.clientX, y: touch.clientY }; }}
      onTouchEnd={(event) => {
        const start = touchStart.current;
        touchStart.current = null;
        const end = event.changedTouches[0];
        if (start && end && Math.abs(end.clientX - start.x) > 50 && Math.abs(end.clientX - start.x) > Math.abs(end.clientY - start.y) * 1.2) step(end.clientX < start.x ? 1 : -1);
      }}>
      {slide.src ? <img src={slide.src} alt={`${project.title} — ${slide.title}`} /> : <GalleryPlaceholder slide={slide} />}
      {onExpand && <button type="button" className="gallery-expand" onClick={onExpand} aria-label={`Open ${project.title} gallery fullscreen`}><ExpandIcon /> Fullscreen</button>}
    </div>
    <div className="gallery-caption"><div aria-live="polite" aria-atomic="true"><span className="gallery-counter">{String(index + 1).padStart(2, "0")} / {String(project.gallery.length).padStart(2, "0")}</span><p>{slide.title}</p><span>{slide.caption}</span></div>
      <div className="gallery-arrows"><button type="button" onClick={() => step(-1)} aria-label="Previous image">←</button><button type="button" onClick={() => step(1)} aria-label="Next image">→</button></div>
    </div>
    <div className="gallery-thumbnails" aria-label="Choose an image">
      {project.gallery.map((item, itemIndex) => <button type="button" key={item.title} aria-label={`Show image ${itemIndex + 1}: ${item.title}`} aria-pressed={index === itemIndex} onClick={() => onChange(itemIndex)}>
        {item.src ? <img src={item.src} alt="" /> : <GalleryPlaceholder slide={item} compact />}<span>{String(itemIndex + 1).padStart(2, "0")}</span>
      </button>)}
    </div>
  </div>;
}

export default function ProjectGallery({ project }) {
  const [index, setIndex] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);
  return <>
    <GalleryContent project={project} index={index} onChange={setIndex} onExpand={() => setFullscreen(true)} />
    {fullscreen && <Modal title={`${project.title} gallery`} className="gallery-modal" onClose={() => setFullscreen(false)} onKeyDown={(event) => {
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
      event.preventDefault(); event.stopPropagation();
      setIndex((current) => (current + (event.key === "ArrowRight" ? 1 : -1) + project.gallery.length) % project.gallery.length);
    }}><GalleryContent project={project} index={index} onChange={setIndex} fullscreen /></Modal>}
  </>;
}
