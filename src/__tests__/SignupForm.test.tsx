import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ChakraProvider } from '@chakra-ui/react';
import { BrowserRouter } from 'react-router-dom';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import SignupForm from '../components/auth/SignupForm';
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
    signup: mockSignup
  })
}));

vi.mock('../utils/toast', () => ({
  toastService: {
    success: vi.fn(),
    error: vi.fn()
  }
}));

const mockNavigate = vi.fn();
const mockSignup = vi.fn();

describe('SignupForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSignup.mockResolvedValue(true);
  });

  const renderSignupForm = () => {
    return render(
      <ChakraProvider>
        <BrowserRouter>
          <SignupForm />
        </BrowserRouter>
      </ChakraProvider>
    );
  };

  it('should render the form correctly', () => {
    renderSignupForm();
    expect(screen.getByText('Learning Tracker')).toBeInTheDocument();
    expect(screen.getByText('Create your account to start tracking your learning journey.')).toBeInTheDocument();
    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument();
    expect(screen.getByText(/already have an account\?/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /sign in/i })).toBeInTheDocument();
  });

  it('should toggle password visibility when the eye icon is clicked', async () => {
    renderSignupForm();
    const passwordInput = screen.getByLabelText(/password/i);
    expect(passwordInput).toHaveAttribute('type', 'password');
    const toggleButton = screen.getByRole('button', { name: '' });
    await userEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute('type', 'text');
    await userEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute('type', 'password');
  });

  it('should validate name input', async () => {
    renderSignupForm();
    const nameInput = screen.getByLabelText(/full name/i);
    await userEvent.type(nameInput, 'A');
    fireEvent.blur(nameInput);
    expect(screen.getByText('Name must be at least 2 characters')).toBeInTheDocument();
    await userEvent.clear(nameInput);
    await userEvent.type(nameInput, 'deeepak dubey');
    fireEvent.blur(nameInput);
    expect(screen.queryByText('Name must be at least 2 characters')).not.toBeInTheDocument();
  });

  it('should validate email input', async () => {
    renderSignupForm();
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
    renderSignupForm();
    const passwordInput = screen.getByLabelText(/password/i);
    await userEvent.type(passwordInput, 'short');
    fireEvent.blur(passwordInput);
    expect(screen.getByText('Password must be at least 6 characters')).toBeInTheDocument();
    await userEvent.clear(passwordInput);
    await userEvent.type(passwordInput, 'password123');
    fireEvent.blur(passwordInput);
    expect(screen.queryByText('Password must be at least 6 characters')).not.toBeInTheDocument();
  });

  it('should handle successful signup and navigate to dashboard', async () => {
    renderSignupForm();
    await userEvent.type(screen.getByLabelText(/full name/i), 'deeepak dubey');
    await userEvent.type(screen.getByLabelText(/email address/i), 'deeepak@example.com');
    await userEvent.type(screen.getByLabelText(/password/i), 'password123');
    const submitButton = screen.getByRole('button', { name: /create account/i });
    await userEvent.click(submitButton);
    await waitFor(() => {
      expect(mockSignup).toHaveBeenCalledWith('deeepak dubey', 'deeepak@example.com', 'password123');
    });
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
      expect(toastService.success).toHaveBeenCalledWith('Welcome to Learning Tracker!');
    });
  });

  it('should handle failed signup (email already exists)', async () => {
    mockSignup.mockResolvedValue(false);
    renderSignupForm();
    await userEvent.type(screen.getByLabelText(/full name/i), 'deeepak dubey');
    await userEvent.type(screen.getByLabelText(/email address/i), 'existing@example.com');
    await userEvent.type(screen.getByLabelText(/password/i), 'password123');
    const submitButton = screen.getByRole('button', { name: /create account/i });
    await userEvent.click(submitButton);
    await waitFor(() => {
      expect(mockNavigate).not.toHaveBeenCalled();
      expect(toastService.error).toHaveBeenCalledWith('Email already exists. Please try a different email.');
    });
  });

  it('should show error when form is submitted with invalid inputs', async () => {
    renderSignupForm();
    const submitButton = screen.getByRole('button', { name: /create account/i });
    await userEvent.click(submitButton);
    await waitFor(() => {
      expect(toastService.error).toHaveBeenCalledWith('Please check your input fields.');
      expect(mockSignup).not.toHaveBeenCalled();
    });
  });

  it('should submit form when all fields are valid', async () => {
    renderSignupForm();
    await userEvent.type(screen.getByLabelText(/full name/i), 'deeepak dubey');
    await userEvent.type(screen.getByLabelText(/email address/i), 'deeepak@example.com');
    await userEvent.type(screen.getByLabelText(/password/i), 'password123');
    expect(screen.queryByText('Name must be at least 2 characters')).not.toBeInTheDocument();
    expect(screen.queryByText('Please enter a valid email address')).not.toBeInTheDocument();
    expect(screen.queryByText('Password must be at least 6 characters')).not.toBeInTheDocument();
  });
});