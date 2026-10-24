import { Task, TaskCategory, TaskPriority, TaskFilterState, TaskStats, TaskView } from '../types/task';

/**
 * Returns YYYY-MM-DD format for a given Date or current local date.
 */
export function getTodayDateString(d: Date = new Date()): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Returns current HH:mm in 24h format.
 */
export function getCurrentTimeString(d: Date = new Date()): string {
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}

/**
 * Formats YYYY-MM-DD into a human-friendly label.
 */
export function formatDisplayDate(dateStr: string, referenceDateStr?: string): string {
  if (!dateStr) return '';
  const todayStr = referenceDateStr || getTodayDateString();
  
  if (dateStr === todayStr) {
    return 'Today';
  }

  // Calculate day difference
  const [y1, m1, d1] = todayStr.split('-').map(Number);
  const [y2, m2, d2] = dateStr.split('-').map(Number);
  const dateObj1 = new Date(y1, m1 - 1, d1);
  const dateObj2 = new Date(y2, m2 - 1, d2);
  const diffDays = Math.round((dateObj2.getTime() - dateObj1.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays === 1) return 'Tomorrow';
  if (diffDays === -1) return 'Yesterday';

  // Format as e.g. "Oct 24, 2026" or "Oct 24"
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const month = monthNames[m2 - 1];
  
  if (y1 === y2) {
    return `${month} ${d2}`;
  }
  return `${month} ${d2}, ${y2}`;
}

/**
 * Formats 24h HH:mm to 12h format (e.g. 14:30 -> 2:30 PM).
 */
export function formatDisplayTime(timeStr?: string): string {
  if (!timeStr) return '';
  const parts = timeStr.split(':');
  if (parts.length < 2) return timeStr;
  let hours = parseInt(parts[0], 10);
  const minutes = parts[1];
  if (isNaN(hours)) return timeStr;

  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // 0 hour is 12 AM
  return `${hours}:${minutes} ${ampm}`;
}

/**
 * Checks if a task is overdue. Completed tasks are not overdue.
 */
export function isTaskOverdue(
  task: Task,
  todayStr: string = getTodayDateString(),
  currentTimeStr: string = getCurrentTimeString()
): boolean {
  if (task.completed) return false;
  if (!task.dueDate) return false;

  if (task.dueDate < todayStr) {
    return true;
  }

  if (task.dueDate === todayStr && task.dueTime) {
    return task.dueTime < currentTimeStr;
  }

  return false;
}

/**
 * Calculates dashboard statistics.
 */
export function calculateTaskStats(
  tasks: Task[],
  todayStr: string = getTodayDateString(),
  currentTimeStr: string = getCurrentTimeString()
): TaskStats {
  const total = tasks.length;
  let completed = 0;
  let overdue = 0;
  let todayTotal = 0;
  let todayCompleted = 0;

  for (const task of tasks) {
    if (task.completed) {
      completed++;
    } else if (isTaskOverdue(task, todayStr, currentTimeStr)) {
      overdue++;
    }

    if (task.dueDate === todayStr) {
      todayTotal++;
      if (task.completed) {
        todayCompleted++;
      }
    }
  }

  const pending = total - completed;
  const todayPending = todayTotal - todayCompleted;
  const completionRate = todayTotal > 0 ? Math.round((todayCompleted / todayTotal) * 100) : (total > 0 ? Math.round((completed / total) * 100) : 0);

  return {
    total,
    completed,
    pending,
    overdue,
    todayTotal,
    todayCompleted,
    todayPending,
    completionRate,
  };
}

const PRIORITY_WEIGHTS: Record<TaskPriority, number> = {
  high: 3,
  medium: 2,
  low: 1,
};

/**
 * Filters and sorts tasks based on active view, search, and filter parameters.
 */
export function filterAndSortTasks(
  tasks: Task[],
  view: TaskView,
  filters: TaskFilterState,
  todayStr: string = getTodayDateString(),
  currentTimeStr: string = getCurrentTimeString()
): Task[] {
  let result = tasks.filter((task) => {
    // 1. View filtering
    if (view === 'today') {
      if (task.dueDate !== todayStr) return false;
    } else if (view === 'upcoming') {
      if (task.dueDate <= todayStr) return false;
    } else if (view === 'completed') {
      if (!task.completed) return false;
    }

    // 2. Search query filter (title or description)
    if (filters.search.trim()) {
      const q = filters.search.trim().toLowerCase();
      const matchTitle = task.title.toLowerCase().includes(q);
      const matchDesc = task.description ? task.description.toLowerCase().includes(q) : false;
      if (!matchTitle && !matchDesc) return false;
    }

    // 3. Category filter
    if (filters.category !== 'all' && task.category !== filters.category) {
      return false;
    }

    // 4. Priority filter
    if (filters.priority !== 'all' && task.priority !== filters.priority) {
      return false;
    }

    // 5. Status filter
    if (filters.status === 'completed') {
      if (!task.completed) return false;
    } else if (filters.status === 'pending') {
      if (task.completed) return false;
    } else if (filters.status === 'overdue') {
      if (!isTaskOverdue(task, todayStr, currentTimeStr)) return false;
    }

    return true;
  });

  // Sort
  result.sort((a, b) => {
    switch (filters.sortBy) {
      case 'dueDateAsc': {
        const dComp = (a.dueDate || '9999').localeCompare(b.dueDate || '9999');
        if (dComp !== 0) return dComp;
        return (a.dueTime || '99:99').localeCompare(b.dueTime || '99:99');
      }
      case 'dueDateDesc': {
        const dComp = (b.dueDate || '0000').localeCompare(a.dueDate || '0000');
        if (dComp !== 0) return dComp;
        return (b.dueTime || '00:00').localeCompare(a.dueTime || '00:00');
      }
      case 'priorityDesc': {
        const pDiff = PRIORITY_WEIGHTS[b.priority] - PRIORITY_WEIGHTS[a.priority];
        if (pDiff !== 0) return pDiff;
        return (a.dueDate || '9999').localeCompare(b.dueDate || '9999');
      }
      case 'priorityAsc': {
        const pDiff = PRIORITY_WEIGHTS[a.priority] - PRIORITY_WEIGHTS[b.priority];
        if (pDiff !== 0) return pDiff;
        return (a.dueDate || '9999').localeCompare(b.dueDate || '9999');
      }
      case 'titleAsc':
        return a.title.localeCompare(b.title);
      default:
        return 0;
    }
  });

  return result;
}

/**
 * Returns dynamic motivational messages based on today's completion progress.
 */
export function getMotivationalMessage(
  completedCount: number,
  totalCount: number
): { title: string; message: string; quote: string } {
  if (totalCount === 0) {
    return {
      title: 'Ready for a Productive Day',
      message: 'Plan your priorities and achieve clarity step by step.',
      quote: '"The secret of getting ahead is getting started." — Mark Twain',
    };
  }

  const rate = Math.round((completedCount / totalCount) * 100);

  if (rate === 100) {
    return {
      title: 'Mission Accomplished!',
      message: `You completed all ${totalCount} task${totalCount > 1 ? 's' : ''} scheduled for today. Outstanding work!`,
      quote: '"Small daily achievements lead to monumental results."',
    };
  }

  if (rate >= 75) {
    return {
      title: 'Almost at the Finish Line',
      message: `${completedCount} of ${totalCount} completed. Just one final push to close out today!`,
      quote: '"Finish each day and be done with it. You have done what you could."',
    };
  }

  if (rate >= 50) {
    return {
      title: 'Steady Momentum',
      message: `Halfway through today's agenda (${completedCount}/${totalCount}). You are on a roll!`,
      quote: '"Action is the foundational key to all success." — Pablo Picasso',
    };
  }

  if (rate > 0) {
    return {
      title: 'Great Start!',
      message: `First tasks checked off (${completedCount}/${totalCount}). Keep that productive rhythm going.`,
      quote: '"A journey of a thousand miles begins with a single step."',
    };
  }

  return {
    title: 'Begin with Focus',
    message: `${totalCount} task${totalCount > 1 ? 's' : ''} waiting for your focus today. Pick the highest priority task first!`,
    quote: '"Focus on being productive instead of busy." — Tim Ferriss',
  };
}

/**
 * Category styling metadata.
 */
export function getCategoryMeta(category: TaskCategory): {
  label: string;
  textColor: string;
  dotColor: string;
} {
  switch (category) {
    case 'study':
      return {
        label: 'Study',
        textColor: 'text-indigo-600 dark:text-indigo-400',
        dotColor: 'bg-indigo-500',
      };
    case 'work':
      return {
        label: 'Work',
        textColor: 'text-sky-600 dark:text-sky-400',
        dotColor: 'bg-sky-500',
      };
    case 'projects':
      return {
        label: 'Projects',
        textColor: 'text-violet-600 dark:text-violet-400',
        dotColor: 'bg-violet-500',
      };
    case 'personal':
      return {
        label: 'Personal',
        textColor: 'text-emerald-600 dark:text-emerald-400',
        dotColor: 'bg-emerald-500',
      };
    case 'other':
    default:
      return {
        label: 'Other',
        textColor: 'text-slate-600 dark:text-slate-400',
        dotColor: 'bg-slate-400',
      };
  }
}

/**
 * Priority styling metadata.
 */
export function getPriorityMeta(priority: TaskPriority): {
  label: string;
  textColor: string;
  dotColor: string;
} {
  switch (priority) {
    case 'high':
      return {
        label: 'High Priority',
        textColor: 'text-rose-600 dark:text-rose-400',
        dotColor: 'bg-rose-500',
      };
    case 'medium':
      return {
        label: 'Medium Priority',
        textColor: 'text-amber-600 dark:text-amber-400',
        dotColor: 'bg-amber-500',
      };
    case 'low':
    default:
      return {
        label: 'Low Priority',
        textColor: 'text-emerald-600 dark:text-emerald-400',
        dotColor: 'bg-emerald-500',
      };
  }
}
