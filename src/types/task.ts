export type TaskPriority = 'low' | 'medium' | 'high';

export type TaskCategory = 'study' | 'personal' | 'work' | 'projects' | 'other';

export type TaskView = 'today' | 'upcoming' | 'all' | 'completed' | 'calendar';

export type TaskSortOption = 'dueDateAsc' | 'dueDateDesc' | 'priorityDesc' | 'priorityAsc' | 'titleAsc';

export interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate: string; // YYYY-MM-DD format
  dueTime?: string; // HH:mm format (24-hour)
  priority: TaskPriority;
  category: TaskCategory;
  completed: boolean;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TaskFilterState {
  search: string;
  category: TaskCategory | 'all';
  priority: TaskPriority | 'all';
  status: 'all' | 'pending' | 'completed' | 'overdue';
  sortBy: TaskSortOption;
}

export interface TaskStats {
  total: number;
  completed: number;
  pending: number;
  overdue: number;
  todayTotal: number;
  todayCompleted: number;
  todayPending: number;
  completionRate: number; // 0 to 100
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'error';
  message: string;
}
