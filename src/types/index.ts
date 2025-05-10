export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'manager' | 'admin' | 'team_lead';
  avatarUrl?: string;
  department?: string;
  managerId?: string;
}

export interface Topic {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedHours: number;
  tags: string[];
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Learning {
  id: string;
  userId: string;
  topicId: string;
  progress: number; // 0-100
  status: 'not_started' | 'in_progress' | 'completed';
  startDate: string;
  completionDate?: string;
  notes?: string;
  lastAccessed: string;
}

export interface TimelineEvent {
  id: string;
  userId: string;
  topicId: string;
  eventType: 'started' | 'milestone' | 'completed';
  eventDate: string;
  details?: string;
}

export interface TopicWithProgress extends Topic {
  progress: number;
  status: Learning['status'];
}

export interface DashboardStats {
  totalTopics: number;
  completedTopics: number;
  inProgressTopics: number;
  notStartedTopics: number;
  totalHoursSpent: number;
  averageProgress: number;
}