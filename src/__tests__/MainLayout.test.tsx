import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import MainLayout from '../components/layout/MainLayout';
import { BrowserRouter } from 'react-router-dom';
import { AuthState } from '../store/authSlice';
import '@testing-library/jest-dom';


const MockChild = () => <div data-testid="mock-child">Test Child</div>;


vi.mock('./Navbar', () => ({
  __esModule: true,
  default: ({ onMobileMenuToggle }: { onMobileMenuToggle: () => void }) => (
    <nav data-testid="navbar" onClick={onMobileMenuToggle}>
      Navbar
    </nav>
  ),
}));

vi.mock('./Sidebar', () => ({
  __esModule: true,
  default: () => <aside data-testid="sidebar">Sidebar</aside>,
}));

describe('MainLayout', () => {
  
  const createMockStore = (preloadedState: { auth: Partial<AuthState> }) => {
    return configureStore({
      reducer: {
        auth: (state: AuthState = { isAuthenticated: false, user: null, loading: false, error: null }) => 
          ({
            ...state,
            ...preloadedState.auth,
            user: preloadedState.auth.user || null,
            isAuthenticated: preloadedState.auth.isAuthenticated || false,
          })
      },
    });
  };

  const renderWithProviders = (
    ui: React.ReactElement, 
    { preloadedState = { auth: { isAuthenticated: false } } } = {}
  ) => {
    const store = createMockStore(preloadedState);

    const Wrapper = ({ children }: { children: React.ReactNode }) => (
      <Provider store={store}>
        <BrowserRouter>
          {children}
        </BrowserRouter>
      </Provider>
    );

    return {
      ...render(ui, { wrapper: Wrapper }),
      store,
    };
  };

  beforeEach(() => {
    
    vi.clearAllMocks();
  });

  it('renders children when not authenticated', async () => {
    renderWithProviders(
      <MainLayout>
        <MockChild />
      </MainLayout>,
      {
        preloadedState: { 
          auth: { isAuthenticated: false } 
        },
      }
    );

    
    expect(screen.getByTestId('mock-child')).toBeInTheDocument();
    expect(screen.queryByTestId('navbar')).not.toBeInTheDocument();
    expect(screen.queryByTestId('sidebar')).not.toBeInTheDocument();
  });

  it('renders layout with navbar and sidebar when authenticated', async () => {
    renderWithProviders(
      <MainLayout>
        <MockChild />
      </MainLayout>,
      {
        preloadedState: { 
          auth: { isAuthenticated: true } 
        },
      }
    );

    
    expect(screen.getByTestId('navbar')).toBeInTheDocument();
    expect(screen.getByTestId('sidebar')).toBeInTheDocument();
    expect(screen.getByTestId('mock-child')).toBeInTheDocument();
  });

});
