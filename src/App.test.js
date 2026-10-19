import { fireEvent, render, screen, within } from '@testing-library/react';
import App from './App';

// Charts are exercised in Chromium; jsdom does not implement Canvas.
jest.mock('react-chartjs-2', () => ({ Radar: () => <div data-testid="radar-chart" /> }));

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

test('renders EPITA student text', () => {
  render(<App />);
  const studentText = screen.getByText('Software Engineering Student at EPITA');
  expect(studentText).toBeInTheDocument();
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

test('provides labeled contact fields and readable skills alongside charts', () => {
  render(<App />);
  fireEvent.change(screen.getByLabelText('Your name'), { target: { value: 'Alex' } });
  expect(screen.getByLabelText('Your name')).toHaveValue('Alex');
  expect(screen.getByLabelText('Your email')).toHaveAttribute('type', 'email');
  expect(screen.getByLabelText('Your message')).toBeRequired();
  expect(screen.getAllByTestId('radar-chart')).toHaveLength(3);
  expect(screen.getByText('OpenCV')).toBeInTheDocument();
});
