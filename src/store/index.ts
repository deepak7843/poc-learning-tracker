import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import topicsReducer from './slices/topicsSlice';
import learningsReducer from './slices/learningsSlice';
import timelineReducer from './slices/timelineSlice';

import { useDispatch as useReduxDispatch} from 'react-redux';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    topics: topicsReducer,
    learnings: learningsReducer,
    timeline: timelineReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;


// Defined typed hooks for useDispatch
export const useDispatch = () => useReduxDispatch<AppDispatch>();
