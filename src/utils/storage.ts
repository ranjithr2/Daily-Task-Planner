import { Task } from '../types/task';
import { getTodayDateString } from './taskLogic';

const STORAGE_KEY_TASKS = 'daily_task_planner_tasks_v2';
const STORAGE_KEY_THEME = 'daily_task_planner_theme_v2';

export function getOffsetDateString(daysOffset: number): string {
  const d = new Date();
  d.setDate(d.getDate() + daysOffset);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function generateSeedTasks(): Task[] {
  const today = getTodayDateString();
  const yesterday = getOffsetDateString(-1);
  const tomorrow = getOffsetDateString(1);
  const inThreeDays = getOffsetDateString(3);
  const inFiveDays = getOffsetDateString(5);

  return [
    {
      id: 'task-seed-1',
      title: 'Review Machine Learning Chapter 4 Notes',
      description: 'Prepare summary flashcards on Gradient Descent and Backpropagation for Friday quiz.',
      dueDate: today,
      dueTime: '17:00',
      priority: 'high',
      category: 'study',
      completed: false,
      createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
      updatedAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    },
    {
      id: 'task-seed-2',
      title: 'Morning 30-Minute Aerobic Cardio & Stretching',
      description: 'Completed morning routine and mobility drills.',
      dueDate: today,
      dueTime: '08:30',
      priority: 'low',
      category: 'personal',
      completed: true,
      completedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
      createdAt: new Date(Date.now() - 3600000 * 6).toISOString(),
      updatedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    },
    {
      id: 'task-seed-3',
      title: 'Submit Bi-Weekly Sprint Progress Report',
      description: 'Document completed user stories, roadmap milestones, and blocker status for project lead.',
      dueDate: yesterday, // Intentionally overdue for testing
      dueTime: '18:00',
      priority: 'high',
      category: 'work',
      completed: false,
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    },
    {
      id: 'task-seed-4',
      title: 'Finalize UI Component Architecture & Wireframes',
      description: 'Align color tokens, button states, and responsive navigation drawer in Figma.',
      dueDate: tomorrow,
      dueTime: '14:00',
      priority: 'medium',
      category: 'projects',
      completed: false,
      createdAt: new Date(Date.now() - 3600000 * 10).toISOString(),
      updatedAt: new Date(Date.now() - 3600000 * 10).toISOString(),
    },
    {
      id: 'task-seed-5',
      title: 'Schedule Annual Dental Checkup & Cleaning',
      description: 'Call clinic reception to book slot for next Thursday morning.',
      dueDate: inThreeDays,
      dueTime: '11:00',
      priority: 'low',
      category: 'other',
      completed: false,
      createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
      updatedAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    },
    {
      id: 'task-seed-6',
      title: 'Research Database Indexing & B-Trees',
      description: 'Read Chapter 3 of Designing Data-Intensive Applications.',
      dueDate: inFiveDays,
      dueTime: '19:00',
      priority: 'medium',
      category: 'study',
      completed: false,
      createdAt: new Date(Date.now() - 3600000 * 20).toISOString(),
      updatedAt: new Date(Date.now() - 3600000 * 20).toISOString(),
    },
  ];
}

export function loadTasksFromStorage(): Task[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_TASKS);
    if (!raw) {
      const seed = generateSeedTasks();
      saveTasksToStorage(seed);
      return seed;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed;
    }
    return generateSeedTasks();
  } catch (e) {
    console.error('Failed to load tasks from localStorage:', e);
    return generateSeedTasks();
  }
}

export function saveTasksToStorage(tasks: Task[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_TASKS, JSON.stringify(tasks));
  } catch (e) {
    console.error('Failed to save tasks to localStorage:', e);
  }
}

export function resetStorageToSampleTasks(): Task[] {
  const seed = generateSeedTasks();
  saveTasksToStorage(seed);
  return seed;
}

export function clearAllStorageTasks(): Task[] {
  saveTasksToStorage([]);
  return [];
}

export function loadThemePreference(): 'light' | 'dark' {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_THEME);
    if (saved === 'dark' || saved === 'light') {
      return saved;
    }
    if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
  } catch {
    // fallback
  }
  return 'light';
}

export function saveThemePreference(theme: 'light' | 'dark'): void {
  try {
    localStorage.setItem(STORAGE_KEY_THEME, theme);
  } catch (e) {
    console.error('Failed to save theme preference:', e);
  }
}
