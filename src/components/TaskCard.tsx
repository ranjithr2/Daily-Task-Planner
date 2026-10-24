import React, { useState } from 'react';
import {
  Check,
  Clock,
  Calendar,
  AlertTriangle,
  Pencil,
  Trash2,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { Task } from '../types/task';
import {
  formatDisplayDate,
  formatDisplayTime,
  isTaskOverdue,
  getCategoryMeta,
  getPriorityMeta,
} from '../utils/taskLogic';

interface TaskCardProps {
  task: Task;
  onToggleComplete: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onToggleComplete,
  onEdit,
  onDelete,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const overdue = isTaskOverdue(task);
  const catMeta = getCategoryMeta(task.category);
  const priMeta = getPriorityMeta(task.priority);

  return (
    <div
      className={`group relative rounded-2xl border p-4 sm:p-5 transition-all duration-200 bg-white dark:bg-slate-900 ${
        task.completed
          ? 'border-slate-200 dark:border-slate-800/80 bg-slate-50/40 dark:bg-slate-900/40 opacity-75'
          : overdue
          ? 'border-rose-200 dark:border-rose-900/50 hover:border-rose-300 dark:hover:border-rose-800'
          : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-xs'
      }`}
    >
      <div className="flex items-start gap-3.5">
        {/* Accessible Checkbox */}
        <button
          type="button"
          role="checkbox"
          aria-checked={task.completed}
          aria-label={task.completed ? `Mark "${task.title}" as incomplete` : `Mark "${task.title}" as completed`}
          onClick={() => onToggleComplete(task.id)}
          className={`mt-0.5 shrink-0 w-5 h-5 rounded-md border flex items-center justify-center transition-colors focus:outline-hidden focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900 ${
            task.completed
              ? 'bg-emerald-600 border-emerald-600 text-white'
              : 'border-slate-300 dark:border-slate-600 hover:border-sky-500 dark:hover:border-sky-400 bg-transparent'
          }`}
        >
          {task.completed && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
        </button>

        {/* Task content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3
              onClick={() => setIsExpanded(!isExpanded)}
              className={`text-sm sm:text-base font-semibold leading-snug cursor-pointer transition-colors ${
                task.completed
                  ? 'line-through text-slate-400 dark:text-slate-500'
                  : 'text-slate-900 dark:text-slate-100 hover:text-sky-600 dark:hover:text-sky-400'
              }`}
            >
              {task.title}
            </h3>

            {/* Actions Toolbar */}
            <div className="flex items-center gap-1 shrink-0 opacity-80 sm:opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                type="button"
                onClick={() => onEdit(task)}
                aria-label={`Edit "${task.title}"`}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <Pencil className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => onDelete(task)}
                aria-label={`Delete "${task.title}"`}
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Description preview or expanded */}
          {task.description && (
            <div className="mt-1">
              <p
                className={`text-xs text-slate-500 dark:text-slate-400 leading-relaxed ${
                  isExpanded ? '' : 'line-clamp-2'
                }`}
              >
                {task.description}
              </p>
              {task.description.length > 90 && (
                <button
                  type="button"
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="mt-0.5 inline-flex items-center gap-0.5 text-xs font-medium text-sky-600 dark:text-sky-400 hover:underline"
                >
                  {isExpanded ? (
                    <>
                      Show less <ChevronUp className="w-3 h-3" />
                    </>
                  ) : (
                    <>
                      Show more <ChevronDown className="w-3 h-3" />
                    </>
                  )}
                </button>
              )}
            </div>
          )}

          {/* Zero-Pill Unboxed Metadata with Typographic Separators */}
          <div className="flex flex-wrap items-center gap-y-1 gap-x-2.5 mt-2.5 text-xs text-slate-500 dark:text-slate-400">
            {/* Category */}
            <span className="inline-flex items-center gap-1.5 font-medium">
              <span className={`w-1.5 h-1.5 rounded-full ${catMeta.dotColor}`} />
              <span className={catMeta.textColor}>{catMeta.label}</span>
            </span>

            <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>

            {/* Priority */}
            <span className="inline-flex items-center gap-1.5">
              <span className={`w-1.5 h-1.5 rounded-full ${priMeta.dotColor}`} />
              <span className={priMeta.textColor}>{priMeta.label}</span>
            </span>

            <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>

            {/* Due date */}
            <span className="inline-flex items-center gap-1">
              <Calendar className="w-3 h-3 text-slate-400" />
              <span>{formatDisplayDate(task.dueDate)}</span>
            </span>

            {/* Due time if present */}
            {task.dueTime && (
              <>
                <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>
                <span className="inline-flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-400" />
                  <span>{formatDisplayTime(task.dueTime)}</span>
                </span>
              </>
            )}

            {/* Overdue alert */}
            {overdue && (
              <>
                <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>
                <span className="inline-flex items-center gap-1 text-rose-600 dark:text-rose-400 font-semibold">
                  <AlertTriangle className="w-3 h-3" />
                  <span>Overdue</span>
                </span>
              </>
            )}

            {/* Completed timestamp */}
            {task.completed && task.completedAt && (
              <>
                <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                  Done
                </span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
