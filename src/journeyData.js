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

const experienceTags = [
  ["C#", "Blazor", "ASP.NET Core", "Entity Framework", "ApexCharts"],
  ["Power BI", "Excel", "Azure"],
  ["Power BI", "Azure", "SAP BO"],
  ["Information systems", "Observation"],
];

export const EXPERIENCE_STOPS = experiences.map((experience, index) => ({
  id: `experience-${index}`,
  title: experience.position,
  organization: experience.company,
  period: experience.duration,
  marker: ["2024–25", "2023", "2022", "2018"][index],
  summary: experience.description[0],
  details: experience.description.slice(1),
  tags: experienceTags[index],
}));

export const EDUCATION_STOPS = [
  {
    id: "uqac", marker: "2025–26", period: "2025–2026 (expected)",
    title: "Master's in Computer Science — Artificial Intelligence",
    organization: "UQAC — Université du Québec à Chicoutimi",
    summary: "Double degree program in partnership with EPITA, focused on artificial intelligence and machine learning.",
    details: ["Advanced AI techniques, deep learning and intelligent systems development."],
    tags: ["Artificial Intelligence", "Machine Learning", "Double degree"],
  },
  {
    id: "epita", marker: "2021–26", period: "2021–2026 (expected)",
    title: "Master's in Computer Science — IMAGE Major",
    organization: "EPITA — École Pour l'Informatique et les Techniques Avancées",
    summary: "Specialization in image processing and computer vision, covering image synthesis, pattern recognition and multimedia applications.",
    details: ["Coursework: image synthesis, image processing, machine learning, OpenGL programming, medical imaging and pattern recognition."],
    tags: ["Computer Vision", "Image Synthesis", "OpenGL"],
  },
  {
    id: "corot", marker: "2019–21", period: "2019–2021",
    title: "General Baccalauréat with Honors",
    organization: "Lycée Corot, Savigny-sur-Orge",
    summary: "Specializations in mathematics, physics-chemistry and English literature.",
    details: ["Advanced mathematics option, building foundations for engineering studies."],
    tags: ["Mathematics", "Physics-Chemistry", "English Literature"],
  },
];
