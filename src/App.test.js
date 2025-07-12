import { render, screen } from '@testing-library/react';
import App from './App';

test('renders portfolio name', () => {
  render(<App />);
  const nameElement = screen.getByText(/Ewan Schwaller/i);
  expect(nameElement).toBeInTheDocument();
});

test('renders EPITA student text', () => {
  render(<App />);
  const studentText = screen.getByText(/Software Engineering Student at EPITA/i);
  expect(studentText).toBeInTheDocument();
});

test('renders navigation links', () => {
  render(<App />);
  const aboutLink = screen.getByText(/About/i);
  const skillsLink = screen.getByText(/Skills/i);
  const projectsLink = screen.getByText(/Projects/i);
  expect(aboutLink).toBeInTheDocument();
  expect(skillsLink).toBeInTheDocument();
  expect(projectsLink).toBeInTheDocument();
});
