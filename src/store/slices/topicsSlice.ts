import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { Topic } from '../../types';
import { mockTopics } from '../../mockData/topicsData';

interface TopicsState {
  topics: Topic[];
  loading: boolean;
  error: string | null;
  searchTerm: string;
  filteredTopics: Topic[];
}

const initialState: TopicsState = {
  topics: [],
  loading: false,
  error: null,
  searchTerm: '',
  filteredTopics: [],
};

// Simulated API call
export const fetchTopics = createAsyncThunk(
  'topics/fetchTopics',
  async (_, { rejectWithValue }) => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      return mockTopics;
    } catch (error) {
      return rejectWithValue('Failed to fetch topics');
    }
  }
);



export const fetchLearnings=createAsyncThunk(
  'learnings/fetchLearnings',

  async(_, {rejectWithValue})=>{
    try{
await new Promise(resolve=> setTimeout(resolve, 400))
return mockData;
    }
    catch{
       return rejectWithValue('there is no Data')
    }
  }
);



const topicsSlice = createSlice({
  name: 'topics',
  initialState,
  reducers: {
    setSearchTerm(state, action: PayloadAction<string>) {
      state.searchTerm = action.payload;
      state.filteredTopics = state.topics.filter(
        topic => 
          topic.title.toLowerCase().includes(action.payload.toLowerCase()) ||
          topic.description.toLowerCase().includes(action.payload.toLowerCase()) ||
          topic.tags.some(tag => tag.toLowerCase().includes(action.payload.toLowerCase()))
      );
    },
    clearSearch(state) {
      state.searchTerm = '';
      state.filteredTopics = state.topics;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTopics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTopics.fulfilled, (state, action: PayloadAction<Topic[]>) => {
        state.topics = action.payload;
        state.filteredTopics = action.payload;
        state.loading = false;
      })
      .addCase(fetchTopics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setSearchTerm, clearSearch } = topicsSlice.actions;

export default topicsSlice.reducer;