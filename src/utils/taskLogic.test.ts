import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateTaskStats,
  isTaskOverdue,
  filterAndSortTasks,
  getMotivationalMessage,
  formatDisplayDate,
  formatDisplayTime,
} from './taskLogic';
import { Task, TaskFilterState } from '../types/task';

const mockTasks: Task[] = [
  {
    id: 't-1',
    title: 'Study Algorithm Complexity',
    description: 'Review Big-O analysis and Master Theorem',
    dueDate: '2026-10-24',
    dueTime: '15:00',
    priority: 'high',
    category: 'study',
    completed: false,
    createdAt: '2026-10-24T08:00:00Z',
    updatedAt: '2026-10-24T08:00:00Z',
  },
  {
    id: 't-2',
    title: 'Daily Standup Sync',
    description: 'Sprint 14 status update',
    dueDate: '2026-10-24',
    dueTime: '10:00',
    priority: 'medium',
    category: 'work',
    completed: true,
    completedAt: '2026-10-24T10:15:00Z',
    createdAt: '2026-10-24T08:00:00Z',
    updatedAt: '2026-10-24T10:15:00Z',
  },
  {
    id: 't-3',
    title: 'Submit Tax Forms',
    description: 'Submit yearly documentation',
    dueDate: '2026-10-20', // in the past
    dueTime: '12:00',
    priority: 'high',
    category: 'personal',
    completed: false,
    createdAt: '2026-10-18T08:00:00Z',
    updatedAt: '2026-10-18T08:00:00Z',
  },
  {
    id: 't-4',
    title: 'Quarterly Project Architecture Presentation',
    description: 'Prepare diagrams in Figma',
    dueDate: '2026-10-28', // future
    dueTime: '14:00',
    priority: 'high',
    category: 'projects',
    completed: false,
    createdAt: '2026-10-24T08:00:00Z',
    updatedAt: '2026-10-24T08:00:00Z',
  },
];

test('calculateTaskStats computes totals, completed, pending, overdue and today rates', () => {
  const stats = calculateTaskStats(mockTasks, '2026-10-24', '12:00');
  assert.equal(stats.total, 4);
  assert.equal(stats.completed, 1);
  assert.equal(stats.pending, 3);
  assert.equal(stats.overdue, 1); // t-3 is overdue
  assert.equal(stats.todayTotal, 2); // t-1 and t-2 are today
  assert.equal(stats.todayCompleted, 1); // t-2 is completed
  assert.equal(stats.todayPending, 1);
  assert.equal(stats.completionRate, 50); // 1 out of 2 = 50%
});

test('isTaskOverdue correctly checks past date and time', () => {
  const pastTask = mockTasks[2];
  assert.equal(isTaskOverdue(pastTask, '2026-10-24', '12:00'), true);

  const completedTask = mockTasks[1];
  assert.equal(isTaskOverdue(completedTask, '2026-10-24', '12:00'), false);

  const futureTask = mockTasks[3];
  assert.equal(isTaskOverdue(futureTask, '2026-10-24', '12:00'), false);

  const todayTask = mockTasks[0]; // due at 15:00
  assert.equal(isTaskOverdue(todayTask, '2026-10-24', '12:00'), false);
  assert.equal(isTaskOverdue(todayTask, '2026-10-24', '16:00'), true);
});

test('filterAndSortTasks correctly filters views', () => {
  const defaultFilters: TaskFilterState = {
    search: '',
    category: 'all',
    priority: 'all',
    status: 'all',
    sortBy: 'dueDateAsc',
  };

  const todayTasks = filterAndSortTasks(mockTasks, 'today', defaultFilters, '2026-10-24');
  assert.equal(todayTasks.length, 2);
  assert.ok(todayTasks.every((t) => t.dueDate === '2026-10-24'));

  const upcomingTasks = filterAndSortTasks(mockTasks, 'upcoming', defaultFilters, '2026-10-24');
  assert.equal(upcomingTasks.length, 1);
  assert.equal(upcomingTasks[0].id, 't-4');

  const completedTasks = filterAndSortTasks(mockTasks, 'completed', defaultFilters, '2026-10-24');
  assert.equal(completedTasks.length, 1);
  assert.equal(completedTasks[0].id, 't-2');
});

test('filterAndSortTasks handles search and category filters', () => {
  const searchFilter: TaskFilterState = {
    search: 'Algorithm',
    category: 'all',
    priority: 'all',
    status: 'all',
    sortBy: 'dueDateAsc',
  };
  const searchResults = filterAndSortTasks(mockTasks, 'all', searchFilter, '2026-10-24');
  assert.equal(searchResults.length, 1);
  assert.equal(searchResults[0].id, 't-1');

  const catFilter: TaskFilterState = {
    search: '',
    category: 'personal',
    priority: 'all',
    status: 'all',
    sortBy: 'dueDateAsc',
  };
  const catResults = filterAndSortTasks(mockTasks, 'all', catFilter, '2026-10-24');
  assert.equal(catResults.length, 1);
  assert.equal(catResults[0].id, 't-3');
});

test('formatDisplayDate and formatDisplayTime format accurately', () => {
  assert.equal(formatDisplayDate('2026-10-24', '2026-10-24'), 'Today');
  assert.equal(formatDisplayDate('2026-10-25', '2026-10-24'), 'Tomorrow');
  assert.equal(formatDisplayDate('2026-10-23', '2026-10-24'), 'Yesterday');
  assert.equal(formatDisplayTime('14:30'), '2:30 PM');
  assert.equal(formatDisplayTime('09:15'), '9:15 AM');
  assert.equal(formatDisplayTime('00:00'), '12:00 AM');
});

test('getMotivationalMessage returns proper text based on progress', () => {
  const zero = getMotivationalMessage(0, 3);
  assert.equal(zero.title, 'Begin with Focus');

  const half = getMotivationalMessage(2, 4);
  assert.equal(half.title, 'Steady Momentum');

  const done = getMotivationalMessage(3, 3);
  assert.equal(done.title, 'Mission Accomplished!');
});
