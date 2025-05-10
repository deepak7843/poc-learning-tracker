import { TimelineEvent } from "../../types";

const colorClasses = {
    primary: 'bg-primary-100 text-primary-500',
    success: 'bg-success-100 text-success-500',
    warning: 'bg-warning-100 text-warning-500',
    neutral: 'bg-neutral-100 text-neutral-500',
  } as const;
  
  const eventTypeLabels: Record<string, string> = {
    started: 'Started learning',
    completed: 'Completed',
    milestone: 'Reached milestone in',
  };
  
  // Reusable component for rendering a single event
 export const RecentEventItem: React.FC<{ 
    event: TimelineEvent; 
    getEventIcon: (eventType: string) => React.ElementType; 
    getEventColor: (eventType: string) => string; 
    getTopicTitle: (topicId: string) => string; 
    formatDate: (dateString: string) => string; 
  }> = ({ event, getEventIcon, getEventColor, getTopicTitle, formatDate }) => {
    const EventIcon = getEventIcon(event.eventType);
    const colorType = getEventColor(event.eventType) as keyof typeof colorClasses;
  
    return (
      <div>
        <div className="flex gap-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${colorClasses[colorType]}`}>
            <EventIcon className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <p className="font-medium">
              {eventTypeLabels[event.eventType] || 'Unknown event'}{' '}
              <span className="font-semibold">{getTopicTitle(event.topicId)}</span>
            </p>
            <div className="flex justify-between items-center mt-1">
              <p className="text-sm text-neutral-600">{event.details}</p>
              <span className="text-xs bg-neutral-100 text-neutral-600 px-2 py-1 rounded-full">
                {formatDate(event.eventDate)}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  };