import { render, screen } from '@testing-library/react';
import { vi, describe, it, expect } from 'vitest';
import SignupPage from '../pages/SignupPage';

vi.mock('../components/auth/SignupForm', () => ({
  default: () => <div data-testid="signup-form-mock">SignupForm</div>,
}));

describe('SignupPage', () => {
  it('renders the page with the main heading and description', () => {
    render(<SignupPage />);

    expect(screen.getByRole('heading', { name: /begin your learning journey/i })).toBeInTheDocument();

    expect(screen.getByText(/manage your professional development/i)).toBeInTheDocument();

    expect(screen.getByTestId('signup-form-mock')).toBeInTheDocument();
  });
});
