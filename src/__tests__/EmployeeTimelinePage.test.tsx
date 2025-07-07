import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { ChakraProvider } from '@chakra-ui/react';
import EmployeeTimelinePage from '../pages/EmployeeTimelinePage';
import { mockUsers } from '../mockData/userData';
import { User } from '../types';


const mockNavigate = vi.fn();


vi.mock('react-router-dom', () => {
  const actual = vi.importActual('react-router-dom');
  return {
    ...actual,
    useParams: () => ({
      employeeId: '123-test-id'
    }),
    useNavigate: () => mockNavigate,
  };
});


const mockFetchUserTimeline = vi.fn();
vi.mock('../store/slices/timelineSlice', () => ({
  fetchUserTimeline: (id: string) => mockFetchUserTimeline(id),
}));


const mockDispatch = vi.fn();
vi.mock('../store', () => ({
  useDispatch: () => mockDispatch,
  RootState: {}
}));


vi.mock('../components/timeline/TimelineFeed', () => ({
  default: ({ userId }: { userId: string }) => (
    <div data-testid="timeline-feed">TimelineFeed for {userId}</div>
  ),
}));


const createMockStore = (user: User | null) => {
  return configureStore({
    reducer: {
      auth: () => ({
        user,
        loading: false,
        error: null,
      }),
    },
  });
};

describe('EmployeeTimelinePage', () => {
  
  const managerUser = mockUsers.find(user => user.role === 'manager') || null;
  
  const employeeUser = mockUsers.find(user => user.role !== 'manager') || null;
  let employeeOfManager: User;
  
  beforeEach(() => {
    vi.clearAllMocks();
    
    
    const foundEmployee = mockUsers.find(user => 
      user.managerId === managerUser?.id && 
      user.id === '123-test-id'
    );
    
    
    if (!foundEmployee) {
      employeeOfManager = {
        ...mockUsers[0],
        id: '123-test-id',
        managerId: managerUser?.id,
        name: 'Test Employee',
        email: 'employee@test.com',
        department: 'Engineering',
        role: 'user',
        avatarUrl: '',
      };
      
      
      vi.spyOn(mockUsers, 'find').mockImplementation((callback: any) => {
        if (callback(employeeOfManager)) {
          return employeeOfManager;
        }
        return undefined;
      });
    } else {
      employeeOfManager = foundEmployee;
    }
  });

  it('should show loading state when no employee is found', () => {
    
    vi.spyOn(mockUsers, 'find').mockReturnValue(undefined as any);
    
    const store = createMockStore(managerUser);
    render(
      <Provider store={store}>
        <ChakraProvider>
          <EmployeeTimelinePage />
        </ChakraProvider>
      </Provider>
    );

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('should display employee details and fetch timeline for authorized manager', () => {
    const store = createMockStore(managerUser);
    render(
      <Provider store={store}>
        <ChakraProvider>
          <EmployeeTimelinePage />
        </ChakraProvider>
      </Provider>
    );

    
    expect(screen.getByText(employeeOfManager.name)).toBeInTheDocument();
    expect(screen.getByText(employeeOfManager.email)).toBeInTheDocument();
    
    if (employeeOfManager.department) {
      expect(screen.getByText(employeeOfManager.department, { exact: false })).toBeInTheDocument();
    }
    
    
    expect(mockDispatch).toHaveBeenCalled();
    expect(mockFetchUserTimeline).toHaveBeenCalledWith('123-test-id');
    
    
    expect(screen.getByTestId('timeline-feed')).toBeInTheDocument();
  });

  it('should redirect if user is not a manager', () => {
    const store = createMockStore(employeeUser);
    render(
      <Provider store={store}>
        <ChakraProvider>
          <EmployeeTimelinePage />
        </ChakraProvider>
      </Provider>
    );

    
    expect(screen.getByText('Loading...')).toBeInTheDocument();
    expect(mockDispatch).not.toHaveBeenCalled();
  });

  it('should navigate back when the back button is clicked', async () => {
    const store = createMockStore(managerUser);
    render(
      <Provider store={store}>
        <ChakraProvider>
          <EmployeeTimelinePage />
        </ChakraProvider>
      </Provider>
    );

    
    expect(screen.getByText(employeeOfManager.name)).toBeInTheDocument();
    
    
    const backButton = screen.getByRole('button', { name: /back to reporting employees/i });
    await userEvent.click(backButton);

    
    expect(mockNavigate).toHaveBeenCalledWith('/reporting-employees');
  });
});

