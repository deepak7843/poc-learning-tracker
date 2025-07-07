import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { ChakraProvider } from '@chakra-ui/react';
import Navbar from '../components/layout/Navbar';
import { initialState, AuthState } from '../store/authSlice';
import { vi } from 'vitest';

const mockLogout = vi.fn();
const mockUpdateRole = vi.fn();
vi.mock('../hooks/useAuth', () => ({
  default: () => ({ logout: mockLogout, updateRole: mockUpdateRole }),
}));

const createMockStore = (auth: Partial<AuthState>) => {
  return configureStore({
    reducer: {
      auth: (state: AuthState = initialState) => ({ ...state, ...auth }),
    },
    preloadedState: { auth: { ...initialState, ...auth } },
  });
};

describe('Navbar', () => {
  const onMobileMenuToggle = vi.fn();

  beforeEach(() => {
    mockLogout.mockClear();
    mockUpdateRole.mockClear();
    onMobileMenuToggle.mockClear();
  });

  it('renders title and toggle button', () => {
    const store = createMockStore({ user: { role: 'user', name: 'Test', email: 'test@example.com', avatarUrl: '' } });
    render(
      <Provider store={store}>
        <ChakraProvider>
          <Navbar onMobileMenuToggle={onMobileMenuToggle} />
        </ChakraProvider>
      </Provider>
    );

    expect(screen.getByLabelText('Toggle mobile menu')).toBeInTheDocument();
    expect(screen.getByText('Learning Tracker')).toBeInTheDocument();
  });

  it('calls onMobileMenuToggle when toggle button is clicked', () => {
    const store = createMockStore({ user: { role: 'user', name: '', email: '', avatarUrl: '' } });
    render(
      <Provider store={store}>
        <ChakraProvider>
          <Navbar onMobileMenuToggle={onMobileMenuToggle} />
        </ChakraProvider>
      </Provider>
    );

    fireEvent.click(screen.getByLabelText('Toggle mobile menu'));
    expect(onMobileMenuToggle).toHaveBeenCalledTimes(1);
  });

  it('calls updateRole when selecting a new role', async () => {
    const user = { role: 'user', name: 'User', email: 'user@example.com', avatarUrl: '' };
    const store = createMockStore({ user });
    render(
      <Provider store={store}>
        <ChakraProvider>
          <Navbar onMobileMenuToggle={onMobileMenuToggle} />
        </ChakraProvider>
      </Provider>
    );

    fireEvent.click(screen.getAllByRole('button', { name: /user/i })[0]);
    fireEvent.click(screen.getByText('Manager'));
    expect(mockUpdateRole).toHaveBeenCalledWith('manager');
  });

  it('calls logout when clicking sign out', async () => {
    const user = { role: 'admin', name: 'Admin', email: 'admin@example.com', avatarUrl: '' };
    const store = createMockStore({ user });
    render(
      <Provider store={store}>
        <ChakraProvider>
          <Navbar onMobileMenuToggle={onMobileMenuToggle} />
        </ChakraProvider>
      </Provider>
    );

    fireEvent.click(screen.getAllByRole('button')[1]);
    fireEvent.click(screen.getByText('Sign Out'));
    expect(mockLogout).toHaveBeenCalledTimes(1);
  });
});
