import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { Learning, DashboardStats } from '../../types';
import { mockLearnings } from '../../mockData/learningsData';
import { mockTopics } from '../../mockData/topicsData';
import { RootState } from '../index';

interface LearningsState {
  learnings: Learning[];
  loading: boolean;
  error: string | null;
  dashboardStats: DashboardStats;
}

const initialDashboardStats: DashboardStats = {
  totalTopics: 0,
  completedTopics: 0,
  inProgressTopics: 0,
  notStartedTopics: 0,
  totalHoursSpent: 0,
  averageProgress: 0,
};

const initialState: LearningsState = {
  learnings: [],
  loading: false,
  error: null,
  dashboardStats: initialDashboardStats,
};

export const fetchUserLearnings = createAsyncThunk(
  'learnings/fetchUserLearnings',
  async (userId: string, { rejectWithValue }) => {
    try {
      // Simulating API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      const userLearnings = mockLearnings.filter(learning => learning.userId === userId);
      return userLearnings;
    } catch {
      return rejectWithValue('Failed to fetch user learnings');
    }
  }
);

export const updateLearningProgress = createAsyncThunk(
  'learnings/updateLearningProgress',
  async ({ learningId, progress }: { learningId: string; progress: number }, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const learning = state.learnings.learnings.find(l => l.id === learningId);
      
      if (!learning) {
        return rejectWithValue('Learning not found');
      }
      
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const now = new Date();
      const indianTime = now.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
      
      const updatedLearning: Learning = {
        ...learning,
        progress,
        status: progress === 100 ? 'completed' : progress > 0 ? 'in_progress' : 'not_started',
        lastAccessed: indianTime,
        completionDate: progress === 100 ? indianTime : undefined,
      };
      
      return updatedLearning;
    } catch {
      return rejectWithValue('Failed to update learning progress');
    }
  }
);

const learningsSlice = createSlice({
  name: 'learnings',
  initialState,
  reducers: {
    calculateDashboardStats(state) {
      if (state.learnings.length === 0) {
        state.dashboardStats = initialDashboardStats;
        return;
      }

      const totalTopics = state.learnings.length;
      const completedTopics = state.learnings.filter(l => l.status === 'completed').length;
      const inProgressTopics = state.learnings.filter(l => l.status === 'in_progress').length;
      const notStartedTopics = state.learnings.filter(l => l.status === 'not_started').length;

      const totalProgress = state.learnings.reduce((sum, learning) => sum + learning.progress, 0);
      const averageProgress = Math.round(totalProgress / totalTopics);

      // total hours spent based on each topic's estimated hours and progress
      const totalHoursSpent = state.learnings.reduce((total, learning) => {
        const topic = mockTopics.find(t => t.id === learning.topicId);
        if (topic) {
          // hours spent for this topic based on progress percentage(progress is in %)
          const hoursForTopic = Math.round(topic.estimatedHours *(
            ( learning.progress)/100
        ));
          return total + hoursForTopic;
        }
        return total;
      }, 0);

      state.dashboardStats = {
        totalTopics,
        completedTopics,
        inProgressTopics,
        notStartedTopics,
        totalHoursSpent,
        averageProgress,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserLearnings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserLearnings.fulfilled, (state, action: PayloadAction<Learning[]>) => {
        state.learnings = action.payload;
        state.loading = false;
      })
      .addCase(fetchUserLearnings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
//// updateLearningProgress 
      .addCase(updateLearningProgress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateLearningProgress.fulfilled, (state, action: PayloadAction<Learning>) => {
        const index = state.learnings.findIndex(l => l.id === action.payload.id);
        if (index !== -1) {
          state.learnings[index] = action.payload;
        }
        state.loading = false;
      })
      .addCase(updateLearningProgress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { calculateDashboardStats } = learningsSlice.actions;

export default learningsSlice.reducer;