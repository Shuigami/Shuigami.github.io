import { render, screen, within } from '@testing-library/react';
import App from './App';
import { PROJECTS } from './projectData';
import { SKILL_AREAS } from './profileData';

jest.mock('./GitHubProjects', () => () => <div>GitHub project browser</div>);

test('renders portfolio name', () => {
  render(<App />);
  expect(screen.getByRole('heading', { level: 1, name: /Ewan Schwaller/i })).toBeInTheDocument();
});

test('describes the current internship without claiming completed degrees', () => {
  render(<App />);
  const about = screen.getByRole('region', { name: 'Curiosity as a compass.' });
  expect(about).toHaveTextContent('EPITA × UQAC · Double degree');
  expect(about).toHaveTextContent("I'm completing my final-year internship to validate both");
  expect(about).not.toHaveTextContent('20+');
});

test('the route rail links every waypoint and the main navigation keeps the CV and theme toggle', () => {
  render(<App />);
  const rail = within(screen.getByRole('navigation', { name: 'Waypoints' }));
  const waypoints = [['Departure', 'home'], ['Brief', 'brief'], ['About', 'camp'], ['Projects', 'discoveries'], ['Skills', 'kit'], ['Journey', 'route'], ['Contact', 'contact']];
  for (const [label, id] of waypoints) {
    expect(rail.getByRole('link', { name: label })).toHaveAttribute('href', `#${id}`);
    // eslint-disable-next-line testing-library/no-node-access -- the anchor target must exist
    expect(document.getElementById(id)).toBeInTheDocument();
  }
  expect(rail.getAllByRole('link').filter((link) => link.getAttribute('aria-current') === 'location')).toHaveLength(1);
  const navigation = within(screen.getByRole('navigation', { name: 'Main navigation' }));
  expect(navigation.getByRole('link', { name: /^CV/ })).toHaveAttribute('href', 'cv.pdf');
  expect(navigation.getByRole('switch', { name: 'Light theme' })).toBeInTheDocument();
  expect(screen.getByRole('link', { name: 'Skip to content' })).toHaveAttribute('href', '#main');
});

test('the hero and the 30-second brief lead to the work, the CV and the email', () => {
  render(<App />);
  expect(screen.getByRole('link', { name: /See the work/ })).toHaveAttribute('href', '#discoveries');
  expect(screen.getByRole('link', { name: 'The 30-second brief' })).toHaveAttribute('href', '#brief');
  const brief = within(screen.getByRole('region', { name: 'The 30-second brief' }));
  expect(brief.getByText('Final-year engineering intern')).toBeInTheDocument();
  expect(brief.getByText('Groupe ADP')).toBeInTheDocument();
  expect(brief.getByRole('link', { name: /Download CV/ })).toHaveAttribute('href', 'cv.pdf');
  expect(brief.getByRole('button', { name: 'Copy email' })).toBeInTheDocument();
});

test('keeps project order, destinations and project pages', () => {
  render(<App />);
  expect(PROJECTS.map((project) => project.id)).toEqual(['formascale', 'rasterizer', 'raceforesight', 'videoflow', 'vitk', 'raytracer', 'ocr']);
  const titles = within(screen.getByRole('region', { name: "Projects I've built." })).getAllByRole('heading', { level: 3 }).slice(0, PROJECTS.length);
  expect(titles.map((title) => title.textContent)).toEqual(PROJECTS.map((project) => project.title));
  for (const [name, repo] of [['Raytracer', 'raytracer'], ['Sudoku OCR Solver', 'ocr'], ['Rasterizer', 'rasterizer']]) {
    expect(screen.getByRole('link', { name: `View ${name} on GitHub (opens in a new tab)` }))
      .toHaveAttribute('href', `https://github.com/shuigami/${repo}`);
  }
  const pages = screen.getAllByRole('link', { name: /^Project page/ });
  expect(pages.map((link) => link.getAttribute('href'))).toEqual(['https://shuigami.github.io/FormaScale/', 'https://shuigami.github.io/Rasterizer/']);
});

test('skills are grounded in projects: lit tools are buttons, others are plain labels', () => {
  render(<App />);
  const skills = screen.getByRole('region', { name: 'Built through projects and experience.' });
  expect(within(skills).getAllByRole('article')).toHaveLength(6);
  expect(skills).not.toHaveTextContent(/\d+%/);
  expect(within(skills).getByText('OpenCV')).toBeInTheDocument();
  expect(within(skills).queryByRole('button', { name: /OpenCV/ })).not.toBeInTheDocument();
  expect(within(skills).getAllByRole('button', { name: 'Python: show matching projects' })).toHaveLength(3);
  expect(within(skills).getByRole('button', { name: 'CMake: show matching projects' })).toBeInTheDocument();
});

test('the skills matrix maps every area to the projects and experience that used it', () => {
  render(<App />);
  const matrix = screen.getByRole('table', { name: 'Where each skill was used' });
  const rows = within(matrix).getAllByRole('row');
  expect(rows).toHaveLength(SKILL_AREAS.length + 1);
  const headers = within(rows[0]).getAllByRole('columnheader').map((header) => header.textContent);
  expect(headers.slice(1)).toEqual(['FormaScale', 'Rasterizer', 'RaceForesight', 'VideoFlow', 'VITK-Project', 'Raytracer', 'Sudoku OCR', 'Groupe ADP']);
  const graphics = within(matrix).getByRole('row', { name: /Computer graphics & rendering/ });
  const used = within(graphics).getAllByRole('cell').map((cell) => cell.textContent);
  expect(used).toEqual(['Not used', 'Used', 'Not used', 'Not used', 'Not used', 'Used', 'Not used', 'Not used']);
  // The first area is active by default, and its related columns are highlighted.
  expect(rows[1]).toHaveClass('is-active');
  expect(within(rows[0]).getByText('RaceForesight')).toHaveClass('is-related');
});

test('the contact finale offers email, copy, profiles and the CV without a form', () => {
  render(<App />);
  const contact = within(screen.getByRole('region', { name: "Let's explore what's possible." }));
  expect(contact.getByRole('link', { name: 'ewan.schwaller@epita.fr' })).toHaveAttribute('href', 'mailto:ewan.schwaller@epita.fr');
  expect(contact.getByRole('button', { name: 'Copy email' })).toBeInTheDocument();
  expect(contact.getByRole('link', { name: /LinkedIn/ })).toHaveAttribute('href', 'https://www.linkedin.com/in/ewan-schwaller-545b362b5/');
  expect(contact.getByRole('link', { name: /GitHub/ })).toHaveAttribute('href', 'https://github.com/Shuigami');
  expect(contact.getByRole('link', { name: /CV \(PDF\)/ })).toHaveAttribute('href', 'cv.pdf');
  expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
});
