import React from 'react';
import {
  Sparkles,
  Calendar,
  Clock,
  ArrowRight,
  TrendingUp,
  FolderOpen,
} from 'lucide-react';
import { Task, TaskStats } from '../types/task';
import {
  getMotivationalMessage,
  formatDisplayDate,
  formatDisplayTime,
  getPriorityMeta,
  getCategoryMeta,
  isTaskOverdue,
} from '../utils/taskLogic';

interface RightPanelProps {
  stats: TaskStats;
  tasks: Task[];
  onSelectTask: (task: Task) => void;
  onAddTask: () => void;
  onNavigateToCalendar: () => void;
}

export const RightPanel: React.FC<RightPanelProps> = ({
  stats,
  tasks,
  onSelectTask,
  onAddTask,
  onNavigateToCalendar,
}) => {
  const motivation = getMotivationalMessage(stats.todayCompleted, stats.todayTotal);

  // Compute upcoming deadlines (pending tasks due in future or today, sorted chronologically)
  const pendingTasks = tasks.filter((t) => !t.completed);
  const upcomingDeadlines = [...pendingTasks]
    .sort((a, b) => {
      const d = (a.dueDate || '9999').localeCompare(b.dueDate || '9999');
      if (d !== 0) return d;
      return (a.dueTime || '99:99').localeCompare(b.dueTime || '99:99');
    })
    .slice(0, 4);

  // Category distribution
  const categoryCounts: Record<string, number> = {};
  for (const t of tasks) {
    categoryCounts[t.category] = (categoryCounts[t.category] || 0) + 1;
  }
  const totalTasks = tasks.length || 1;

  // SVG Circular progress radius & circumference
  const radius = 34;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (stats.completionRate / 100) * circumference;

  return (
    <aside className="space-y-6">
      {/* 1. Daily Progress Ring & Completion */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-sky-500" />
            Today's Progress
          </h2>
          <span className="text-xs font-semibold text-sky-600 dark:text-sky-400">
            {stats.todayCompleted} of {stats.todayTotal} Done
          </span>
        </div>

        <div className="flex items-center gap-5">
          {/* Circular Progress Gauge */}
          <div className="relative shrink-0 flex items-center justify-center">
            <svg className="w-20 h-20 -rotate-90">
              <circle
                cx="40"
                cy="40"
                r={radius}
                className="stroke-slate-100 dark:stroke-slate-800"
                strokeWidth="7"
                fill="none"
              />
              <circle
                cx="40"
                cy="40"
                r={radius}
                className="stroke-sky-600 dark:stroke-sky-400 transition-all duration-500 ease-out"
                strokeWidth="7"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="none"
              />
            </svg>
            <div className="absolute text-center">
              <span className="text-base font-extrabold text-slate-900 dark:text-slate-100">
                {stats.completionRate}%
              </span>
            </div>
          </div>

          <div className="flex-1 space-y-1.5">
            <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
              <span>Remaining Today</span>
              <strong className="text-slate-700 dark:text-slate-200 font-semibold">{stats.todayPending} tasks</strong>
            </div>

            {/* Visual Linear Progress Bar */}
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-sky-600 dark:bg-sky-500 h-full rounded-full transition-all duration-500 ease-out"
                style={{ width: `${stats.completionRate}%` }}
              />
            </div>
            
            <p className="text-[11px] text-slate-400 dark:text-slate-500 leading-tight">
              {stats.completionRate === 100
                ? 'All tasks completed!'
                : stats.todayTotal === 0
                ? 'No tasks due today yet.'
                : `${stats.todayPending} remaining to complete.`}
            </p>
          </div>
        </div>
      </div>

      {/* 2. Motivational Card */}
      <div className="p-5 rounded-2xl bg-gradient-to-br from-sky-50 to-blue-50/60 dark:from-slate-900 dark:to-slate-900/80 border border-sky-100 dark:border-slate-800 shadow-xs relative overflow-hidden">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-xl bg-sky-500/10 dark:bg-sky-500/20 text-sky-600 dark:text-sky-400 shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              {motivation.title}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {motivation.message}
            </p>
            <p className="text-[11px] italic text-slate-500 dark:text-slate-400 pt-1">
              {motivation.quote}
            </p>
          </div>
        </div>
      </div>

      {/* 3. Upcoming Deadlines Section */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex items-center justify-between mb-3.5">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-sky-500" />
            Upcoming Deadlines
          </h2>
          <button
            type="button"
            onClick={onNavigateToCalendar}
            className="text-xs font-medium text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 flex items-center gap-0.5 hover:underline"
          >
            Calendar
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {upcomingDeadlines.length === 0 ? (
          <div className="text-center py-6 text-slate-400 dark:text-slate-500 text-xs">
            No upcoming deadlines on your radar.
            <button
              type="button"
              onClick={onAddTask}
              className="block mx-auto mt-2 text-sky-600 dark:text-sky-400 hover:underline font-semibold"
            >
              + Schedule a task
            </button>
          </div>
        ) : (
          <div className="space-y-2.5">
            {upcomingDeadlines.map((task) => {
              const isOver = isTaskOverdue(task);
              const priMeta = getPriorityMeta(task.priority);
              const catMeta = getCategoryMeta(task.category);

              return (
                <button
                  key={task.id}
                  type="button"
                  onClick={() => onSelectTask(task)}
                  className="w-full text-left p-3 rounded-xl border border-slate-100 dark:border-slate-800/80 hover:border-slate-200 dark:hover:border-slate-700 hover:bg-slate-50/70 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 line-clamp-1">
                      {task.title}
                    </p>
                    <span className={`w-1.5 h-1.5 rounded-full shrink-0 mt-1 ${priMeta.dotColor}`} />
                  </div>

                  <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                    <span className={catMeta.textColor}>{catMeta.label}</span>
                    <span aria-hidden="true">·</span>
                    <span className={isOver ? 'text-rose-500 font-semibold' : ''}>
                      {formatDisplayDate(task.dueDate)}
                    </span>
                    {task.dueTime && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span className="flex items-center gap-0.5">
                          <Clock className="w-2.5 h-2.5" />
                          {formatDisplayTime(task.dueTime)}
                        </span>
                      </>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* 4. Category Distribution Breakdown */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mb-3.5">
          <FolderOpen className="w-3.5 h-3.5 text-sky-500" />
          Category Balance
        </h2>

        <div className="space-y-2">
          {(['study', 'work', 'projects', 'personal', 'other'] as const).map((cat) => {
            const count = categoryCounts[cat] || 0;
            const pct = Math.round((count / totalTasks) * 100);
            const meta = getCategoryMeta(cat);

            return (
              <div key={cat} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                    <span className={`w-2 h-2 rounded-full ${meta.dotColor}`} />
                    {meta.label}
                  </span>
                  <span className="text-slate-400 dark:text-slate-500">
                    {count} ({pct}%)
                  </span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div
                    className={`${meta.dotColor} h-full rounded-full transition-all duration-300`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </aside>
  );
};
