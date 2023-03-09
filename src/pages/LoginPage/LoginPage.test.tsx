import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import LoginPage from './LoginPage';

/*
    This test will check these cases:
    - Login Page render
    - Email & Password are required
    - Email or Password is invalid, we cannot login
    - Email & Password are valid, we can login
*/

describe('Login page', () => {
  it('should render the login page', () => {
    render(<LoginPage />);
    const headerText = screen.getByText('Login to Your Account');
    expect(headerText).toBeInTheDocument();
  });

  it('should validate empty email and password fields', async () => {
    render(<LoginPage />);
    const loginButton = screen.getByRole('button', { name: 'Login' });
    fireEvent.click(loginButton);
    await waitFor(() => {
      const emailError = screen.getByText('Please input your email!');
      const passwordError = screen.getByText('Please input your password!');
      expect(emailError).toBeInTheDocument();
      expect(passwordError).toBeInTheDocument();
    });
  });

  it('should validate invalid email and password', async () => {
    render(<LoginPage />);
    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');
    const loginButton = screen.getByRole('button', { name: 'Login' });
    fireEvent.change(emailInput, { target: { value: 'invalidEmail' } });
    fireEvent.change(passwordInput, { target: { value: 'invalidPassword' } });
    fireEvent.click(loginButton);
    await waitFor(() => {
      const invalidCredentialsError = screen.getByText('Request failed with status code 400');
      expect(invalidCredentialsError).toBeInTheDocument();
    });
  });

  it('should validate valid email and password', async () => {
    render(<LoginPage />);
    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');
    const loginButton = screen.getByRole('button', { name: 'Login' });
    fireEvent.change(emailInput, { target: { value: 'validEmail@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'validPassword' } });
    fireEvent.click(loginButton);
    await waitFor(() => {
      const successMessage = screen.getByText('Login successful');
      expect(successMessage).toBeInTheDocument();
    });
  });
});
