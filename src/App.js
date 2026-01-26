import "./App.css";
import { useState } from "react";

function App() {
  const [activeSection, setActiveSection] = useState("about");

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setActiveSection(sectionId);
    }
  };

  return (
    <div className="App">
      <Navigation
        activeSection={activeSection}
        onSectionClick={scrollToSection}
      />
      <Hero />
      <About />
      <Skills />
      <Projects />
      <Experience />
      <Education />
      <Contact />
      <Footer />
    </div>
  );
}

function Navigation({ activeSection, onSectionClick }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { id: "about", label: "About" },
    { id: "skills", label: "Skills" },
    { id: "projects", label: "Projects" },
    { id: "experience", label: "Experience" },
    { id: "education", label: "Education" },
    { id: "contact", label: "Contact" },
  ];

  const handleSectionClick = (sectionId) => {
    onSectionClick(sectionId);
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="navigation">
      <div className="nav-container">
        <div className="nav-brand">
          <h2>Ewan Schwaller</h2>
        </div>

        <div className="nav-links">
          {navItems.map((item) => (
            <button
              key={item.id}
              className={`nav-link ${
                activeSection === item.id ? "active" : ""
              }`}
              onClick={() => handleSectionClick(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>

        <button
          className="nav-mobile-toggle"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          ☰
        </button>

        <div className={`nav-mobile-menu ${isMobileMenuOpen ? "active" : ""}`}>
          {navItems.map((item) => (
            <button
              key={item.id}
              className={`nav-link ${
                activeSection === item.id ? "active" : ""
              }`}
              onClick={() => handleSectionClick(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}

function Hero() {
  return (
    <section className="hero">
      <div className="hero-content">
        <div className="hero-text">
          <h1>Ewan Schwaller</h1>
          <h2>Software Engineering Student at EPITA</h2>
          <p className="hero-description">
            Passionate 5th year student specializing in Image Processing and
            Artificial Intelligence.
          </p>
          <div className="hero-buttons">
            <button
              className="btn-primary"
              onClick={() =>
                window.scrollTo({
                  top: document.getElementById("projects").offsetTop,
                  behavior: "smooth",
                })
              }
            >
              View Projects
            </button>
            <button
              className="btn-secondary"
              onClick={() => window.open("cv.pdf", "_blank")}
            >
              Download CV
            </button>
          </div>
        </div>
        <div className="hero-image">
          <div className="profile-placeholder">
            <img src="me.jpg" alt="Ewan Schwaller" />
          </div>
        </div>
      </div>
    </section>
  );
}

function About() {
  return (
    <section id="about" className="section">
      <div className="container">
        <h2 className="section-title">About Me</h2>
        <div className="about-content">
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
                <span className="highlight-number">3</span>
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
    },
    {
      title: "AI & Computer Vision",
      skills: [
        { name: "OpenCV", level: 85 },
        { name: "NumPy", level: 85 },
        { name: "scikit-learn", level: 80 },
        { name: "TensorFlow", level: 75 },
        { name: "PyTorch", level: 70 },
        { name: "Deep Learning for Vision", level: 70 },
      ],
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
    },
  ];

  return (
    <section id="skills" className="section">
      <div className="container">
        <h2 className="section-title">Technical Skills</h2>
        <div className="skills-grid">
          {skillCategories.map((category, index) => (
            <div key={index} className="skill-category">
              <h3>{category.title}</h3>
              <div className="skills-list">
                {category.skills.map((skill, skillIndex) => (
                  <div key={skillIndex} className="skill-item">
                    <div className="skill-info">
                      <span className="skill-name">{skill.name}</span>
                      <span className="skill-percentage">{skill.level}%</span>
                    </div>
                    <div className="skill-bar">
                      <div
                        className="skill-fill"
                        style={{ width: `${skill.level}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
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
        <h2 className="section-title">Featured Projects</h2>
        <div className="projects-grid">
          {projects.map((project, index) => (
            <div key={index} className="project-card">
              <div className="project-image">
                <img src={project.image} alt={project.title} />
              </div>
              <div className="project-content">
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
                  <a href={project.github} className="project-link">
                    GitHub
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
        <h2 className="section-title">Work Experience</h2>
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
        <h2 className="section-title">Education</h2>
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
              <p>Relevant Coursework:</p>
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
        <h2 className="section-title">Get In Touch</h2>
        <div className="contact-content">
          <div className="contact-info">
            <div className="contact-item">
              <h3>Email</h3>
              <p>ewan.schwaller@epita.fr</p>
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
            <form onSubmit={handleSubmit}>
              <input 
                type="text" 
                name="name"
                placeholder="Your Name" 
                value={formData.name}
                onChange={handleInputChange}
                required 
              />
              <input 
                type="email" 
                name="email"
                placeholder="Your Email" 
                value={formData.email}
                onChange={handleInputChange}
                required 
              />
              <textarea 
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
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
              {submitStatus === 'success' && (
                <p className="form-status success">Your default email client should open with the message ready to send!</p>
              )}
              {submitStatus === 'error' && (
                <p className="form-status error">There was an error. Please try emailing directly at ewan.schwaller@epita.fr</p>
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
        <p>&copy; 2025 Ewan Schwaller. All rights reserved.</p>
        <p>Built with React • Hosted on GitHub Pages</p>
      </div>
    </footer>
  );
}

export default App;
