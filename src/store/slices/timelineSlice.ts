import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { TimelineEvent } from '../../types';
import { mockLearnings } from '../../mockData/learningsData';
import { mockTopics } from '../../mockData/topicsData';

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

export const fetchUserTimeline = createAsyncThunk(
  'timeline/fetchUserTimeline',
  async (userId: string, { rejectWithValue }) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const userLearnings = mockLearnings.filter(learning => learning.userId === userId);
      
      // Converting learnings to timeline events
      const timelineEvents : TimelineEvent[] = [];

      for (const learning of userLearnings) {
        const events: TimelineEvent[] = [];
        const topic = mockTopics.find(t => t.id === learning.topicId);
      
        if (learning.status === 'in_progress' && learning.progress >= 50) {
          events.push({
            id: `milestone-${learning.id}`,
            userId: learning.userId,
            topicId: learning.topicId,
            eventType: 'milestone',
            eventDate: learning.lastAccessed,
            details: `Reached ${learning.progress}% completion in ${topic ? topic.title : 'topic'}`,
          });
        }
      
        if (learning.status === 'completed' && learning.completionDate) {
          events.push({
            id: `complete-${learning.id}`,
            userId: learning.userId,
            topicId: learning.topicId,
            eventType: 'completed',
            eventDate: learning.completionDate,
            details: `Completed ${topic ? topic.title : 'topic'}` + (learning.notes ? ` - ${learning.notes}` : ''),
          });
        }
      
        timelineEvents.push(...events);
      }
      return timelineEvents.sort((a, b) => 
        new Date(b.eventDate).getTime() - new Date(a.eventDate).getTime()
      );
    } catch {
      return rejectWithValue('Failed to fetch timeline events');
    }
  }
);

export const addTimelineEvent = createAsyncThunk(
  'timeline/addTimelineEvent',
  async (event: Omit<TimelineEvent, 'id'>, { rejectWithValue }) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newEvent: TimelineEvent = {
        ...event,
        id: `event-${Date.now()}`,
        eventDate: getIndianTime(),
      };
      
      return newEvent;
    } catch {
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