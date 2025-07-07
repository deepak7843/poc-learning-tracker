import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import Sidebar from '../components/layout/Sidebar';
import { initialState, AuthState } from '../store/authSlice';

type PartialAuth = Partial<AuthState>;
const createMockStore = (auth: PartialAuth) => {
  return configureStore({
    reducer: {
      auth: (state: AuthState = { ...initialState }) => ({ ...state, ...auth }),
    },
    preloadedState: { auth: { ...initialState, ...auth } },
  });
};

describe('Sidebar', () => {
  it('renders main menu items without additional items', () => {
    const store = createMockStore({ user: null });
    render(
      <Provider store={store}>
        <ChakraProvider>
          <MemoryRouter initialEntries={['/dashboard']}>
            <Sidebar />
          </MemoryRouter>
        </ChakraProvider>
      </Provider>
    );

    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Topics')).toBeInTheDocument();
    expect(screen.getByText('Timeline')).toBeInTheDocument();

    expect(screen.queryByText('Reporting Employees')).not.toBeInTheDocument();
    expect(screen.queryByText('All Employees')).not.toBeInTheDocument();
  });

  it('renders manager menu items when user is manager', () => {
    const store = createMockStore({ user: { role: 'manager' } as AuthState['user'] });
    render(
      <Provider store={store}>
        <ChakraProvider>
          <MemoryRouter initialEntries={['/reporting-employees']}>
            <Sidebar />
          </MemoryRouter>
        </ChakraProvider>
      </Provider>
    );

    expect(screen.getByText('Reporting Employees')).toBeInTheDocument();
    expect(screen.getByText('Management')).toBeInTheDocument();
    expect(screen.queryByText('All Employees')).not.toBeInTheDocument();
  });

  it('renders admin menu items when user is admin', () => {
    const store = createMockStore({ user: { role: 'admin' } as AuthState['user'] });
    render(
      <Provider store={store}>
        <ChakraProvider>
          <MemoryRouter initialEntries={['/employees']}>
            <Sidebar />
          </MemoryRouter>
        </ChakraProvider>
      </Provider>
    );

    expect(screen.getByText('All Employees')).toBeInTheDocument();
    expect(screen.getByText('Upload Videos')).toBeInTheDocument();
    expect(screen.getByText('Admin')).toBeInTheDocument();
  });

  it('highlights the active link based on location', () => {
    const store = createMockStore({ user: null });
    render(
      <Provider store={store}>
        <ChakraProvider>
          <MemoryRouter initialEntries={['/topics']}>
            <Sidebar />
          </MemoryRouter>
        </ChakraProvider>
      </Provider>
    );

    const topicsLink = screen.getByText('Topics').closest('a');
    expect(topicsLink).toHaveClass('bg-primary-50');
  });

  it('renders version text', () => {
    const store = createMockStore({ user: null });
    render(
      <Provider store={store}>
        <ChakraProvider>
          <MemoryRouter>
            <Sidebar />
          </MemoryRouter>
        </ChakraProvider>
      </Provider>
    );

    expect(screen.getByText(/Learning Tracker v1.0/)).toBeInTheDocument();
  });
});
