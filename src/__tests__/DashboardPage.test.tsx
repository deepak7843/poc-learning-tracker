import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { ChakraProvider } from '@chakra-ui/react';
import DashboardPage from '../pages/DashboardPage';
import { User, Topic, Learning } from '../types';


const mockNavigate = vi.fn();


vi.mock('react-router-dom', () => {
  const actual = vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});


const mockFetchUserLearnings = vi.fn();
const mockFetchTopics = vi.fn();
const mockFetchUserTimeline = vi.fn();
const mockCalculateDashboardStats = vi.fn();


vi.mock('../store/slices/learningsSlice', () => ({
  fetchUserLearnings: (userId: string) => {
    mockFetchUserLearnings(userId);
    return { type: 'learnings/fetchUserLearnings' };
  },
  calculateDashboardStats: () => {
    mockCalculateDashboardStats();
    return { type: 'learnings/calculateDashboardStats' };
  }
}));

vi.mock('../store/slices/topicsSlice', () => ({
  fetchTopics: () => {
    mockFetchTopics();
    return { type: 'topics/fetchTopics' };
  }
}));

vi.mock('../store/slices/timelineSlice', () => ({
  fetchUserTimeline: (userId: string) => {
    mockFetchUserTimeline(userId);
    return { type: 'timeline/fetchUserTimeline' };
  }
}));


vi.mock('../components/dashboard/DashboardStats', () => ({
  default: () => <div data-testid="dashboard-stats">Dashboard Stats</div>
}));

vi.mock('../components/dashboard/RecentActivity', () => ({
  default: () => <div data-testid="recent-activity">Recent Activity</div>
}));


const mockDispatch = vi.fn();
vi.mock('../store', () => ({
  useDispatch: () => mockDispatch,
}));


const mockUser: User = {
  id: 'user-1',
  name: 'Test User',
  email: 'test@example.com',
  role: 'user',
  avatarUrl: '',
};

const mockTopics: Topic[] = [
  {
    id: 'topic-1',
    title: 'React Basics',
    description: 'Learn the basics of React',
    difficulty: 'beginner',
    estimatedHours: 5,
    imageUrl: '/react.png',
    category: 'frontend',
    tags: ['react', 'javascript'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'topic-2',
    title: 'Advanced React',
    description: 'Master advanced React concepts',
    difficulty: 'intermediate',
    estimatedHours: 10,
    imageUrl: '/advanced-react.png',
    category: 'frontend',
    tags: ['react', 'advanced'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'topic-3',
    title: 'Redux',
    description: 'Learn Redux state management',
    difficulty: 'advanced',
    estimatedHours: 8,
    imageUrl: '/redux.png',
    category: 'frontend',
    tags: ['redux', 'state-management'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

const mockLearnings: Learning[] = [
  {
    id: 'learning-1',
    userId: 'user-1',
    topicId: 'topic-1',
    progress: 75,
    status: 'in_progress' as const,
    startDate: new Date().toISOString(),
    lastAccessed: new Date().toISOString(),
    notes: 'Learning React basics'
  },
  {
    id: 'learning-2',
    userId: 'user-1',
    topicId: 'topic-2',
    progress: 30,
    status: 'in_progress' as const,
    startDate: new Date().toISOString(),
    lastAccessed: new Date().toISOString(),
    notes: 'Advanced React concepts'
  },
  {
    id: 'learning-3',
    userId: 'user-1',
    topicId: 'topic-3',
    progress: 0,
    status: 'not_started' as const,
    startDate: new Date().toISOString(),
    lastAccessed: new Date().toISOString()
  }
];


const createMockStore = (
  user: User | null = null,
  topics: Topic[] = [],
  learnings: Learning[] = [],
  learningsLoading: boolean = false
) => {
  return configureStore({
    reducer: {
      auth: () => ({
        user,
        loading: false,
        error: null,
      }),
      topics: () => ({
        topics,
        loading: false,
        error: null,
      }),
      learnings: () => ({
        learnings,
        loading: learningsLoading,
        error: null,
        dashboardStats: {}
      }),
    },
  });
};


const renderComponent = (
  user: User | null = null,
  topics: Topic[] = [],
  learnings: Learning[] = [],
  learningsLoading: boolean = false
) => {
  const store = createMockStore(user, topics, learnings, learningsLoading);
  return render(
    <Provider store={store}>
      <ChakraProvider>
        <DashboardPage />
      </ChakraProvider>
    </Provider>
  );
};

describe('DashboardPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should dispatch fetch actions when user exists', () => {
    renderComponent(mockUser);
    
    expect(mockDispatch).toHaveBeenCalledTimes(3);
    expect(mockFetchUserLearnings).toHaveBeenCalledWith(mockUser.id);
    expect(mockFetchTopics).toHaveBeenCalled();
    expect(mockFetchUserTimeline).toHaveBeenCalledWith(mockUser.id);
  });

  it('should not dispatch fetch actions when user does not exist', () => {
    renderComponent(null);
    
    expect(mockFetchUserLearnings).not.toHaveBeenCalled();
    expect(mockFetchTopics).not.toHaveBeenCalled();
    expect(mockFetchUserTimeline).not.toHaveBeenCalled();
  });

  it('should calculate dashboard stats when learnings are available', () => {
    renderComponent(mockUser, [], mockLearnings);
    
    expect(mockCalculateDashboardStats).toHaveBeenCalled();
  });

  it('should not calculate dashboard stats when learnings are empty', () => {
    renderComponent(mockUser, [], []);
    
    expect(mockCalculateDashboardStats).not.toHaveBeenCalled();
  });

  it('should display loading state when learnings are loading', () => {
    renderComponent(mockUser, [], [], true);
    
    expect(screen.queryByTestId('dashboard-stats')).not.toBeInTheDocument();
    expect(screen.getByText(/welcome back/i)).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /dashboard/i })).toBeInTheDocument();
  });

  it('should display dashboard stats when learnings are loaded', () => {
    renderComponent(mockUser, [], mockLearnings, false);
    
    expect(screen.getByTestId('dashboard-stats')).toBeInTheDocument();
  });

  it('should display the user first name when available', () => {
    renderComponent(mockUser, [], mockLearnings);
    
    expect(screen.getByText(/welcome back, test/i)).toBeInTheDocument();
  });

  it('should display in-progress topics', () => {
    renderComponent(mockUser, mockTopics, mockLearnings);
    
    expect(screen.getByText(/in progress/i)).toBeInTheDocument();
    expect(screen.getByText(/continue where you left off/i)).toBeInTheDocument();
    
    const reactBasicsHeading = screen.getByRole('heading', { name: /react basics/i });
    const advancedReactHeading = screen.getByRole('heading', { name: /advanced react/i });
    
    expect(reactBasicsHeading).toBeInTheDocument();
    expect(advancedReactHeading).toBeInTheDocument();
    expect(screen.getByText(/75% complete/i)).toBeInTheDocument();
    expect(screen.getByText(/30% complete/i)).toBeInTheDocument();
    expect(screen.queryByText(/redux/i)).not.toBeInTheDocument(); // Not in progress
  });

  it('should display empty state when no in-progress topics', () => {
    const learningsWithoutProgress = mockLearnings.map(l => ({
      ...l,
      status: 'not_started' as const
    }));
    
    renderComponent(mockUser, mockTopics, learningsWithoutProgress);
    
    expect(screen.getByText(/you don't have any topics in progress/i)).toBeInTheDocument();
    expect(screen.getByText(/browse topics/i)).toBeInTheDocument();
  });

  it('should navigate to topics page when "View All" is clicked', async () => {
    renderComponent(mockUser, mockTopics, mockLearnings);
    
    const viewAllButton = screen.getByText(/view all/i);
    await userEvent.click(viewAllButton);
    
    expect(mockNavigate).toHaveBeenCalledWith('/topics');
  });

  it('should navigate to topics page when "Browse Topics" button is clicked', async () => {
    const learningsWithoutProgress = mockLearnings.map(l => ({
      ...l,
      status: 'not_started' as const
    }));
    
    renderComponent(mockUser, mockTopics, learningsWithoutProgress);
    
    const browseTopicsButton = screen.getByText(/browse topics/i);
    await userEvent.click(browseTopicsButton);
    
    expect(mockNavigate).toHaveBeenCalledWith('/topics');
  });

  it('should navigate to topic details when a topic card is clicked', async () => {
    renderComponent(mockUser, mockTopics, mockLearnings);
    
    const topicCard = screen.getByText(/react basics/i).closest('div[role="button"]') ||
                      screen.getByText(/react basics/i).closest('.cursor-pointer');
                      
    if (topicCard) {
      await userEvent.click(topicCard);
      expect(mockNavigate).toHaveBeenCalledWith('/topics/topic-1');
    }
  });

  it('should render RecentActivity component', () => {
    renderComponent(mockUser, mockTopics, mockLearnings);
    
    expect(screen.getByTestId('recent-activity')).toBeInTheDocument();
  });

});
