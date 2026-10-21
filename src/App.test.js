import { fireEvent, render, screen, within } from '@testing-library/react';
import App from './App';

jest.mock('./GitHubProjects', () => () => <div>GitHub project browser</div>);

beforeAll(() => {
  window.IntersectionObserver = class {
    observe() {}
    disconnect() {}
  };
});

test('renders portfolio name', () => {
  render(<App />);
  const nameElement = screen.getByRole('heading', { level: 1, name: /Ewan Schwaller/i });
  expect(nameElement).toBeInTheDocument();
});

test('describes the current internship without claiming completed degrees', () => {
  render(<App />);
  const about = screen.getByRole('region', { name: 'Curiosity as a compass.' });
  expect(about).toHaveTextContent('EPITA × UQAC · Double degree');
  expect(about).toHaveTextContent("I'm completing my final-year internship to validate both");
  expect(about).not.toHaveTextContent('20+');
});

test('renders navigation links', () => {
  render(<App />);
  const navigation = within(screen.getByRole('navigation', { name: 'Main navigation' }));
  for (const label of ['About', 'Skills', 'Projects', 'Experience', 'Education', 'Contact']) {
    const link = navigation.getByRole('link', { name: label });
    expect(link).toHaveAttribute('href', `#${label.toLowerCase()}`);
  }
});

test('mobile menu closes after navigation and supports Escape', () => {
  render(<App />);
  const toggle = screen.getByRole('button', { name: 'Open navigation' });
  fireEvent.click(toggle);
  expect(toggle).toHaveAttribute('aria-expanded', 'true');
  const menu = screen.getByRole('group', { name: 'Mobile navigation' });
  fireEvent.click(within(menu).getByRole('link', { name: 'Projects' }));
  expect(toggle).toHaveAttribute('aria-expanded', 'false');
  expect(screen.queryByRole('group', { name: 'Mobile navigation' })).not.toBeInTheDocument();
  fireEvent.click(toggle);
  fireEvent.keyDown(document, { key: 'Escape' });
  expect(toggle).toHaveAttribute('aria-expanded', 'false');
  expect(toggle).toHaveFocus();
});

test('keeps project destinations and the CV available', () => {
  render(<App />);
  for (const [name, repo] of [['Raytracer', 'raytracer'], ['Sudoku OCR Solver', 'ocr'], ['Rasterizer', 'rasterizer']]) {
    expect(screen.getByRole('link', { name: `View ${name} on GitHub (opens in a new tab)` }))
      .toHaveAttribute('href', `https://github.com/shuigami/${repo}`);
  }
  expect(screen.getByRole('link', { name: /Download CV/ })).toHaveAttribute('href', 'cv.pdf');
  expect(screen.getByRole('link', { name: /Explore projects/ })).toHaveAttribute('href', '#projects');
});

test('provides labeled contact fields and skills grounded in projects instead of proficiency scores', () => {
  render(<App />);
  fireEvent.change(screen.getByLabelText('Your name'), { target: { value: 'Alex' } });
  expect(screen.getByLabelText('Your name')).toHaveValue('Alex');
  expect(screen.getByLabelText('Your email')).toHaveAttribute('type', 'email');
  expect(screen.getByLabelText('Your message')).toBeRequired();
  const skills = screen.getByRole('region', { name: 'Built through projects and experience.' });
  expect(within(skills).getAllByRole('article')).toHaveLength(6);
  expect(skills).not.toHaveTextContent(/\d+%/);
  expect(within(skills).getByText('OpenCV')).toBeInTheDocument();
  expect(within(skills).getByRole('link', { name: /ProceduralLandscapes/ })).toHaveAttribute('href', 'https://github.com/Shuigami/ProceduralLandscapes');
  expect(within(skills).getByRole('link', { name: /VideoFlow/ })).toHaveAttribute('target', '_blank');
  expect(within(skills).getAllByRole('link', { name: 'Groupe ADP experience' })[0]).toHaveAttribute('href', '#experience');
});
