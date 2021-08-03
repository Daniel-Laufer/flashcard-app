import { render, screen } from '@testing-library/react';
import App from './App';
import LogInPage from './components/LogInPage/LogInPage';
import RegistrationPage from './components/RegistrationPage/RegistrationPage';

test('renders login button', () => {
  render(<LogInPage />);
  const el = screen.getByText(/Sign In/i);
  expect(el).toBeInTheDocument();
});

test('renders sign up button on the registration page', () => {
  render(<RegistrationPage />);
  const el = screen.getByText(/Sign Up/i);
  expect(el).toBeInTheDocument();
});
