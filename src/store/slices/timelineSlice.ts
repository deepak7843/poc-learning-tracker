import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { TimelineEvent } from '../../types';
import { mockTimelineEvents } from '../../mockData/timelineData';

interface TimelineState {
  events: TimelineEvent[];
  loading: boolean;
  error: string | null;
}

const initialState: TimelineState = {
  events: [],
  loading: false,
  error: null,
};

const getIndianTime = () => {
  return new Date().toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
  });
};

// Simulated API call
export const fetchUserTimeline = createAsyncThunk(
  'timeline/fetchUserTimeline',
  async (userId: string, { rejectWithValue }) => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      return mockTimelineEvents.filter(event => event.userId === userId);
    } catch (error) {
      return rejectWithValue('Failed to fetch timeline events');
    }
  }
);

// Add new timeline event
export const addTimelineEvent = createAsyncThunk(
  'timeline/addTimelineEvent',
  async (event: Omit<TimelineEvent, 'id'>, { rejectWithValue }) => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newEvent: TimelineEvent = {
        ...event,
        id: `event-${Date.now()}`,
        eventDate: getIndianTime(),
      };
      
      return newEvent;
    } catch (error) {
      return rejectWithValue('Failed to add timeline event');
    }
  }
);

const timelineSlice = createSlice({
  name: 'timeline',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserTimeline.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserTimeline.fulfilled, (state, action: PayloadAction<TimelineEvent[]>) => {
        state.events = action.payload;
        state.loading = false;
      })
      .addCase(fetchUserTimeline.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(addTimelineEvent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addTimelineEvent.fulfilled, (state, action: PayloadAction<TimelineEvent>) => {
        state.events.push(action.payload);
        state.loading = false;
      })
      .addCase(addTimelineEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default timelineSlice.reducer;