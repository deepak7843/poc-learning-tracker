import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import TimelinePage from '../pages/TimelinePage';

vi.mock('../components/timeline/TimelineFeed', () => ({
  default: () => <div data-testid="timeline-feed-mock">TimelineFeed</div>,
}));

const mockFetchUserTimeline = vi.fn();
const mockFetchTopics = vi.fn();
vi.mock('../store/slices/timelineSlice', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../store/slices/timelineSlice')>();
  return {
    ...actual,
    fetchUserTimeline: (...args: any[]) => mockFetchUserTimeline(...args),
  };
});

vi.mock('../store/slices/topicsSlice', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../store/slices/topicsSlice')>();
  return {
    ...actual,
    fetchTopics: (...args: any[]) => mockFetchTopics(...args),
  };
});

const mockDispatch = vi.fn();
vi.mock('../store', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../store')>();
  return {
    ...actual,
    useDispatch: () => mockDispatch,
  };
});

describe('TimelinePage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  function renderWithStore(user: any) {
    const store = configureStore({
      reducer: {
        auth: (state = { user }) => state,
      },
    });
    render(
      <Provider store={store}>
        <TimelinePage />
      </Provider>
    );
  }

  it('dispatches fetchUserTimeline and fetchTopics if user exists', () => {
    const user = { id: 'user-123', name: 'Test User' };
    renderWithStore(user);
    expect(mockDispatch).toHaveBeenCalledTimes(2);
    expect(mockFetchUserTimeline).toHaveBeenCalledWith('user-123');
    expect(mockFetchTopics).toHaveBeenCalled();
    expect(screen.getByTestId('timeline-feed-mock')).toBeInTheDocument();
  });

  it('does not dispatch actions if user does not exist', () => {
    renderWithStore(null);
    expect(mockDispatch).not.toHaveBeenCalled();
    expect(mockFetchUserTimeline).not.toHaveBeenCalled();
    expect(mockFetchTopics).not.toHaveBeenCalled();
    expect(screen.getByTestId('timeline-feed-mock')).toBeInTheDocument();
  });
});
