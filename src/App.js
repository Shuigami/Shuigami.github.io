import "./App.css";
import { useEffect, useState } from "react";
import FeaturedProjects from "./FeaturedProjects";
import { PROJECTS, PROJECT_SKILLS } from "./projectData";
import { SKILL_AREAS, DEVELOPMENT_TOOLKIT } from "./profileData";
import { ArrowIcon } from "./Icons";
import Journey from "./Journey";
import { EXPERIENCE_STOPS, EDUCATION_STOPS } from "./journeyData";
import ReadingProgress from "./ReadingProgress";
import CopyEmail from "./CopyEmail";
import usePortfolioEffects from "./usePortfolioEffects";
import useInteractionMotion from "./useInteractionMotion";
import ThemeToggle from "./ThemeToggle";

function App() {
  const appRef = usePortfolioEffects();
  useInteractionMotion();
  const [selectedSkill, setSelectedSkill] = useState(null);
  return (
    <div className="App" ref={appRef}>
      <a className="skip-link" href="#main">Skip to content</a>
      <Navigation />
      <main id="main">
        <Hero />
        <About />
        <Skills onSelectSkill={setSelectedSkill} />
        <Projects selectedSkill={selectedSkill} onSelectSkill={setSelectedSkill} />
        <Experience />
        <Education />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    const observer = typeof IntersectionObserver === "undefined" ? null : new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setActiveSection(entry.target.id);
      });
    }, { rootMargin: "-20% 0px -55% 0px" });
    document.querySelectorAll("main section[id]").forEach((section) => observer?.observe(section));
    return () => {
      window.removeEventListener("scroll", onScroll);
      observer?.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!isMobileMenuOpen) return;
    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsMobileMenuOpen(false);
        document.getElementById("menu-toggle").focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isMobileMenuOpen]);

  const navItems = [
    { id: "about", label: "About" },
    { id: "skills", label: "Skills" },
    { id: "projects", label: "Projects" },
    { id: "experience", label: "Experience" },
    { id: "education", label: "Education" },
    { id: "contact", label: "Contact" },
  ];

  return (
    <nav className={`navigation${isScrolled ? " is-scrolled" : ""}`} aria-label="Main navigation">
      <div className="nav-container">
        <a className="nav-brand" href="#home" aria-label="Ewan Schwaller — home" onClick={() => setIsMobileMenuOpen(false)}>ES<span aria-hidden="true">.</span></a>

        <div className="nav-links">
          {navItems.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={`nav-link ${
                activeSection === item.id ? "active" : ""
              }`}
              aria-current={activeSection === item.id ? "location" : undefined}
            >
              {item.label}
            </a>
          ))}
        </div>

        <div className="nav-actions">
          <ThemeToggle />
          <button
            id="menu-toggle"
            className="nav-mobile-toggle"
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-navigation"
            aria-label={isMobileMenuOpen ? "Close navigation" : "Open navigation"}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? "Close −" : "Menu +"}
          </button>
        </div>

        {isMobileMenuOpen && <div id="mobile-navigation" className="nav-mobile-menu" role="group" aria-label="Mobile navigation">
          {navItems.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={`nav-link ${
                activeSection === item.id ? "active" : ""
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
              aria-current={activeSection === item.id ? "location" : undefined}
            >
              {item.label}
            </a>
          ))}
        </div>}
      </div>
      <ReadingProgress />
    </nav>
  );
}

function Hero() {
  return (
    <section id="home" className="hero" aria-labelledby="hero-title">
      <div className="hero-landscape" aria-hidden="true" />
      <div className="hero-haze" aria-hidden="true" />
      <svg className="hero-dunes" viewBox="0 0 1440 260" preserveAspectRatio="none" aria-hidden="true" focusable="false">
        <path className="dune-ridge" d="M-40 210C160 75 290 175 580 195S1080 90 1480 155V280H-40Z" />
        <path className="dune-front" d="M-40 225C240 130 360 230 720 215S1130 145 1480 220V280H-40Z" />
      </svg>
      <div className="hero-content">
        <div className="hero-text">
          <p className="hero-kicker">Final-year engineering intern · AI, vision & software</p>
          <h1 id="hero-title"><span>Ewan</span>{" "}<span>Schwaller</span></h1>
          <p className="hero-description">From images and models<br className="mobile-break" /> to working applications.</p>
          <div className="hero-buttons">
            <a className="btn-primary" href="#projects">Explore projects <ArrowIcon /></a>
            <a className="btn-secondary" href="cv.pdf" target="_blank" rel="noopener noreferrer">Download CV <span className="sr-only">(PDF, opens in a new tab)</span></a>
          </div>
        </div>
      </div>
      <div className="hero-footer container"><span>Portfolio / {new Date().getFullYear()}</span><a href="#about">Scroll to explore <ArrowIcon className="arrow-down" /></a><span>Paris, France / 48.86° N · 2.35° E</span></div>
    </section>
  );
}

function SectionHeading({ id, number, label, children }) {
  return <div className="section-heading"><p className="section-eyebrow"><span>{number} /</span> {label}</p><h2 id={id} className="section-title">{String(children).split(" ").map((word, index) => <span key={`${word}-${index}`}><span className="title-word" style={{ "--word-index": Math.min(index, 6) }}>{word}</span>{" "}</span>)}</h2></div>;
}

function About() {
  return (
    <section id="about" className="section" aria-labelledby="about-title">
      <div className="container">
        <SectionHeading id="about-title" number="01" label="About me">Curiosity as a compass.</SectionHeading>
        <div className="about-content">
          <figure className="about-portrait">
            <img src="me.jpg" alt="Ewan Schwaller" loading="lazy" width="420" height="500" />
            <figcaption>EPITA × UQAC · Double degree<span>Final-year internship in progress</span></figcaption>
          </figure>
          <div className="about-text">
            <p>
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
            <div className="about-highlights">
              <div className="highlight">
                <span className="highlight-number">2</span>
                <span className="highlight-text">Degrees being validated</span>
              </div>
              <div className="highlight">
                <span className="highlight-number">{PROJECTS.length}</span>
                <span className="highlight-text">Featured case studies</span>
              </div>
              <div className="highlight">
                <span className="highlight-number">ADP</span>
                <span className="highlight-text">Previous internships</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Skills({ onSelectSkill }) {
  return (
    <section id="skills" className="section" aria-labelledby="skills-title">
      <div className="container">
        <SectionHeading id="skills-title" number="02" label="Skills & practice">Built through projects and experience.</SectionHeading>
        <p className="section-intro">From training models and rendering scenes to building APIs and processing media. Explore the projects and work behind each area.</p>
        <div className="skills-explore"><p>Follow a skill into a case study.</p><div>{PROJECT_SKILLS.map((skill) => <a key={skill} href="#projects" onClick={() => onSelectSkill(skill)}>{skill}<ArrowIcon /></a>)}</div></div>
        <div className="skills-grid">
          {SKILL_AREAS.map((area, index) => <article key={area.id} className="skill-category" aria-labelledby={`skill-${area.id}`}>
            <span className="skill-area-number" aria-hidden="true">0{index + 1}</span>
            <h3 id={`skill-${area.id}`}>{area.title}</h3>
            <p className="skill-description">{area.description}</p>
            <ul className="skill-technologies" aria-label={`${area.title} technologies`}>
              {area.technologies.map((technology) => <li key={technology}>{PROJECTS.some((project) => project.skills.includes(technology))
                ? <a href="#projects" className="linked-skill" onClick={() => onSelectSkill(technology)} aria-label={`See projects using ${technology}`}>{technology}<ArrowIcon /></a>
                : technology}</li>)}
            </ul>
            <div className="skill-examples" aria-label={`${area.title} examples`}>
              {area.examples.map((example) => {
                const external = example.href.startsWith("https://");
                return <a key={example.href} href={example.href} target={external ? "_blank" : undefined} rel={external ? "noopener noreferrer" : undefined}>
                  {example.label}<ArrowIcon />{external && <span className="sr-only">(opens in a new tab)</span>}
                </a>;
              })}
            </div>
          </article>)}
        </div>
        <div className="skills-toolkit"><h3>Development toolkit</h3><ul>{DEVELOPMENT_TOOLKIT.map((tool) => <li key={tool}>{tool}</li>)}</ul></div>
      </div>
    </section>
  );
}

function Projects({ selectedSkill, onSelectSkill }) {
  return (
    <section id="projects" className="section">
      <div className="container">
        <SectionHeading number="03" label="My projects">Projects I've built.</SectionHeading>
        <p className="projects-intro">Selected work in computer vision, 3D reconstruction, machine learning, cloud applications and rendering. Open a case study to explore the ideas, techniques and visuals behind it.</p>
        <FeaturedProjects selectedSkill={selectedSkill} onSelectSkill={onSelectSkill} />
      </div>
    </section>
  );
}

function Experience() {
  return <section id="experience" className="section"><div className="container">
    <SectionHeading number="04" label="Experience">Learning through the journey.</SectionHeading>
    <p className="section-intro">Choose a stop to explore the work, tools and responsibilities behind each experience.</p>
    <Journey items={EXPERIENCE_STOPS} label="Professional journey" prefix="work" />
  </div></section>;
}

function Education() {
  return <section id="education" className="section"><div className="container">
    <SectionHeading number="05" label="Education">Foundations for what comes next.</SectionHeading>
    <p className="section-intro">From the fundamentals to computer vision and artificial intelligence.</p>
    <Journey items={EDUCATION_STOPS} label="Education journey" prefix="study" />
  </div></section>;
}

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('');

    try {
      // Create mailto link with form data
      const subject = encodeURIComponent(`Portfolio Contact: ${formData.name}`);
      const body = encodeURIComponent(
        `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`
      );
      const mailtoLink = `mailto:ewan.schwaller@epita.fr?subject=${subject}&body=${body}`;
      
      // Open default email client
      window.location.href = mailtoLink;
      
      // Reset form
      setFormData({ name: '', email: '', message: '' });
      setSubmitStatus('success');
      
    } catch (error) {
      console.error('Error sending message:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="section">
      <div className="container">
        <SectionHeading number="06" label="Contact">Let's explore what's possible.</SectionHeading>
        <div className="contact-content">
          <div className="contact-info">
            <div className="contact-item">
              <h3>Email</h3>
              <p><a href="mailto:ewan.schwaller@epita.fr">ewan.schwaller@epita.fr</a></p>
              <CopyEmail email="ewan.schwaller@epita.fr" />
            </div>
            <div className="contact-item">
              <h3>LinkedIn</h3>
              <p>
                <a
                  href="https://www.linkedin.com/in/ewan-schwaller-545b362b5/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  linkedin.com/in/ewan-schwaller/
                </a>
              </p>
            </div>
            <div className="contact-item">
              <h3>GitHub</h3>
              <p>
                <a
                  href="https://github.com/Shuigami"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  github.com/Shuigami
                </a>
              </p>
            </div>
            <div className="contact-item">
              <h3>Location</h3>
              <p>Paris, France</p>
            </div>
          </div>
          <div className="contact-form">
            <h3>Send a Message</h3>
            <p className="form-note">Have a project in mind? This form prepares a message in your email app.</p>
            <form onSubmit={handleSubmit}>
              <label htmlFor="contact-name">Your name</label>
              <input 
                id="contact-name"
                autoComplete="name"
                type="text" 
                name="name"
                placeholder="Your Name" 
                value={formData.name}
                onChange={handleInputChange}
                required 
              />
              <label htmlFor="contact-email">Your email</label>
              <input 
                id="contact-email"
                autoComplete="email"
                type="email" 
                name="email"
                placeholder="Your Email" 
                value={formData.email}
                onChange={handleInputChange}
                required 
              />
              <label htmlFor="contact-message">Your message</label>
              <textarea 
                id="contact-message"
                name="message"
                placeholder="Your Message" 
                rows="5" 
                value={formData.message}
                onChange={handleInputChange}
                required
              ></textarea>
              <button 
                type="submit" 
                className="btn-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Preparing...' : 'Prepare email'} <ArrowIcon />
              </button>
              {submitStatus === 'success' && (
                <p role="status" className="form-status success">Your default email client should open with the message ready to send!</p>
              )}
              {submitStatus === 'error' && (
                <p role="alert" className="form-status error">There was an error. Please try emailing directly at ewan.schwaller@epita.fr</p>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <a href="#home" className="footer-brand" aria-label="Back to top">ES.</a>
        <p>&copy; {new Date().getFullYear()} Ewan Schwaller</p>
        <a href="#home">Back to the horizon <ArrowIcon className="arrow-up" /></a>
      </div>
    </footer>
  );
}

export default App;
