import React from 'react';
import {
  Plus,
  Sun,
  Moon,
  Menu,
  CalendarDays,
} from 'lucide-react';
import { TaskView } from '../types/task';

interface HeaderProps {
  currentView: TaskView;
  selectedCategory: string | null;
  onOpenAddTask: () => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  onToggleMobileSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  selectedCategory,
  onOpenAddTask,
  theme,
  onToggleTheme,
  onToggleMobileSidebar,
}) => {
  // Format today's date nicely: "Saturday, Oct 24, 2026"
  const todayFormatted = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date());

  const viewTitles: Record<TaskView, { title: string; subtitle: string }> = {
    today: {
      title: "Today's Agenda",
      subtitle: 'Focus on what matters most today',
    },
    upcoming: {
      title: 'Upcoming Deadlines',
      subtitle: 'Plan ahead and stay prepared',
    },
    all: {
      title: 'All Tasks',
      subtitle: 'Complete catalog of all personal and professional activities',
    },
    completed: {
      title: 'Completed Archive',
      subtitle: 'Review accomplished milestones and tasks',
    },
    calendar: {
      title: 'Calendar Schedule',
      subtitle: 'Monthly visual planner and scheduled timelines',
    },
  };

  const currentInfo = viewTitles[currentView] || viewTitles.today;
  const displayTitle = selectedCategory
    ? `${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Tasks`
    : currentInfo.title;

  return (
    <header className="sticky top-0 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
        {/* Left: Mobile hamburger & View title */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onToggleMobileSidebar}
            aria-label="Toggle navigation menu"
            className="lg:hidden p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div>
            <h1 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
              {displayTitle}
            </h1>
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <span className="hidden sm:inline-flex items-center gap-1 font-medium">
                <CalendarDays className="w-3.5 h-3.5 text-sky-500" />
                {todayFormatted}
              </span>
              <span className="hidden sm:inline" aria-hidden="true">·</span>
              <span className="truncate">{currentInfo.subtitle}</span>
            </div>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Theme Toggle Button */}
          <button
            type="button"
            onClick={onToggleTheme}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            className="p-2 sm:px-3 sm:py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all flex items-center gap-1.5"
          >
            {theme === 'light' ? (
              <>
                <Moon className="w-4 h-4 text-slate-600 dark:text-slate-300" />
                <span className="hidden md:inline text-xs font-semibold">Dark</span>
              </>
            ) : (
              <>
                <Sun className="w-4 h-4 text-amber-400" />
                <span className="hidden md:inline text-xs font-semibold">Light</span>
              </>
            )}
          </button>

          {/* Prominent Add Task CTA Button */}
          <button
            type="button"
            onClick={onOpenAddTask}
            className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-sky-600 hover:bg-sky-700 dark:bg-sky-500 dark:hover:bg-sky-600 rounded-xl shadow-xs transition-colors focus:outline-hidden focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Add Task</span>
          </button>
        </div>
      </div>
    </header>
  );
};
