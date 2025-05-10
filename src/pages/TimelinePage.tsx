import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from '../store';
import { RootState } from '../store';
import { fetchUserTimeline } from '../store/slices/timelineSlice';
import { fetchTopics } from '../store/slices/topicsSlice';
import TimelineFeed from '../components/timeline/TimelineFeed';

const TimelinePage: React.FC = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  
  useEffect(() => {
    if (user) {
      dispatch(fetchUserTimeline(user.id));
      dispatch(fetchTopics());
    }
  }, [dispatch, user]);
  
  return <TimelineFeed />;
};

export default TimelinePage;