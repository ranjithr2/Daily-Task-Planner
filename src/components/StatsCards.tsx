import React from 'react';
import { CheckCircle2, Clock, AlertTriangle, Layers } from 'lucide-react';
import { TaskStats } from '../types/task';

interface StatsCardsProps {
  stats: TaskStats;
  activeStatusFilter: 'all' | 'pending' | 'completed' | 'overdue';
  onSelectStatusFilter: (status: 'all' | 'pending' | 'completed' | 'overdue') => void;
}

export const StatsCards: React.FC<StatsCardsProps> = ({
  stats,
  activeStatusFilter,
  onSelectStatusFilter,
}) => {
  const cards = [
    {
      id: 'all' as const,
      label: 'Total Tasks',
      value: stats.total,
      subtext: `${stats.todayTotal} scheduled for today`,
      icon: <Layers className="w-5 h-5 text-sky-600 dark:text-sky-400" />,
      bg: 'bg-sky-500/10 dark:bg-sky-500/20',
      activeBorder: 'ring-2 ring-sky-500 dark:ring-sky-400',
    },
    {
      id: 'completed' as const,
      label: 'Completed',
      value: stats.completed,
      subtext: `${stats.completionRate}% completion rate`,
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />,
      bg: 'bg-emerald-500/10 dark:bg-emerald-500/20',
      activeBorder: 'ring-2 ring-emerald-500 dark:ring-emerald-400',
    },
    {
      id: 'pending' as const,
      label: 'Pending Tasks',
      value: stats.pending,
      subtext: `${stats.todayPending} remaining today`,
      icon: <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400" />,
      bg: 'bg-amber-500/10 dark:bg-amber-500/20',
      activeBorder: 'ring-2 ring-amber-500 dark:ring-amber-400',
    },
    {
      id: 'overdue' as const,
      label: 'Overdue Tasks',
      value: stats.overdue,
      subtext: stats.overdue > 0 ? 'Needs immediate attention' : 'All deadlines on track',
      icon: <AlertTriangle className="w-5 h-5 text-rose-600 dark:text-rose-400" />,
      bg: 'bg-rose-500/10 dark:bg-rose-500/20',
      activeBorder: 'ring-2 ring-rose-500 dark:ring-rose-400',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {cards.map((c) => {
        const isSelected = activeStatusFilter === c.id;
        return (
          <button
            key={c.id}
            type="button"
            onClick={() => onSelectStatusFilter(isSelected ? 'all' : c.id)}
            className={`group text-left p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 transition-all shadow-xs hover:border-slate-300 dark:hover:border-slate-700 ${
              isSelected ? `${c.activeBorder} shadow-sm` : ''
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                {c.label}
              </span>
              <div className={`p-2 rounded-xl ${c.bg} transition-transform group-hover:scale-105`}>
                {c.icon}
              </div>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
                {c.value}
              </span>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 truncate">
              {c.subtext}
            </p>
          </button>
        );
      })}
    </div>
  );
};
