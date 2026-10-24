import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Calendar as CalendarIcon,
} from 'lucide-react';
import { Task } from '../types/task';
import { getTodayDateString, formatDisplayDate } from '../utils/taskLogic';
import { TaskCard } from './TaskCard';

interface CalendarViewProps {
  tasks: Task[];
  onToggleComplete: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onAddTaskForDate: (dateStr: string) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  tasks,
  onToggleComplete,
  onEdit,
  onDelete,
  onAddTaskForDate,
}) => {
  const todayStr = getTodayDateString();
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [selectedDateStr, setSelectedDateStr] = useState<string>(todayStr);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // First day of current month & total days
  const firstDayIndex = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleJumpToday = () => {
    const now = new Date();
    setCurrentDate(now);
    setSelectedDateStr(getTodayDateString(now));
  };

  // Group tasks by dueDate
  const tasksByDate = new Map<string, Task[]>();
  for (const t of tasks) {
    if (t.dueDate) {
      const list = tasksByDate.get(t.dueDate) || [];
      list.push(t);
      tasksByDate.set(t.dueDate, list);
    }
  }

  // Days matrix
  const days: { dateStr: string; dayNum: number; isCurrentMonth: boolean }[] = [];

  // Previous month trailing days
  for (let i = firstDayIndex - 1; i >= 0; i--) {
    const dayNum = daysInPrevMonth - i;
    const prevMonthDate = new Date(year, month - 1, dayNum);
    const dateStr = getTodayDateString(prevMonthDate);
    days.push({ dateStr, dayNum, isCurrentMonth: false });
  }

  // Current month days
  for (let i = 1; i <= daysInMonth; i++) {
    const d = new Date(year, month, i);
    const dateStr = getTodayDateString(d);
    days.push({ dateStr, dayNum: i, isCurrentMonth: true });
  }

  // Next month leading days to fill 35 or 42 grid cells
  const remainingCells = (7 - (days.length % 7)) % 7;
  for (let i = 1; i <= remainingCells; i++) {
    const nextMonthDate = new Date(year, month + 1, i);
    const dateStr = getTodayDateString(nextMonthDate);
    days.push({ dateStr, dayNum: i, isCurrentMonth: false });
  }

  const selectedDateTasks = tasksByDate.get(selectedDateStr) || [];

  return (
    <div className="space-y-6">
      {/* Calendar Card */}
      <div className="p-5 sm:p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        {/* Navigation Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-sky-50 dark:bg-sky-950/50 text-sky-600 dark:text-sky-400">
              <CalendarIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                {monthNames[month]} {year}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Interactive schedule & daily agenda
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleJumpToday}
              className="px-3 py-1.5 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Today
            </button>
            <div className="flex items-center rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
              <button
                type="button"
                onClick={handlePrevMonth}
                aria-label="Previous month"
                className="p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleNextMonth}
                aria-label="Next month"
                className="p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Days of Week Header */}
        <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-slate-400 dark:text-slate-500 mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
            <div key={d} className="py-1">
              {d}
            </div>
          ))}
        </div>

        {/* Dates Grid */}
        <div className="grid grid-cols-7 gap-1 sm:gap-1.5">
          {days.map((item) => {
            const isToday = item.dateStr === todayStr;
            const isSelected = item.dateStr === selectedDateStr;
            const dayTasks = tasksByDate.get(item.dateStr) || [];
            const hasTasks = dayTasks.length > 0;
            const completedCount = dayTasks.filter((t) => t.completed).length;

            return (
              <button
                key={item.dateStr}
                type="button"
                onClick={() => setSelectedDateStr(item.dateStr)}
                className={`min-h-[64px] sm:min-h-[78px] p-1.5 sm:p-2 rounded-xl text-left border flex flex-col justify-between transition-all relative ${
                  isSelected
                    ? 'border-sky-500 ring-2 ring-sky-500/20 bg-sky-50/50 dark:bg-sky-950/30'
                    : isToday
                    ? 'border-sky-300 dark:border-sky-700 bg-sky-50/20 dark:bg-sky-950/10'
                    : 'border-slate-100 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/30 dark:bg-slate-800/30'
                } ${
                  !item.isCurrentMonth
                    ? 'opacity-40'
                    : 'opacity-100'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span
                    className={`text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center ${
                      isToday
                        ? 'bg-sky-600 text-white shadow-xs'
                        : isSelected
                        ? 'text-sky-600 dark:text-sky-400'
                        : 'text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {item.dayNum}
                  </span>

                  {hasTasks && (
                    <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">
                      {completedCount}/{dayTasks.length}
                    </span>
                  )}
                </div>

                {/* Task Indicators */}
                <div className="w-full mt-1 space-y-0.5">
                  {dayTasks.slice(0, 2).map((task) => (
                    <div
                      key={task.id}
                      className={`text-[10px] px-1 py-0.5 rounded-sm truncate ${
                        task.completed
                          ? 'line-through text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800'
                          : 'text-sky-800 dark:text-sky-200 bg-sky-100/70 dark:bg-sky-900/40 font-medium'
                      }`}
                    >
                      {task.title}
                    </div>
                  ))}
                  {dayTasks.length > 2 && (
                    <span className="text-[9px] text-slate-400 dark:text-slate-500 block text-right pr-0.5">
                      +{dayTasks.length - 2} more
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Day Agenda Section */}
      <div className="p-5 sm:p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Tasks for {formatDisplayDate(selectedDateStr)}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {selectedDateStr} · {selectedDateTasks.length} task{selectedDateTasks.length === 1 ? '' : 's'} scheduled
            </p>
          </div>

          <button
            type="button"
            onClick={() => onAddTaskForDate(selectedDateStr)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 dark:bg-sky-500 dark:hover:bg-sky-600 rounded-xl transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4" />
            Add Task for This Date
          </button>
        </div>

        {selectedDateTasks.length === 0 ? (
          <div className="text-center py-8 text-slate-400 dark:text-slate-500 text-sm">
            <p>No tasks scheduled for {formatDisplayDate(selectedDateStr)}.</p>
            <button
              type="button"
              onClick={() => onAddTaskForDate(selectedDateStr)}
              className="mt-2 text-xs text-sky-600 dark:text-sky-400 font-semibold hover:underline"
            >
              + Create a new task for this day
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {selectedDateTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onToggleComplete={onToggleComplete}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
