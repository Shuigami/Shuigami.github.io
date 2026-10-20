import "./App.css";
import { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";
import { Radar } from "react-chartjs-2";
import FeaturedProjects from "./FeaturedProjects";
import { PROJECTS, PROJECT_SKILLS } from "./projectData";
import { ArrowIcon } from "./Icons";
import Journey from "./Journey";
import { EXPERIENCE_STOPS, EDUCATION_STOPS } from "./journeyData";
import ReadingProgress from "./ReadingProgress";
import CopyEmail from "./CopyEmail";
import usePortfolioEffects from "./usePortfolioEffects";

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

function App() {
  const appRef = usePortfolioEffects();
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
          <p className="hero-kicker">Software engineer · AI & computer vision</p>
          <h1 id="hero-title"><span>Ewan</span>{" "}<span>Schwaller</span></h1>
          <p className="hero-description">Building intelligent systems.<br className="mobile-break" /> Exploring new horizons.</p>
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

function SectionHeading({ number, label, children }) {
  return <div className="section-heading"><p className="section-eyebrow"><span>{number} /</span> {label}</p><h2 className="section-title">{children}</h2></div>;
}

function About() {
  return (
    <section id="about" className="section">
      <div className="container">
        <SectionHeading number="01" label="About me">Curiosity as a compass.</SectionHeading>
        <div className="about-content">
          <figure className="about-portrait">
            <img src="me.jpg" alt="Ewan Schwaller" loading="lazy" width="420" height="500" />
            <figcaption>Software Engineering Student at EPITA<span>Image processing & artificial intelligence</span></figcaption>
          </figure>
          <div className="about-text">
            <p>
              5th-year software engineering student at EPITA, specializing in
              image processing, computer vision and artificial intelligence.
              I explore how code can turn pixels and geometry into something useful.
            </p>
            <p>
              My work spans rendering engines, image recognition and web applications.
              I'm preparing a double degree with UQAC in Computer Science and AI,
              building on hands-on projects and experience at Groupe ADP.
            </p>
            <div className="about-highlights">
              <div className="highlight">
                <span className="highlight-number">5</span>
                <span className="highlight-text">Years at EPITA</span>
              </div>
              <div className="highlight">
                <span className="highlight-number">20+</span>
                <span className="highlight-text">Projects Completed</span>
              </div>
              <div className="highlight">
                <span className="highlight-number">4</span>
                <span className="highlight-text">Internships</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Skills({ onSelectSkill }) {
  const skillCategories = [
    {
      title: "Programming Languages",
      skills: [
        { name: "C/C++", level: 90 },
        { name: "Python", level: 85 },
        { name: "C#", level: 85 },
        { name: "Java", level: 80 },
        { name: "JavaScript", level: 75 },
        { name: "SQL", level: 70 },
      ],
      color: "rgba(235, 151, 55, 0.18)",
      borderColor: "#eba137",
    },
    {
      title: "AI & Computer Vision",
      skills: [
        { name: "OpenCV", level: 85 },
        { name: "NumPy", level: 85 },
        { name: "scikit-learn", level: 80 },
        { name: "TensorFlow", level: 75 },
        { name: "PyTorch", level: 70 },
        { name: "Deep Learning", level: 70 },
      ],
      color: "rgba(213, 105, 65, 0.18)",
      borderColor: "#e3946a",
    },
    {
      title: "Development & Tools",
      skills: [
        { name: "Vim", level: 95 },
        { name: "Unix/Linux", level: 90 },
        { name: "Git", level: 85 },
        { name: "Docker", level: 75 },
        { name: "React.js", level: 70 },
        { name: "Blender", level: 65 },
      ],
      color: "rgba(222, 197, 146, 0.18)",
      borderColor: "#dec592",
    },
  ];

  const chartOptions = {
    scales: {
      r: {
        angleLines: {
          color: "rgba(255, 255, 255, 0.1)",
        },
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
        },
        pointLabels: {
          color: "#d9c9b7",
          font: {
            size: 11,
            family: "Arial, sans-serif",
            weight: "500",
          },
        },
        ticks: {
          display: false,
          stepSize: 20,
        },
        suggestedMin: 0,
        suggestedMax: 100,
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "rgba(38, 22, 15, 0.96)",
        titleFont: { size: 14 },
        bodyFont: { size: 14 },
        displayColors: false,
      },
    },
    maintainAspectRatio: false,
    responsive: true,
  };

  return (
    <section id="skills" className="section">
      <div className="container">
        <SectionHeading number="02" label="Skills & expertise">A toolkit for new frontiers.</SectionHeading>
        <div className="skills-explore"><p>Follow a skill into a project.</p><div>{PROJECT_SKILLS.map((skill) => <a key={skill} href="#projects" onClick={() => onSelectSkill(skill)}>{skill}<ArrowIcon /></a>)}</div></div>
        <div className="skills-grid">
          {skillCategories.map((category, index) => {
            const data = {
              labels: category.skills.map((s) => s.name),
              datasets: [
                {
                  label: "Level",
                  data: category.skills.map((s) => s.level),
                  backgroundColor: category.color,
                  borderColor: category.borderColor,
                  borderWidth: 2,
                  pointBackgroundColor: category.borderColor,
                  pointBorderColor: "#fff",
                  pointHoverBackgroundColor: "#fff",
                  pointHoverBorderColor: category.borderColor,
                },
              ],
            };

            return (
              <div key={index} className="skill-category">
                <h3>{category.title}</h3>
                <div className="skill-chart-container">
                  <Radar data={data} options={chartOptions} role="img" aria-label={`${category.title} proficiency chart`} />
                </div>
                <ul className="skill-summary">
                  {category.skills.map((skill) => <li key={skill.name}><span>{PROJECTS.some((project) => project.skills.includes(skill.name)) ? <a href="#projects" className="linked-skill" onClick={() => onSelectSkill(skill.name)} aria-label={`See projects using ${skill.name}`}>{skill.name}<ArrowIcon /></a> : skill.name}</span><span>{skill.level}%</span></li>)}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Projects({ selectedSkill, onSelectSkill }) {
  return (
    <section id="projects" className="section">
      <div className="container">
        <SectionHeading number="03" label="My projects">Projects I've built.</SectionHeading>
        <p className="projects-intro">Selected work in computer graphics and computer vision. Open a case study to explore the ideas, techniques and visuals behind it.</p>
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
