// Based on public project source code/READMEs and public/cv.pdf.
// Source references and the user's degree-status update are in PROFILE_SOURCES.md.
export const SKILL_AREAS = [
  {
    id: "ai", title: "Machine learning & generative AI",
    description: "Predictive modelling, DCGAN image generation, LSTM melodies and integration of pretrained music models.",
    technologies: ["Python", "PyTorch", "TensorFlow / Keras", "scikit-learn", "XGBoost", "Transformers"],
    examples: [
      { label: "DCGAN", href: "https://github.com/Shuigami/DCGAN" },
      { label: "NeuralComposer", href: "https://github.com/Shuigami/NeuralComposer" },
      { label: "RaceForesight", href: "https://github.com/Shuigami/RaceForesight" },
    ],
  },
  {
    id: "vision", title: "Computer vision & 3D imaging",
    description: "Image preprocessing and digit recognition, medical-image segmentation and registration, and experiments in photo-based 3D reconstruction.",
    technologies: ["C", "Python", "NumPy", "OpenCV", "ITK", "VTK", "COLMAP / pycolmap"],
    examples: [
      { label: "Sudoku OCR", href: "https://github.com/Shuigami/OCR" },
      { label: "VITK-Project", href: "https://github.com/Shuigami/VITK-Project" },
      { label: "FormaScale", href: "https://github.com/Shuigami/FormaScale" },
    ],
  },
  {
    id: "graphics", title: "Computer graphics & rendering",
    description: "Ray tracing, software rasterization, lighting and shaders, with procedural terrain generation and interactive cameras.",
    technologies: ["C/C++", "OpenGL", "GLSL", "SDL2", "CMake"],
    examples: [
      { label: "Raytracer", href: "https://github.com/Shuigami/RayTracer" },
      { label: "Rasterizer", href: "https://github.com/Shuigami/Rasterizer" },
      { label: "ProceduralLandscapes", href: "https://github.com/Shuigami/ProceduralLandscapes" },
    ],
  },
  {
    id: "web", title: "Full-stack development & APIs",
    description: "Internal monitoring tools at Groupe ADP and project interfaces connecting web frontends, REST APIs and application data.",
    technologies: ["C#", "Blazor", "ASP.NET Core", "Entity Framework", "React", "Next.js", "TypeScript", "FastAPI"],
    examples: [
      { label: "Groupe ADP experience", href: "#experience" },
      { label: "RaceForesight", href: "https://github.com/Shuigami/RaceForesight" },
      { label: "This portfolio", href: "https://github.com/Shuigami/Shuigami.github.io" },
    ],
  },
  {
    id: "media", title: "Cloud & media pipelines",
    description: "Event-driven video processing, transcoding and live job updates, plus speech transcription and translated subtitle generation.",
    technologies: ["AWS Lambda", "S3", "DynamoDB", "EventBridge", "AWS SAM", "FFmpeg", "Whisper", "MarianMT"],
    examples: [
      { label: "VideoFlow", href: "https://github.com/Shuigami/VideoFlow" },
      { label: "Subtitle Translator AI", href: "https://github.com/Shuigami/subtitle-translator-ai" },
    ],
  },
  {
    id: "data", title: "Data analysis & automation",
    description: "Business dashboards and KPIs at Groupe ADP, race-data preparation and Python workflows for vocabulary audio and Anki cards.",
    technologies: ["Python", "pandas", "SQL", "Power BI", "Excel", "Azure"],
    examples: [
      { label: "Groupe ADP experience", href: "#experience" },
      { label: "Anki vocabulary tools", href: "https://github.com/Shuigami/Anki-HTSK-Voc-Downloader" },
    ],
  },
];

export const DEVELOPMENT_TOOLKIT = ["Git", "Unix / Linux", "Docker", "uv", "Vim", "Java", "JavaScript", "Blender"];
