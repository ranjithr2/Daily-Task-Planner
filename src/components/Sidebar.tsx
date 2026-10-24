import React from 'react';
import {
  CalendarCheck2,
  Calendar,
  Clock,
  CheckCircle2,
  ListTodo,
  BookOpen,
  Briefcase,
  Code2,
  User,
  MoreHorizontal,
  RotateCcw,
  Trash2,
  Download,
  Upload,
  X,
  Sparkles,
} from 'lucide-react';
import { Task, TaskView, TaskCategory } from '../types/task';
import { getTodayDateString } from '../utils/taskLogic';

interface SidebarProps {
  currentView: TaskView;
  selectedCategory: TaskCategory | null;
  onSelectView: (view: TaskView) => void;
  onSelectCategory: (category: TaskCategory | null) => void;
  tasks: Task[];
  onResetSampleData: () => void;
  onClearAllTasks: () => void;
  onExportTasks: () => void;
  onImportTasks: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  selectedCategory,
  onSelectView,
  onSelectCategory,
  tasks,
  onResetSampleData,
  onClearAllTasks,
  onExportTasks,
  onImportTasks,
  isMobileOpen,
  onCloseMobile,
}) => {
  const todayStr = getTodayDateString();

  // Counts
  const todayCount = tasks.filter((t) => t.dueDate === todayStr && !t.completed).length;
  const upcomingCount = tasks.filter((t) => t.dueDate > todayStr && !t.completed).length;
  const completedCount = tasks.filter((t) => t.completed).length;
  const allCount = tasks.length;

  const categoryCounts: Record<TaskCategory, number> = {
    study: 0,
    work: 0,
    projects: 0,
    personal: 0,
    other: 0,
  };

  for (const t of tasks) {
    if (categoryCounts[t.category] !== undefined) {
      categoryCounts[t.category]++;
    }
  }

  const navItems: { id: TaskView; label: string; icon: React.ReactNode; badge?: number }[] = [
    {
      id: 'today',
      label: 'Today',
      icon: <CalendarCheck2 className="w-4 h-4" />,
      badge: todayCount,
    },
    {
      id: 'upcoming',
      label: 'Upcoming',
      icon: <Clock className="w-4 h-4" />,
      badge: upcomingCount,
    },
    {
      id: 'all',
      label: 'All Tasks',
      icon: <ListTodo className="w-4 h-4" />,
      badge: allCount,
    },
    {
      id: 'completed',
      label: 'Completed',
      icon: <CheckCircle2 className="w-4 h-4" />,
      badge: completedCount,
    },
    {
      id: 'calendar',
      label: 'Calendar',
      icon: <Calendar className="w-4 h-4" />,
    },
  ];

  const categoryItems: { id: TaskCategory; label: string; icon: React.ReactNode; dotColor: string }[] = [
    { id: 'study', label: 'Study', icon: <BookOpen className="w-3.5 h-3.5" />, dotColor: 'bg-indigo-500' },
    { id: 'work', label: 'Work', icon: <Briefcase className="w-3.5 h-3.5" />, dotColor: 'bg-sky-500' },
    { id: 'projects', label: 'Projects', icon: <Code2 className="w-3.5 h-3.5" />, dotColor: 'bg-violet-500' },
    { id: 'personal', label: 'Personal', icon: <User className="w-3.5 h-3.5" />, dotColor: 'bg-emerald-500' },
    { id: 'other', label: 'Other', icon: <MoreHorizontal className="w-3.5 h-3.5" />, dotColor: 'bg-slate-400' },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200">
      {/* Brand Header */}
      <div className="p-5 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-600 to-blue-500 flex items-center justify-center text-white shadow-sm">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <span className="block text-sm font-extrabold text-slate-900 dark:text-slate-100 tracking-tight leading-tight">
              Daily Task Planner
            </span>
            <span className="block text-[11px] text-slate-400 dark:text-slate-500 font-medium">
              Productivity Suite
            </span>
          </div>
        </div>

        {/* Mobile close button */}
        <button
          type="button"
          onClick={onCloseMobile}
          aria-label="Close navigation sidebar"
          className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        <div>
          <span className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block mb-2">
            Views
          </span>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = currentView === item.id && selectedCategory === null;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    onSelectView(item.id);
                    onSelectCategory(null);
                    onCloseMobile();
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                    isActive
                      ? 'bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className={isActive ? 'text-sky-600 dark:text-sky-400' : 'text-slate-400 dark:text-slate-500'}>
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </div>

                  {item.badge !== undefined && item.badge > 0 && (
                    <span
                      className={`text-[11px] px-1.5 py-0.5 rounded-md font-medium ${
                        isActive
                          ? 'bg-sky-200/60 dark:bg-sky-800/60 text-sky-800 dark:text-sky-200'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Categories Section */}
        <div>
          <div className="flex items-center justify-between px-3 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Categories
            </span>
            {selectedCategory && (
              <button
                type="button"
                onClick={() => onSelectCategory(null)}
                className="text-[10px] text-sky-600 dark:text-sky-400 hover:underline"
              >
                Clear
              </button>
            )}
          </div>

          <nav className="space-y-1">
            {categoryItems.map((cat) => {
              const isCatActive = selectedCategory === cat.id;
              const count = categoryCounts[cat.id];

              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => {
                    onSelectCategory(isCatActive ? null : cat.id);
                    onCloseMobile();
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                    isCatActive
                      ? 'bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 font-semibold'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className={`w-2 h-2 rounded-full ${cat.dotColor}`} />
                    <span>{cat.label}</span>
                  </div>

                  <span className="text-[11px] text-slate-400 dark:text-slate-500">
                    {count}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Quick Storage & Demo Utility Actions */}
      <div className="p-3 border-t border-slate-100 dark:border-slate-800 space-y-1 bg-slate-50/50 dark:bg-slate-900/50">
        <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block mb-1">
          Planner Data
        </span>

        <button
          type="button"
          onClick={onResetSampleData}
          className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5 text-sky-500" />
          <span>Reset Demo Tasks</span>
        </button>

        <button
          type="button"
          onClick={onExportTasks}
          className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200 transition-colors"
        >
          <Download className="w-3.5 h-3.5 text-emerald-500" />
          <span>Export Backup (JSON)</span>
        </button>

        <label className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200 transition-colors cursor-pointer">
          <Upload className="w-3.5 h-3.5 text-indigo-500" />
          <span>Import Backup</span>
          <input
            type="file"
            accept=".json"
            onChange={onImportTasks}
            className="hidden"
          />
        </label>

        <button
          type="button"
          onClick={onClearAllTasks}
          className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear All Tasks</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sticky Sidebar */}
      <div className="hidden lg:block w-64 shrink-0 h-screen sticky top-0">
        {sidebarContent}
      </div>

      {/* Mobile Drawer Overlay */}
      {isMobileOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="lg:hidden fixed inset-0 z-50 flex bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200"
        >
          <div className="w-72 max-w-[85vw] h-full shadow-2xl animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </div>
          <div className="flex-1" onClick={onCloseMobile} />
        </div>
      )}
    </>
  );
};
