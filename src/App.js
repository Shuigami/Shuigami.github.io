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
import GitHubProjects from "./GitHubProjects";

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

function ArrowIcon({ className = "" }) {
  return <svg className={`arrow-icon ${className}`} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1" aria-hidden="true" focusable="false"><path d="M3 13 13 3M3 3h10v10" /></svg>;
}

function App() {
  return (
    <div className="App">
      <a className="skip-link" href="#main">Skip to content</a>
      <Navigation />
      <main id="main">
        <Hero />
        <Projects />
        <About />
        <Skills />
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
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setActiveSection(entry.target.id);
      });
    }, { rootMargin: "-20% 0px -55% 0px" });
    document.querySelectorAll("main section[id]").forEach((section) => observer.observe(section));
    return () => {
      window.removeEventListener("scroll", onScroll);
      observer.disconnect();
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
    { id: "projects", label: "Projects" },
    { id: "about", label: "About" },
    { id: "skills", label: "Skills" },
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
    </nav>
  );
}

function Hero() {
  return (
    <section id="home" className="hero" aria-labelledby="hero-title">
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
      <div className="hero-footer container"><span>Portfolio / {new Date().getFullYear()}</span><a href="#projects">Scroll to explore <ArrowIcon className="arrow-down" /></a><span>Paris, France</span></div>
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
        <SectionHeading number="02" label="Behind the code">Curiosity as a compass.</SectionHeading>
        <div className="about-content">
          <figure className="about-portrait">
            <img src="me.jpg" alt="Ewan Schwaller" loading="lazy" width="420" height="500" />
            <figcaption>Software Engineering Student at EPITA<span>Image processing & artificial intelligence</span></figcaption>
          </figure>
          <div className="about-text">
            <p>
              I am a dedicated 5th year Software Engineering student at EPITA,
              specializing in Image Processing and Artificial Intelligence. My
              academic path has combined rigorous theoretical foundations with
              hands-on experience in computer vision, machine learning, and
              software development.
            </p>
            <p>
              Through intensive projects and coursework at EPITA, I've developed
              strong skills in algorithms, system design, and AI-driven
              solutions. I'm currently preparing to pursue a double degree at
              UQAC in the Master's program in Computer Science, with a focus on
              Artificial Intelligence, to further deepen my expertise. I thrive
              in collaborative, innovation-driven environments and am passionate
              about turning complex problems into scalable, intelligent systems.
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

function Skills() {
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
        <SectionHeading number="03" label="Tools & expertise">A toolkit for new frontiers.</SectionHeading>
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
                  {category.skills.map((skill) => <li key={skill.name}><span>{skill.name}</span><span>{skill.level}%</span></li>)}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Projects() {
  const projects = [
    {
      title: "Raytracer",
      description:
        "A modern C++ raytracer implementation with support for multiple geometric primitives, lighting, and material systems.",
      technologies: ["C++"],
      github: "https://github.com/shuigami/raytracer",
      image: "raytracer.png",
    },
    {
      title: "Sudoku OCR Solver",
      description:
        "An advanced computer vision system that automatically detects, extracts, and solves Sudoku puzzles from images using sophisticated image processing techniques, neural network digit recognition, and backtracking algorithms.",
      technologies: ["C++", "SDL2", "GTK"],
      github: "https://github.com/shuigami/ocr",
      live: null,
      image: "ocr.jpeg",
    },
    {
      title: "Rasterizer",
      description:
        "A modern C++ software rasterizer built from scratch with multiple shading techniques and real-time rendering capabilities!",
      technologies: ["C++", "SDL2"],
      github: "https://github.com/shuigami/rasterizer",
      image: "rasterizer.png",
    },
  ];

  return (
    <section id="projects" className="section">
      <div className="container">
        <SectionHeading number="01" label="My projects">Projects I've built.</SectionHeading>
        <p className="projects-intro">A selection of my work in computer graphics and computer vision — designed, coded, and built from scratch.</p>
        <div className="projects-grid">
          {projects.map((project, index) => (
            <div key={index} className="project-card">
              <div className="project-image">
                <img src={project.image} alt={`${project.title} project screenshot`} loading="lazy" />
              </div>
              <div className="project-content">
                <span className="project-number">0{index + 1}</span>
                <h3>{project.title}</h3>
                <p>{project.description}</p>
                <div className="project-tech">
                  {project.technologies.map((tech, techIndex) => (
                    <span key={techIndex} className="tech-tag">
                      {tech}
                    </span>
                  ))}
                </div>
                <div className="project-links">
                  <a href={project.github} className="project-link" target="_blank" rel="noopener noreferrer" aria-label={`View ${project.title} on GitHub (opens in a new tab)`}>
                    View project <ArrowIcon />
                  </a>
                  {project.live && (
                    <a href={project.live} className="project-link">
                      Live Demo
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        <GitHubProjects />
      </div>
    </section>
  );
}

function Experience() {
  const experiences = [
    {
      company: "ADP - Groupe ADP",
      position: "Web Development Intern",
      duration: "September 2024 - January 2025",
      description: [
        "Developed a monitoring web application for the Extime marketplace using Blazor (frontend) and ASP.NET Core (backend).",
        "Enabled real-time visualization of order workflows to support operational teams in identifying and resolving issues efficiently.",
        "Participated in an agile environment with daily stand-ups and iterative sprints.",
        "Strengthened skills in C#, API development, Entity Framework, and data visualization with ApexCharts.",
        "Contributed to ADP’s broader digital transformation by delivering a scalable and modular internal tool."
      ],
    },
    {
      company: "ADP - Groupe ADP",
      position: "Data Analytics Intern",
      duration: "May - July 2023",
      description: [
        "Worked within the Data pole of the Digital department in the Information Systems Department",
        "Created an innovative marketing brochure for data visualization solutions",
        "Optimized existing dashboards on Excel and Power BI according to customer needs",
        "Developed Power BI applications with relevant KPIs using Azure services",
        "Applied data analytics techniques to improve business intelligence solutions",
      ],
    },
    {
      company: "ADP - Groupe ADP",
      position: "IT Department Discovery Intern",
      duration: "June 2022",
      description: [
        "Internship in the Digital department of the Information Systems Department",
        "Discovered entities and professions within the IT department",
        "Explored technologies including Azure, SAP BO, and Power BI in the App & Data division",
        "Created and presented a comprehensive application map",
        "Introduced to Power BI for dashboard creation and business intelligence",
      ],
    },
    {
      company: "ADP - Paris-Orly Airport",
      position: "Information Systems Observer",
      duration: "2018",
      description: [
        "Observation internship at the Information Systems Directorate of Paris-Orly Airport",
        "Gained insights into airport information systems infrastructure",
        "Observed IT operations and systems management in a critical transportation hub",
        "First exposure to enterprise-level information systems and their importance in aviation",
      ],
    },
  ];

  return (
    <section id="experience" className="section">
      <div className="container">
        <SectionHeading number="04" label="Experience">Learning through the journey.</SectionHeading>
        <div className="experience-timeline">
          {experiences.map((exp, index) => (
            <div key={index} className="experience-item">
              <div className="experience-header">
                <h3>{exp.position}</h3>
                <span className="company">{exp.company}</span>
                <span className="duration">{exp.duration}</span>
              </div>
              <ul className="experience-description">
                {exp.description.map((item, itemIndex) => (
                  <li key={itemIndex}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Education() {
  return (
    <section id="education" className="section">
      <div className="container">
        <SectionHeading number="05" label="Education">Foundations for what comes next.</SectionHeading>
        <div className="education-content">
          <div className="education-item">
            <div className="education-header">
              <h3>Master's in Computer Science - Artificial Intelligence</h3>
              <span className="school">
                UQAC - Université du Québec à Chicoutimi
              </span>
              <span className="duration">2025 - 2026 (Expected)</span>
            </div>
            <div className="education-details">
              <p>
                Specialization: Artificial Intelligence and Machine Learning
              </p>
              <p>
                Double degree program in partnership with EPITA, focusing on
                advanced AI techniques, deep learning, and intelligent systems
                development
              </p>
            </div>
          </div>
          <div className="education-item">
            <div className="education-header">
              <h3>Master's in Computer Science - IMAGE Major</h3>
              <span className="school">
                EPITA - École Pour l'Informatique et les Techniques Avancées
              </span>
              <span className="duration">2021 - 2026 (Expected)</span>
            </div>
            <div className="education-details">
              <p>Specialization: Image Processing and Computer Vision</p>
              <p>
                Major IMAGE focuses on digital image processing, computer
                vision, pattern recognition, multimedia applications, and image
                synthesis
              </p>
              <p>
                Relevant Coursework: Image Synthesis, Image Processing, Machine
                Learning, OpenGL Programming, Medical Imaging, Pattern
                Recognition
              </p>
            </div>
          </div>
          <div className="education-item">
            <div className="education-header">
              <h3>General Baccalauréat with Honors</h3>
              <span className="school">Lycée Corot, Savigny-sur-Orge</span>
              <span className="duration">2019 - 2021</span>
            </div>
            <div className="education-details">
              <p>
                Specializations: Mathematics, Physics-Chemistry and English
                Literature
              </p>
              <p>Option: Advanced Mathematics</p>
              <p>
                Strong foundation in advanced mathematics and sciences,
                preparing for engineering studies
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
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
