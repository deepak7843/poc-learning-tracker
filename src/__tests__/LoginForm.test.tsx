import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ChakraProvider } from '@chakra-ui/react';
import { BrowserRouter } from 'react-router-dom';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import LoginForm from '../components/auth/LoginForm';
import { toastService } from '../utils/toast';

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>();
  return {
    ...actual,
    useNavigate: () => mockNavigate
  };
}); 

vi.mock('../hooks/useAuth', () => ({
  default: () => ({
    login: mockLogin
  })
}));

vi.mock('../utils/toast', () => ({
  toastService: {
    success: vi.fn(),
    error: vi.fn()
  }
}));

const mockNavigate = vi.fn();
const mockLogin = vi.fn();

describe('LoginForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockLogin.mockResolvedValue(true);
  });

  const renderLoginForm = () => {
    return render(
      <ChakraProvider>
        <BrowserRouter>
          <LoginForm />
        </BrowserRouter>
      </ChakraProvider>
    );
  };

  it('should render the form correctly', () => {
    renderLoginForm();
    expect(screen.getByText('Learning Tracker')).toBeInTheDocument();
    expect(screen.getByText('Sign in to access your learning dashboard and track your progress.')).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('checkbox', { name: /remember me/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
    expect(screen.getByText(/don't have an account\?/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /sign up/i })).toBeInTheDocument();
  });

  it('should show password when toggle button is clicked', async () => {
    renderLoginForm();
    const passwordInput = screen.getByLabelText(/password/i);
    expect(passwordInput).toHaveAttribute('type', 'password');
    const toggleButton = screen.getByRole('button', { name: '' });
    await userEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute('type', 'text');
    await userEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute('type', 'password');
  });

  it('should validate email input', async () => {
    renderLoginForm();
    const emailInput = screen.getByLabelText(/email address/i);
    await userEvent.type(emailInput, 'invalid-email');
    fireEvent.blur(emailInput);
    expect(screen.getByText('Please enter a valid email address')).toBeInTheDocument();
    await userEvent.clear(emailInput);
    await userEvent.type(emailInput, 'test@example.com');
    fireEvent.blur(emailInput);
    expect(screen.queryByText('Please enter a valid email address')).not.toBeInTheDocument();
  });

  it('should validate password input', async () => {
    renderLoginForm();
    const passwordInput = screen.getByLabelText(/password/i);
    await userEvent.type(passwordInput, 'short');
    fireEvent.blur(passwordInput);
    expect(screen.getByText('Password must be at least 6 characters')).toBeInTheDocument();
    await userEvent.clear(passwordInput);
    await userEvent.type(passwordInput, 'password123');
    fireEvent.blur(passwordInput);
    expect(screen.queryByText('Password must be at least 6 characters')).not.toBeInTheDocument();
  });

  it('should handle remember me checkbox', async () => {
    renderLoginForm();
    const rememberMeCheckbox = screen.getByRole('checkbox', { name: /remember me/i });
    expect(rememberMeCheckbox).not.toBeChecked();
    await userEvent.click(rememberMeCheckbox);
    expect(rememberMeCheckbox).toBeChecked();
    await userEvent.click(rememberMeCheckbox);
    expect(rememberMeCheckbox).not.toBeChecked();
  });

  it('should handle successful login and navigate to dashboard', async () => {
    renderLoginForm();
    await userEvent.type(screen.getByLabelText(/email address/i), 'user@example.com');
    await userEvent.type(screen.getByLabelText(/password/i), 'password123');
    const submitButton = screen.getByRole('button', { name: /sign in/i });
    await userEvent.click(submitButton);
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('user@example.com', 'password123', false);
    });
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
      expect(toastService.success).toHaveBeenCalledWith('Welcome back!');
    });
  });

  it('should handle login with remember me checked', async () => {
    renderLoginForm();
    await userEvent.type(screen.getByLabelText(/email address/i), 'user@example.com');
    await userEvent.type(screen.getByLabelText(/password/i), 'password123');
    const rememberMeCheckbox = screen.getByRole('checkbox', { name: /remember me/i });
    await userEvent.click(rememberMeCheckbox);
    const submitButton = screen.getByRole('button', { name: /sign in/i });
    await userEvent.click(submitButton);
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('user@example.com', 'password123', true);
    });
  });

  it('should handle failed login', async () => {
    mockLogin.mockResolvedValue(false);
    renderLoginForm();
    await userEvent.type(screen.getByLabelText(/email address/i), 'user@example.com');
    await userEvent.type(screen.getByLabelText(/password/i), 'password123');
    const submitButton = screen.getByRole('button', { name: /sign in/i });
    await userEvent.click(submitButton);
    await waitFor(() => {
      expect(mockNavigate).not.toHaveBeenCalled();
      expect(toastService.error).toHaveBeenCalledWith('Invalid email or password.');
    });
  });
});