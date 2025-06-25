import React from 'react';
import { PlayCircle, Clock, CheckCircle } from 'lucide-react';
import { TopicWithProgress } from '../../types';

interface TopicCardProps {
  topic: TopicWithProgress;
  onSelect: (topicId: string) => void;
}

const TopicCard: React.FC<TopicCardProps> = ({ topic, onSelect }) => {
  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'completed': return 'success';
      case 'in_progress': return 'primary';
      default: return 'neutral';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return CheckCircle;
      case 'in_progress': return Clock;
      default: return PlayCircle;
    }
  };

  const StatusIcon = getStatusIcon(topic.status);
  const statusColor = getStatusColor(topic.status);

  const difficultyColors = {
    beginner: 'bg-green-100 text-green-700',
    intermediate: 'bg-blue-100 text-blue-700',
    advanced: 'bg-purple-100 text-purple-700',
  };

  const progressColors = {
    completed: 'bg-success-500',
    in_progress: 'bg-primary-500',
    not_started: 'bg-neutral-300',
  };

  return (
    <div className="border border-neutral-200 rounded-lg overflow-hidden bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-primary-300">
      <div className="flex flex-col md:flex-row h-full">
        <div 
          className="w-full md:w-1/3 h-48 md:h-auto bg-neutral-100 bg-cover bg-center"
          style={{ backgroundImage: topic.imageUrl ? `url(${topic.imageUrl})` : undefined }}
        />
        
        <div className="flex-1 p-6">
          <div className="flex justify-between items-start mb-3">
            <span className={`px-2 py-1 rounded-md text-xs zf-font-prometo-md ${difficultyColors[topic.difficulty]}`}>
              {topic.difficulty}
            </span>
            <span className="px-2 py-1 bg-neutral-100 text-neutral-700 rounded-md text-xs zf-font-prometo-light">
              {topic.estimatedHours} hours
            </span>
          </div>
          
          <h3 className="text-xl mb-2 zf-font-prometo-md">{topic.title}</h3>
          
          <p className="text-neutral-600 text-sm mb-4 line-clamp-2 zf-font-prometo-light">
            {topic.description}
          </p>
          
          <div className="flex items-center mb-3">
            <StatusIcon className={`w-5 h-5 mr-2 text-${statusColor}-500`} />
            <span className={`text-sm text-${statusColor}-500 zf-font-prometo-md`}>
              {topic.status === 'completed'
                ? 'Completed'
                : topic.status === 'in_progress'
                  ? `${topic.progress}% Complete`
                  : 'Not Started'}
            </span>
          </div>
          
          <div className="h-2 bg-neutral-100 rounded-full mb-4">
            <div
              className={`h-full rounded-full ${progressColors[topic.status]}`}
              style={{ width: `${topic.progress}%` }}
            />
          </div>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {topic.tags.map((tag) => (
              <span
                key={tag}
                className="bg-neutral-100 text-neutral-700 text-xs px-2 py-1 rounded-full zf-font-prometo-light"
              >
                {tag}
              </span>
            ))}
          </div>
          
          <button
            onClick={() => onSelect(topic.id)}
            className="w-full px-4 py-2 border border-primary-500 text-primary-500 rounded-md hover:bg-primary-50 transition-colors zf-font-prometo-md"
          >
            {topic.status === 'not_started'
              ? 'Start Learning'
              : topic.status === 'in_progress'
                ? 'Continue Learning'
                : 'Review Content'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TopicCard;