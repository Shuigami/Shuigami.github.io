// Technical descriptions are based on the public project READMEs.
// Personal contributions, retrospective challenges and metrics await the author.
export const PROJECTS = [
  {
    id: "raytracer", title: "Raytracer", category: "Computer graphics", context: "Academic project",
    summary: "From rays and geometry to light, materials and rendered scenes.",
    description: "A C++ raytracer with configurable geometric primitives, lights, materials and camera settings.",
    technologies: ["C++20", "CMake"], skills: ["C/C++", "Computer Graphics", "CMake"],
    github: "https://github.com/shuigami/raytracer", image: "raytracer.png",
    objective: "Generate images from a scene description by tracing rays through a configurable camera and computing their intersections with objects.",
    approach: ["Ray intersections with spheres, planes, triangles and boxes.", "Phong illumination, shadow rays and plastic or metal materials.", "Multi-sample anti-aliasing and PPM image export."],
    outcome: "A configurable rendering pipeline that produces PPM images. The render in this gallery is already available in the portfolio.",
    gallery: [
      { src: "raytracer.png", title: "Rendered scene", caption: "Existing render from the portfolio." },
      { title: "Materials & lighting", caption: "Additional render to be provided.", needed: "A second scene showing different materials and lighting." },
      { title: "Anti-aliasing comparison", caption: "Comparison capture to be provided.", needed: "The same scene rendered with and without anti-aliasing." },
    ],
  },
  {
    id: "ocr", title: "Sudoku OCR Solver", category: "Computer vision", context: "Academic team project · STEL · 4 contributors",
    summary: "Turn a photographed Sudoku grid into a recognized, solved puzzle.",
    description: "A C application combining image preprocessing, grid extraction, a custom digit-recognition network and a backtracking solver.",
    technologies: ["C", "SDL2", "GTK"], skills: ["C/C++", "Computer Vision", "SDL2", "Neural Networks"],
    github: "https://github.com/shuigami/ocr", image: "ocr.jpeg",
    objective: "Detect a Sudoku grid in an image, recognize its digits and solve the extracted puzzle through a command-line or GTK interface.",
    approach: ["Noise reduction, edge detection and Hough-based grid detection.", "Cell extraction followed by digit recognition with a custom neural network.", "Backtracking to solve the grid and display the result."],
    outcome: "An image-to-solution workflow with visual processing feedback. Developed by the STEL team: Tristan Hette, Sasha Reggiani, Ewan Schwaller and Lorenzo Taalba.",
    gallery: [
      { src: "ocr.jpeg", title: "Sudoku interface", caption: "Existing interface screenshot from the portfolio." },
      { title: "Processing steps", caption: "Intermediate captures to be provided.", needed: "Grid detection and digit-extraction captures." },
      { title: "Input → solution", caption: "Before-and-after capture to be provided.", needed: "A source image alongside its recognized and solved grid." },
    ],
  },
  {
    id: "rasterizer", title: "Rasterizer", category: "Computer graphics", context: "Academic project",
    summary: "Build a 3D image one triangle at a time, with switchable shading.",
    description: "A C++ software rendering pipeline with depth testing, multiple shading models and interactive camera controls.",
    technologies: ["C++17", "SDL2", "CMake"], skills: ["C/C++", "Computer Graphics", "SDL2", "CMake"],
    github: "https://github.com/shuigami/rasterizer", image: "rasterizer.png",
    objective: "Render 3D meshes through a software rasterization pipeline and explore different shading and lighting techniques.",
    approach: ["Triangle rasterization with barycentric interpolation and Z-buffer depth testing.", "Flat, Phong and toon shading, plus shadow mapping.", "SDL2 window management, camera controls and wireframe rendering."],
    outcome: "An interactive software renderer with switchable shading and wireframe modes. The gallery showcases geometric primitives, a village, a solar system, a temple, a garden and the original well model.",
    gallery: [
      { src: "rasterizer/geometric-primitives.jpg", title: "Geometric primitives", caption: "Colored spheres, a cube and a cylinder arranged on a raised platform." },
      { src: "rasterizer/low-poly-village.jpg", title: "Low-poly village", caption: "Four red-roofed houses, trees and intersecting paths." },
      { src: "rasterizer/solar-system.jpg", title: "Solar system", caption: "A central star surrounded by colored planets, orbital paths and a ringed planet." },
      { src: "rasterizer/columned-temple.jpg", title: "Columned temple", caption: "A stepped temple with columns, a red roof and a golden sphere at its center." },
      { src: "rasterizer/fountain-garden.jpg", title: "Fountain garden", caption: "A two-tier fountain surrounded by trees, benches and garden paths." },
      { src: "rasterizer.png", title: "Well model", caption: "The original well-model render from the portfolio." },
    ],
  },
];

export const PROJECT_SKILLS = ["C/C++", "Computer Graphics", "Computer Vision", "SDL2", "CMake", "Neural Networks"];
