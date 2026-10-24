import React from 'react';
import { Search, Filter, RotateCcw, ArrowUpDown, X } from 'lucide-react';
import { TaskCategory, TaskPriority, TaskFilterState, TaskSortOption } from '../types/task';

interface FilterBarProps {
  filters: TaskFilterState;
  onChange: (updater: (prev: TaskFilterState) => TaskFilterState) => void;
  onReset: () => void;
  isFiltered: boolean;
  totalFilteredCount: number;
}

const CATEGORIES: { id: TaskCategory | 'all'; label: string }[] = [
  { id: 'all', label: 'All Categories' },
  { id: 'study', label: 'Study' },
  { id: 'work', label: 'Work' },
  { id: 'projects', label: 'Projects' },
  { id: 'personal', label: 'Personal' },
  { id: 'other', label: 'Other' },
];

const PRIORITIES: { id: TaskPriority | 'all'; label: string }[] = [
  { id: 'all', label: 'All Priorities' },
  { id: 'high', label: 'High Priority' },
  { id: 'medium', label: 'Medium Priority' },
  { id: 'low', label: 'Low Priority' },
];

const SORTS: { id: TaskSortOption; label: string }[] = [
  { id: 'dueDateAsc', label: 'Earliest Due Date' },
  { id: 'dueDateDesc', label: 'Latest Due Date' },
  { id: 'priorityDesc', label: 'Highest Priority' },
  { id: 'priorityAsc', label: 'Lowest Priority' },
  { id: 'titleAsc', label: 'Alphabetical (A-Z)' },
];

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  onChange,
  onReset,
  isFiltered,
  totalFilteredCount,
}) => {
  return (
    <div className="space-y-3 p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => onChange((prev) => ({ ...prev, search: e.target.value }))}
            placeholder="Search tasks by title or notes..."
            className="w-full pl-9 pr-9 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-sky-500 focus:bg-white dark:focus:bg-slate-800 transition-all"
          />
          {filters.search && (
            <button
              type="button"
              onClick={() => onChange((prev) => ({ ...prev, search: '' }))}
              aria-label="Clear search input"
              className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Sort Select */}
        <div className="flex items-center gap-2 shrink-0">
          <label htmlFor="task-sort-select" className="sr-only">
            Sort Tasks
          </label>
          <div className="relative flex items-center">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 absolute left-3 pointer-events-none" />
            <select
              id="task-sort-select"
              value={filters.sortBy}
              onChange={(e) =>
                onChange((prev) => ({ ...prev, sortBy: e.target.value as TaskSortOption }))
              }
              className="pl-8 pr-7 py-2 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300 focus:outline-hidden focus:ring-2 focus:ring-sky-500 cursor-pointer transition-all"
            >
              {SORTS.map((s) => (
                <option key={s.id} value={s.id} className="dark:bg-slate-900">
                  {s.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Filter Options Row */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 dark:border-slate-800/60">
        <div className="flex flex-wrap items-center gap-2">
          <span className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mr-1">
            <Filter className="w-3 h-3" />
            Filters:
          </span>

          {/* Category Dropdown */}
          <select
            aria-label="Filter by category"
            value={filters.category}
            onChange={(e) =>
              onChange((prev) => ({
                ...prev,
                category: e.target.value as TaskCategory | 'all',
              }))
            }
            className="px-2.5 py-1.5 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 focus:ring-2 focus:ring-sky-500 transition-colors"
          >
            {CATEGORIES.map((c) => (
              <option key={c.id} value={c.id} className="dark:bg-slate-900">
                {c.label}
              </option>
            ))}
          </select>

          {/* Priority Dropdown */}
          <select
            aria-label="Filter by priority"
            value={filters.priority}
            onChange={(e) =>
              onChange((prev) => ({
                ...prev,
                priority: e.target.value as TaskPriority | 'all',
              }))
            }
            className="px-2.5 py-1.5 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 focus:ring-2 focus:ring-sky-500 transition-colors"
          >
            {PRIORITIES.map((p) => (
              <option key={p.id} value={p.id} className="dark:bg-slate-900">
                {p.label}
              </option>
            ))}
          </select>

          {/* Status Dropdown */}
          <select
            aria-label="Filter by status"
            value={filters.status}
            onChange={(e) =>
              onChange((prev) => ({
                ...prev,
                status: e.target.value as any,
              }))
            }
            className="px-2.5 py-1.5 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 focus:ring-2 focus:ring-sky-500 transition-colors"
          >
            <option value="all" className="dark:bg-slate-900">All Statuses</option>
            <option value="pending" className="dark:bg-slate-900">Pending Only</option>
            <option value="completed" className="dark:bg-slate-900">Completed Only</option>
            <option value="overdue" className="dark:bg-slate-900">Overdue Only</option>
          </select>
        </div>

        {/* Count & Reset */}
        <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
          <span>
            Showing <strong className="text-slate-800 dark:text-slate-200">{totalFilteredCount}</strong> task{totalFilteredCount === 1 ? '' : 's'}
          </span>
          {isFiltered && (
            <button
              type="button"
              onClick={onReset}
              className="inline-flex items-center gap-1 font-medium text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 hover:underline transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              Reset Filters
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
