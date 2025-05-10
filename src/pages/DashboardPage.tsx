import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from '../store';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../store';
import { calculateDashboardStats, fetchUserLearnings } from '../store/slices/learningsSlice';
import { fetchTopics } from '../store/slices/topicsSlice';
import { fetchUserTimeline } from '../store/slices/timelineSlice';
import DashboardStats from '../components/dashboard/DashboardStats';
import RecentActivity from '../components/dashboard/RecentActivity';
import { TopicWithProgress } from '../types';

const DashboardPage: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  const { topics } = useSelector((state: RootState) => state.topics);
  const { learnings, loading: learningsLoading } = useSelector((state: RootState) => state.learnings);
  
  useEffect(() => {
    if (user) {
      dispatch(fetchUserLearnings(user.id));
      dispatch(fetchTopics());
      dispatch(fetchUserTimeline(user.id));
    }
  }, [dispatch, user]);
  
  useEffect(() => {
    if (learnings.length > 0) {
      dispatch(calculateDashboardStats());
    }
  }, [dispatch, learnings]);

  const handleTopicSelect = (topicId: string) => {
    navigate(`/topics/${topicId}`);
  };

  const inProgressTopics: TopicWithProgress[] = topics
    .reduce<TopicWithProgress[]>((acc, topic) => {
      const learning = learnings.find((l) => l.topicId === topic.id);
      if (learning && learning.status === 'in_progress') {
        acc.push({
          ...topic,
          progress: learning.progress,
          status: learning.status,
        });
      }
      return acc;
    }, [])
    .sort((a, b) => b.progress - a.progress)
    .slice(0, 3);


  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">Dashboard</h1>
      <p className="text-neutral-600 mb-6">
        Welcome back{user?.name ? `, ${user.name.split(' ')[0]}` : ''}! Here's your learning progress.
      </p>

      {learningsLoading ? (
        <div className="h-24 bg-white rounded-lg animate-pulse mb-6" />
      ) : (
        <DashboardStats />
      )}

      <div className="grid grid-cols-1  gap-6 mt-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-lg font-semibold">In Progress</h2>
                <p className="text-neutral-600 mt-1">
                  Continue where you left off
                </p>
              </div>
              {inProgressTopics.length > 0 && (
                <button
                  onClick={() => navigate('/topics')}
                  className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                >
                  View All
                </button>
              )}
            </div>
            
            {inProgressTopics.length > 0 ? (
              <div className="grid gap-4">
                {inProgressTopics.map((topic) => (
                  <div
                    key={topic.id}
                    className="border border-neutral-200 rounded-lg p-4 hover:border-primary-300 transition-colors cursor-pointer"
                    onClick={() => handleTopicSelect(topic.id)}
                  >
                    <div className="flex items-start gap-4">
                      <div 
                        className="w-28 h-32 rounded-lg bg-neutral-100 bg-cover bg-center flex-shrink-0"
                        style={{ backgroundImage: topic.imageUrl ? `url(${topic.imageUrl})` : undefined }}
                      />
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <span className={`px-2 py-1 rounded-md text-xs font-semibold ${
                            topic.difficulty === 'beginner' ? 'bg-green-100 text-green-700' :
                            topic.difficulty === 'intermediate' ? 'bg-blue-100 text-blue-700' :
                            'bg-purple-100 text-purple-700'
                          }`}>
                            {topic.difficulty}
                          </span>
                          <span className="text-xs text-neutral-600">
                            {topic.estimatedHours} hours
                          </span>
                        </div>
                        
                        <h3 className="font-semibold text-lg mb-1 truncate">
                          {topic.title}
                        </h3>
                        
                        <p className="text-sm text-neutral-600 mb-3 line-clamp-2">
                          {topic.description}
                        </p>
                        
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="font-medium text-primary-600">
                              {topic.progress}% Complete
                            </span>
                            <span className="text-neutral-600">
                              {Math.round(topic.estimatedHours * (1 - topic.progress / 100))} hours remaining
                            </span>
                          </div>
                          <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary-500 rounded-full transition-all duration-300"
                              style={{ width: `${topic.progress}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-neutral-600">
                  You don't have any topics in progress.
                </p>
                <button
                  onClick={() => navigate('/topics')}
                  className="mt-4 px-4 py-2 bg-primary-50 text-primary-600 rounded-lg text-sm font-medium hover:bg-primary-100 transition-colors"
                >
                  Browse Topics
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="mt-8">
        <RecentActivity />
      </div>
    </div>
  );
};

export default DashboardPage;