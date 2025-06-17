import React, { useMemo } from 'react';
import { PlayCircle, CheckCircle, Flag } from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { TimelineEvent, Topic } from '../../types';
import { RecentEventItem } from './RecentEventItem';



const RecentActivity: React.FC = () => {
  const { events } = useSelector((state: RootState) => state.timeline);
  const { topics } = useSelector((state: RootState) => state.topics);

  const recentEvents = useMemo(() => {
    return [...events]
      .sort((a, b) => new Date(b.eventDate).getTime() - new Date(a.eventDate).getTime())
      .slice(0, 5);
  }, [events]);

  const getTopicTitle = (topicId: string): string => {
    const topic = topics.find((t: Topic) => t.id === topicId);
    return topic ? topic.title : 'Unknown Topic';
  };

  const getEventIcon = (eventType: string) => {
    switch (eventType) {
      case 'started': return PlayCircle;
      case 'completed': return CheckCircle;
      case 'milestone': return Flag;
      default: return PlayCircle;
    }
  };

  const getEventColor = (eventType: string): string => {
    switch (eventType) {
      case 'started': return 'primary';
      case 'completed': return 'success';
      case 'milestone': return 'warning';
      default: return 'neutral';
    }
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-IN', {
      timeZone: 'Asia/Kolkata',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }).format(date);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm h-full">
      <h2 className="text-lg mb-4 zf-font-prometo-md">Recent Activity</h2>
      <p className="text-neutral-600 mb-6 zf-font-prometo-light">
        Your latest learning activities and milestones
      </p>

      {recentEvents.length > 0 ? (
        <div className="space-y-4">
          {recentEvents.map((event: TimelineEvent, index: number) => (
            <div key={event.id}>
              <RecentEventItem
                event={event}
                getEventIcon={getEventIcon}
                getEventColor={getEventColor}
                getTopicTitle={getTopicTitle}
                formatDate={formatDate}
              />
              {index < recentEvents.length - 1 && (
                <div className="border-b border-neutral-200 mt-4" />
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-6 bg-neutral-50 rounded-md h-[200px]">
          <p className="text-neutral-600 text-center zf-font-prometo-light">
            No recent activity to display
          </p>
        </div>
      )}
    </div>
  );
};

export default RecentActivity;