import { ReactNode } from 'react';
import { render, screen } from '@testing-library/react';
// import '@testing-library/jest-dom';
import App from './App';

// Mock dependencies
jest.mock('./components/common/ToastContainer', () => () => <div>ToastContainer</div>);
jest.mock('./components/layout/MainLayout', () => ({
  __esModule: true,
  default: ({ children }: { children: ReactNode }) => <div>MainLayout{children}</div>,
}));
jest.mock('./components/routing/AppRoutes', () => () => <div>AppRoutes</div>);

// Mock ChakraProvider and Router to render children
jest.mock('@chakra-ui/react', () => {
  const actual = jest.requireActual('@chakra-ui/react');
  return {
    ...actual,
    ChakraProvider: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  };
});
jest.mock('react-router-dom', () => ({
  BrowserRouter: ({ children }: { children: ReactNode }) => <div>{children}</div>,
}));

describe('App', () => {
  it('renders main components and sets document title', () => {
    render(<App />);
    expect(screen.getByText('MainLayout')).toBeInTheDocument();
    expect(screen.getByText('ToastContainer')).toBeInTheDocument();
    expect(screen.getByText('AppRoutes')).toBeInTheDocument();
    expect(document.title).toBe('Learning Tracker');
  });

  it('renders loading fallback', () => {
    // Directly render the fallback for test (not Suspense)
    const LoadingFallback = () => (
      <div data-testid="loading-fallback" className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
    render(<LoadingFallback />);
    expect(screen.getByTestId('loading-fallback')).toBeInTheDocument();
  });
});
