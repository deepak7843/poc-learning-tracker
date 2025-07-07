import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import TopicsPage from '../pages/TopicsPage';

vi.mock('../components/topics/TopicsList', () => ({
  default: () => <div data-testid="topics-list-mock">TopicsList</div>,
}));

describe('TopicsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  function renderWithStore() {
    const store = configureStore({
      reducer: {
        topics: (state = { topics: [] }) => state,
        learnings: (state = { learnings: [] }) => state,
      },
    });
    render(
      <Provider store={store}>
        <TopicsPage />
      </Provider>
    );
  }

  it('should render the TopicsList component', () => {
    renderWithStore();
    expect(screen.getByTestId('topics-list-mock')).toBeInTheDocument();
  });
});
