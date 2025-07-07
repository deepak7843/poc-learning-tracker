import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { Provider } from 'react-redux';
import { ChakraProvider } from '@chakra-ui/react';
import { configureStore } from '@reduxjs/toolkit';
import ReportingEmployeesPage from '../pages/ReportingEmployeesPage';
import { mockUsers } from '../mockData/userData';
import { User } from '../types';


const mockNavigate = vi.fn();
vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));


const createMockStore = (currentUser: User | null) => {
  return configureStore({
    reducer: {
      auth: (state = { user: currentUser, loading: false, error: null }) => state,
    },
  });
};


const renderWithProviders = (component: React.ReactElement, user: User | null) => {
  const store = createMockStore(user);
  return render(
    <Provider store={store}>
      <ChakraProvider>
        {component}
      </ChakraProvider>
    </Provider>
  );
};

describe('ReportingEmployeesPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  
  const managerUser = mockUsers.find(u => u.role === 'manager');
  if (!managerUser) {
    throw new Error('Test setup error: No manager user found in test data');
  }
  
  const nonManagerUser = mockUsers.find(u => u.role === 'user');
  if (!nonManagerUser) {
    throw new Error('Test setup error: No non-manager user found in test data');
  }

  it('should display reporting employees for a manager', () => {
    renderWithProviders(<ReportingEmployeesPage />, managerUser);

    const reportingEmployee = mockUsers.find(u => u.managerId === managerUser.id);
    if (!reportingEmployee) {
      throw new Error('Test setup error: No reporting employee found for the manager');
    }

    expect(screen.getByText('Reporting Employees')).toBeInTheDocument();
    expect(screen.getByText(reportingEmployee.name)).toBeInTheDocument();
    expect(screen.queryByText('No reporting employees found')).not.toBeInTheDocument();
  });

  it('should display message when user has no reporting employees', () => {
    renderWithProviders(<ReportingEmployeesPage />, nonManagerUser);

    expect(screen.getByText('No reporting employees found')).toBeInTheDocument();
  });

  it('should navigate to employee timeline on button click', async () => {
    renderWithProviders(<ReportingEmployeesPage />, managerUser);

    const reportingEmployee = mockUsers.find(u => u.managerId === managerUser.id);
    const timelineButtons = await screen.findAllByRole('button', { name: /timeline/i });
    
    await userEvent.click(timelineButtons[0]);

    expect(mockNavigate).toHaveBeenCalledWith(`/employee/${reportingEmployee!.id}/timeline`);
  });

  it('should display message when no user is logged in', () => {
    renderWithProviders(<ReportingEmployeesPage />, null);

    expect(screen.getByText('No reporting employees found')).toBeInTheDocument();
  });
});
