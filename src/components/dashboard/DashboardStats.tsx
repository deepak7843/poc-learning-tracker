import React from 'react';
import { BookOpen, CheckCircle, Clock, XCircle, BarChart } from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

const DashboardStats: React.FC = () => {
  const { dashboardStats } = useSelector((state: RootState) => state.learnings);
  
  const stats: {
    label: string;
    value: number;
    icon: React.FC<{ className?: string }>;
    color: 'primary' | 'success' | 'warning' | 'neutral' | 'accent';
    helpText: string;
  }[] = [
    {
      label: 'Total Topics',
      value: dashboardStats.totalTopics,
      icon: BookOpen,
      color: 'primary',
      helpText: 'Topics assigned to you',
    },
    {
      label: 'Completed',
      value: dashboardStats.completedTopics,
      icon: CheckCircle,
      color: 'success',
      helpText: `${Math.round((dashboardStats.completedTopics / dashboardStats.totalTopics) * 100) || 0}% completion rate`,
    },
    {
      label: 'In Progress',
      value: dashboardStats.inProgressTopics,
      icon: Clock,
      color: 'warning',
      helpText: 'Currently learning',
    },
    {
      label: 'Not Started',
      value: dashboardStats.notStartedTopics,
      icon: XCircle,
      color: 'neutral',
      helpText: 'Yet to begin',
    },
    {
      label: 'Hours Spent',
      value: dashboardStats.totalHoursSpent,
      icon: BarChart,
      color: 'accent',
      helpText: 'Total learning time',
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {stats.map((stat) => {
        const Icon = stat.icon;
        const colorClasses = {
          primary: 'bg-primary-500/10 text-primary-500',
          success: 'bg-success-500/10 text-success-500',
          warning: 'bg-warning-500/10 text-warning-500',
          neutral: 'bg-neutral-400/10 text-neutral-400',
          accent: 'bg-accent-500/10 text-accent-500',
        };

        return (
          <div
            key={stat.label}
            className="bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="text-neutral-600 zf-font-prometo-light">{stat.label}</p>
                <p className="text-3xl mt-1 zf-font-prometo-md">{stat.value}</p>
                <p className="text-sm text-neutral-500 mt-1 zf-font-prometo-light">{stat.helpText}</p>
              </div>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${colorClasses[stat.color]}`}>
                <Icon className="w-6 h-6" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DashboardStats;