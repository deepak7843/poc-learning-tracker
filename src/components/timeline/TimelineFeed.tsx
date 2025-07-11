import React from 'react';
import { Badge, Divider } from '@chakra-ui/react';
import { PlayCircle, CheckCircle, Flag, Calendar } from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { TimelineEvent, Topic } from '../../types';

type ColorType = 'primary' | 'success' | 'warning' | 'neutral';

interface TimelineFeedProps {
  userId?: string;
}

const TimelineFeed: React.FC<TimelineFeedProps> = ({ userId }) => {
  const { events } = useSelector((state: RootState) => state.timeline);
  const { topics } = useSelector((state: RootState) => state.topics);
  
  // Filtering events for the specific user if userId is provided
  const filteredEvents = userId 
    ? events.filter(event => event.userId === userId)
    : events;
  
  const sortedEvents = [...filteredEvents].sort(
    (a, b) => new Date(b.eventDate).getTime() - new Date(a.eventDate).getTime()
  );

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

  const getEventColor = (eventType: string): ColorType => {
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
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }).format(date);
  };

  // here I am Grouping events by date using the date part only
  const groupedEvents = sortedEvents.reduce<Record<string, TimelineEvent[]>>((groups, event) => {
    const date = new Date(event.eventDate);
    const dateKey = date.toLocaleDateString('en-IN', {
      timeZone: 'Asia/Kolkata',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }
    groups[dateKey].push(event);
    return groups;
  }, {});

  return (
    <div>
      {!userId && (
        <>
          <h1 className="text-2xl mb-2 zf-font-prometo-md">Learning Timeline</h1>
          <p className="text-neutral-600 mb-6 zf-font-prometo-light">
            Track your progress and learning milestones over time
          </p>
        </>
      )}

      <div className="bg-white rounded-lg shadow-sm p-6">
        {Object.keys(groupedEvents).length > 0 ? (
          <div className="space-y-8">
            {Object.entries(groupedEvents).map(([date, dateEvents], groupIndex) => (
              <div key={date}>
                <div className="flex items-center mb-4">
                  <Calendar className="w-5 h-5 text-neutral-600 mr-2" />
                  <p className="text-neutral-800 zf-font-prometo-md">{date}</p>
                </div>
                
                <div className="space-y-6">
                  {dateEvents.map((event) => {
                    const EventIcon = getEventIcon(event.eventType);
                    const colorType = getEventColor(event.eventType);
                    const colorClasses = {
                      primary: 'bg-primary-100 text-primary-500 border-primary-500',
                      success: 'bg-success-100 text-success-500 border-success-500',
                      warning: 'bg-warning-100 text-warning-500 border-warning-500',
                      neutral: 'bg-neutral-100 text-neutral-500 border-neutral-500',
                    };
                    
                    return (
                      <div key={event.id} className="flex">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${colorClasses[colorType]}`}>
                          <EventIcon className="w-5 h-5" />
                        </div>
                        
                        <div className={`flex-1 ml-4 p-4 rounded-md border-l-4 ${colorClasses[colorType]} bg-${colorType}-50`}>
                          <div className="flex justify-between items-center mb-1">
                            <p className="zf-font-prometo-md">
                              {event.eventType === 'started' 
                                ? 'Started Learning' 
                                : event.eventType === 'completed'
                                  ? 'Completed Course'
                                  : 'Learning Milestone'}
                            </p>
                            <Badge className={`px-2 py-1 rounded-md text-xs zf-font-prometo-md ${colorClasses[colorType]}`}>
                              {event.eventType}
                            </Badge>
                          </div>
                          
                          <p className="mb-2 zf-font-prometo-md">
                            {getTopicTitle(event.topicId)}
                          </p>
                          
                          {event.details && (
                            <p className="text-sm text-neutral-700 mb-2 zf-font-prometo-light">
                              {event.details}
                            </p>
                          )}
                          
                          <p className="text-xs text-neutral-500 zf-font-prometo-light">
                            {formatDate(event.eventDate)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                {groupIndex < Object.keys(groupedEvents).length - 1 && (
                  <Divider className="mt-8 border-neutral-200" />
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-8 bg-neutral-50 rounded-md">
            <p className="text-lg mb-2 zf-font-prometo-md">
              No timeline events yet
            </p>
            <p className="text-neutral-600 text-center">
              <span className="zf-font-prometo-light">{userId ? 'This employee hasn\'t started any learning activities yet' : 'Start learning topics to build your timeline'}</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TimelineFeed;