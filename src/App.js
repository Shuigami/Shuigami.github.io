import "./App.css";
import { useCallback, useRef, useState } from "react";
import { ArrowIcon } from "./Icons";
import Projects from "./Projects";
import Skills from "./Skills";
import Journey from "./Journey";
import Waypoint from "./Waypoint";
import { ROUTE_STOPS, DEFAULT_ROUTE_STOP } from "./journeyData";
import ReadingProgress from "./ReadingProgress";
import CopyEmail from "./CopyEmail";
import ThemeToggle from "./ThemeToggle";
import useExpeditionScroll, { WAYPOINTS } from "./useExpeditionScroll";
import useInteractionMotion from "./useInteractionMotion";
import useFlipReorder from "./useFlipReorder";
import { reducedMotion } from "./motion";

const EMAIL = "ewan.schwaller@epita.fr";
const LINKEDIN = "https://www.linkedin.com/in/ewan-schwaller-545b362b5/";
const GITHUB = "https://github.com/Shuigami";
const CV = "cv.pdf";
const NEW_TAB = <span className="sr-only">(opens in a new tab)</span>;

function App() {
  const appRef = useRef(null);
  const scroll = useExpeditionScroll(appRef);
  useInteractionMotion();
  const [selectedSkill, setSelectedSkill] = useState(null);
  const { register: registerSpread, capture: captureSpreads } = useFlipReorder(selectedSkill);

  const selectSkill = useCallback((skill) => {
    captureSpreads(); // Measure the spreads before React reorders them.
    setSelectedSkill(skill);
  }, [captureSpreads]);

  const followSkill = useCallback((skill) => {
    selectSkill(skill);
    const projects = document.getElementById("discoveries");
    if (projects) window.scrollTo({ top: projects.offsetTop - 70, behavior: reducedMotion() ? "auto" : "smooth" });
  }, [selectSkill]);

  return (
    <div className="App" ref={appRef}>
      <a className="skip-link" href="#main">Skip to content</a>
      <div className="sky-glow" aria-hidden="true" />
      <div className="sky-stars" aria-hidden="true" />
      <Navigation current={scroll.current} scrolled={scroll.scrolled} />
      <RouteRail current={scroll.current} visible={scroll.railVisible} />
      <main id="main">
        <Hero />
        <Brief />
        <About />
        <Projects selectedSkill={selectedSkill} onSelectSkill={selectSkill} registerSpread={registerSpread} />
        <Skills onSelectSkill={followSkill} />
        <section id="route" className="section" aria-labelledby="journey-title">
          <div className="container">
            <Waypoint number="Waypoint 04" label="Experience & education" />
            <h2 id="journey-title" className="section-title">Learning through the journey.</h2>
            <Journey items={ROUTE_STOPS} defaultIndex={DEFAULT_ROUTE_STOP} label="Experience and education route" prefix="route" />
          </div>
        </section>
        <Contact />
      </main>
    </div>
  );
}

function Navigation({ current, scrolled }) {
  const waypoint = WAYPOINTS[current];
  return (
    <nav className={`navigation${scrolled ? " is-scrolled" : ""}`} aria-label="Main navigation">
      <div className="nav-container">
        <a className="nav-brand" href="#home" aria-label="Ewan Schwaller — home">ES<span aria-hidden="true">.</span></a>
        <p className="nav-waypoint" aria-hidden="true">
          <span className="nav-waypoint-number">{String(current).padStart(2, "0")}</span>
          <span className="nav-waypoint-rule" />
          <span className="nav-waypoint-label">{waypoint.label}</span>
        </p>
        <div className="nav-actions">
          <ThemeToggle />
          <a className="nav-cv" href={CV} target="_blank" rel="noopener noreferrer">CV <ArrowIcon className="arrow-down" /><span className="sr-only">(PDF, opens in a new tab)</span></a>
        </div>
      </div>
      <ReadingProgress />
    </nav>
  );
}

function RouteRail({ current, visible }) {
  return (
    <nav className={`route-rail${visible ? " is-visible" : ""}`} aria-label="Waypoints">
      <span className="route-rail-track" aria-hidden="true"><span /></span>
      <ol>
        {WAYPOINTS.map((waypoint, index) => <li key={waypoint.id}>
          <a href={`#${waypoint.id}`} className={`${index <= current ? "is-passed" : ""}${index === current ? " is-current" : ""}`.trim() || undefined}
            aria-current={index === current ? "location" : undefined}>
            <span className="route-rail-dot" aria-hidden="true" /><span className="route-rail-label">{waypoint.label}</span>
          </a>
        </li>)}
      </ol>
    </nav>
  );
}

function Hero() {
  return (
    <section id="home" className="hero" aria-labelledby="hero-title">
      <div className="hero-landscape" aria-hidden="true" />
      <div className="hero-sun" aria-hidden="true" />
      <div className="hero-scrim" aria-hidden="true" />
      <p className="hero-hud">48.86° N · 2.35° E<br />Paris, France<br />Final-year internship in progress</p>
      <div className="hero-content">
        <p className="hero-kicker"><span className="kicker-rule" aria-hidden="true" />Final-year engineering intern · AI, vision &amp; software</p>
        <h1 id="hero-title"><span>Ewan</span>{" "}<span>Schwaller</span></h1>
        <div className="hero-row">
          <p className="hero-tagline">From images and models to working applications.</p>
          <div className="button-row">
            <a className="btn-primary" href="#discoveries">See the work <ArrowIcon /></a>
            <a className="btn-glass" href="#brief">The 30-second brief</a>
          </div>
        </div>
      </div>
    </section>
  );
}

const BRIEF = [
  { key: "Who", value: "Final-year engineering intern", sub: "EPITA (IMAGE major) × UQAC (AI)" },
  { key: "Focus", value: "AI, vision & software", sub: "From images and models to working applications." },
  { key: "Experience", value: "Groupe ADP", sub: "Web development & data analytics internships" },
];

function Brief() {
  return (
    <section id="brief" className="brief" aria-labelledby="brief-title">
      <h2 id="brief-title" className="sr-only">The 30-second brief</h2>
      <div className="container brief-grid">
        <dl className="brief-facts">
          {BRIEF.map((item) => <div key={item.key} className="brief-cell">
            <dt>{item.key}</dt>
            <dd><span className="brief-value">{item.value}</span><span className="brief-sub">{item.sub}</span></dd>
          </div>)}
        </dl>
        <div className="brief-cell brief-actions">
          <a className="btn-primary btn-compact" href={CV} target="_blank" rel="noopener noreferrer">Download CV <span className="file-type">PDF</span><span className="sr-only">(opens in a new tab)</span></a>
          <CopyEmail email={EMAIL} className="btn-outline" icon />
        </div>
      </div>
    </section>
  );
}

function About() {
  return (
    <section id="camp" className="section about" aria-labelledby="about-title">
      <div className="container container-narrow">
        <Waypoint number="Waypoint 01" label="About me" />
        <div className="about-grid">
          <figure className="about-portrait">
            <img src="me.jpg" alt="Ewan Schwaller" loading="lazy" width="420" height="525" />
            <figcaption>EPITA × UQAC · Double degree<span>Final-year internship in progress</span></figcaption>
          </figure>
          <div className="about-text">
            <h2 id="about-title" className="section-title">Curiosity <em>as a</em> compass.</h2>
            <p className="lead">
              I'm completing my final-year internship to validate both my EPITA
              engineering degree, in the IMAGE major, and my UQAC computer science
              degree, focused on artificial intelligence.
            </p>
            <p>
              My projects connect AI, images and software: generative models for
              music and handwritten digits, medical-image analysis, 3D reconstruction,
              C++ rendering engines and applications for video processing and race strategy.
            </p>
            <p>
              At Groupe ADP, I worked on full-stack monitoring tools with C#, Blazor
              and ASP.NET Core, and on data dashboards with Power BI and Azure.
              I have also helped introduce programming to schoolgirls through
              Prologin's Girls Can Code! workshops.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Contact() {
  return (
    <section id="contact" className="contact" aria-labelledby="contact-title">
      <div className="contact-landscape" aria-hidden="true" />
      <div className="contact-scrim" aria-hidden="true" />
      <div className="container contact-inner">
        <Waypoint number="Next waypoint" label="Contact" className="waypoint-bright" />
        <h2 id="contact-title" className="contact-title">Let's explore what's possible.</h2>
        <div className="contact-email">
          <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
          <CopyEmail email={EMAIL} className="btn-glass-small" />
        </div>
        <footer className="contact-footer">
          <a href={LINKEDIN} target="_blank" rel="noopener noreferrer">LinkedIn <span aria-hidden="true">↗</span>{NEW_TAB}</a>
          <a href={GITHUB} target="_blank" rel="noopener noreferrer">GitHub <span aria-hidden="true">↗</span>{NEW_TAB}</a>
          <a href={CV} target="_blank" rel="noopener noreferrer">CV (PDF) <span aria-hidden="true">↓</span>{NEW_TAB}</a>
          <span className="muted">Paris, France</span>
          <span className="muted copyright">&copy; {new Date().getFullYear()} Ewan Schwaller</span>
        </footer>
      </div>
    </section>
  );
}

export default App;
