import { render, screen } from '@testing-library/react';
import { vi, describe, it, expect } from 'vitest';
import LoginPage from '../pages/LoginPage';


vi.mock('../components/auth/LoginForm', () => ({
  default: () => <div data-testid="login-form-mock">LoginForm</div>,
}));

describe('LoginPage', () => {
  it('renders the page with the main heading and description', () => {
    render(<LoginPage />);


    expect(screen.getByRole('heading', { name: /track your learning journey/i })).toBeInTheDocument();


    expect(screen.getByText(/manage your professional development/i)).toBeInTheDocument();


    expect(screen.getByTestId('login-form-mock')).toBeInTheDocument();
  });
});
