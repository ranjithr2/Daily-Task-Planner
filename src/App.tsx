/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  Plus,
  CheckCircle2,
  Calendar,
  Search,
  FilterX,
  Sparkles,
} from 'lucide-react';

import {
  Task,
  TaskView,
  TaskCategory,
  TaskFilterState,
  ToastMessage,
} from './types/task';
import {
  getTodayDateString,
  calculateTaskStats,
  filterAndSortTasks,
} from './utils/taskLogic';
import {
  loadTasksFromStorage,
  saveTasksToStorage,
  resetStorageToSampleTasks,
  clearAllStorageTasks,
  loadThemePreference,
  saveThemePreference,
} from './utils/storage';

import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { StatsCards } from './components/StatsCards';
import { FilterBar } from './components/FilterBar';
import { TaskCard } from './components/TaskCard';
import { TaskModal } from './components/TaskModal';
import { RightPanel } from './components/RightPanel';
import { CalendarView } from './components/CalendarView';
import { ConfirmModal } from './components/ConfirmModal';
import { ToastContainer } from './components/Toast';

export default function App() {
  // 1. Persistent State
  const [tasks, setTasks] = useState<Task[]>(() => loadTasksFromStorage());
  const [theme, setTheme] = useState<'light' | 'dark'>(() => loadThemePreference());

  // 2. Navigation & Filter State
  const [currentView, setCurrentView] = useState<TaskView>('today');
  const [selectedCategory, setSelectedCategory] = useState<TaskCategory | null>(null);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const [filters, setFilters] = useState<TaskFilterState>({
    search: '',
    category: 'all',
    priority: 'all',
    status: 'all',
    sortBy: 'dueDateAsc',
  });

  // Sync category filter with selectedCategory in sidebar
  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      category: selectedCategory || 'all',
    }));
  }, [selectedCategory]);

  // 3. Modals & Dialogs State
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [modalDefaultDate, setModalDefaultDate] = useState<string | undefined>(undefined);

  const [confirmConfig, setConfirmConfig] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    confirmLabel?: string;
    confirmVariant?: 'danger' | 'primary';
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });

  // 4. Toast Notifications
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = (type: 'success' | 'info' | 'error', message: string) => {
    const id = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    setToasts((prev) => [...prev, { id, type, message }]);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // 5. Theme management
  useEffect(() => {
    saveThemePreference(theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  // 6. Persistence on task change
  useEffect(() => {
    saveTasksToStorage(tasks);
  }, [tasks]);

  // 7. Computed Stats
  const todayStr = getTodayDateString();
  const stats = useMemo(() => calculateTaskStats(tasks, todayStr), [tasks, todayStr]);

  // 8. Filtered and Sorted Tasks for Current View
  const filteredTasks = useMemo(() => {
    return filterAndSortTasks(tasks, currentView, filters, todayStr);
  }, [tasks, currentView, filters, todayStr]);

  const isFiltered =
    filters.search.trim().length > 0 ||
    filters.category !== 'all' ||
    filters.priority !== 'all' ||
    filters.status !== 'all' ||
    filters.sortBy !== 'dueDateAsc';

  const resetFilters = () => {
    setSelectedCategory(null);
    setFilters({
      search: '',
      category: 'all',
      priority: 'all',
      status: 'all',
      sortBy: 'dueDateAsc',
    });
  };

  // 9. Task Actions
  const handleToggleComplete = (id: string) => {
    let completedState = false;
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          completedState = !t.completed;
          return {
            ...t,
            completed: completedState,
            completedAt: completedState ? new Date().toISOString() : undefined,
            updatedAt: new Date().toISOString(),
          };
        }
        return t;
      })
    );

    const task = tasks.find((t) => t.id === id);
    if (completedState) {
      showToast('success', `Completed "${task?.title || 'Task'}"! Great job!`);
    } else {
      showToast('info', `Reopened "${task?.title || 'Task'}"`);
    }
  };

  const handleSaveTask = (
    data: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'completed' | 'completedAt'> & { id?: string }
  ) => {
    if (data.id) {
      // Editing existing task
      setTasks((prev) =>
        prev.map((t) => {
          if (t.id === data.id) {
            return {
              ...t,
              title: data.title,
              description: data.description,
              dueDate: data.dueDate,
              dueTime: data.dueTime,
              priority: data.priority,
              category: data.category,
              updatedAt: new Date().toISOString(),
            };
          }
          return t;
        })
      );
      showToast('success', `Task "${data.title}" updated`);
    } else {
      // Adding new task
      const newTask: Task = {
        id: `task-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        title: data.title,
        description: data.description,
        dueDate: data.dueDate,
        dueTime: data.dueTime,
        priority: data.priority,
        category: data.category,
        completed: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setTasks((prev) => [newTask, ...prev]);
      showToast('success', `Task "${data.title}" added to your planner`);
    }

    setIsTaskModalOpen(false);
    setEditingTask(null);
    setModalDefaultDate(undefined);
  };

  const handleOpenAddTask = (defaultDate?: string) => {
    setEditingTask(null);
    setModalDefaultDate(defaultDate || (currentView === 'today' ? todayStr : undefined));
    setIsTaskModalOpen(true);
  };

  const handleOpenEditTask = (task: Task) => {
    setEditingTask(task);
    setIsTaskModalOpen(true);
  };

  const handleDeleteTask = (task: Task) => {
    setConfirmConfig({
      isOpen: true,
      title: 'Delete Task',
      message: `Are you sure you want to delete "${task.title}"? This action cannot be undone.`,
      confirmLabel: 'Delete Task',
      confirmVariant: 'danger',
      onConfirm: () => {
        setTasks((prev) => prev.filter((t) => t.id !== task.id));
        setConfirmConfig((prev) => ({ ...prev, isOpen: false }));
        showToast('info', `Task "${task.title}" deleted`);
      },
    });
  };

  const handleResetSampleData = () => {
    setConfirmConfig({
      isOpen: true,
      title: 'Reset Demo Tasks',
      message: 'This will restore the recommended set of sample tasks for study, work, and personal activities.',
      confirmLabel: 'Reset Sample Data',
      confirmVariant: 'primary',
      onConfirm: () => {
        const seed = resetStorageToSampleTasks();
        setTasks(seed);
        resetFilters();
        setConfirmConfig((prev) => ({ ...prev, isOpen: false }));
        showToast('success', 'Sample tasks restored successfully');
      },
    });
  };

  const handleClearAllTasks = () => {
    setConfirmConfig({
      isOpen: true,
      title: 'Clear All Tasks',
      message: 'Are you sure you want to delete all tasks in your planner? This will erase your task history.',
      confirmLabel: 'Clear All',
      confirmVariant: 'danger',
      onConfirm: () => {
        clearAllStorageTasks();
        setTasks([]);
        resetFilters();
        setConfirmConfig((prev) => ({ ...prev, isOpen: false }));
        showToast('info', 'All tasks have been cleared');
      },
    });
  };

  const handleExportTasks = () => {
    try {
      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(tasks, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', dataStr);
      downloadAnchor.setAttribute('download', `daily-task-planner-backup-${todayStr}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      showToast('success', 'Planner backup downloaded successfully');
    } catch {
      showToast('error', 'Failed to export tasks backup');
    }
  };

  const handleImportTasks = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const parsed = JSON.parse(content);
        if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].title) {
          setTasks(parsed);
          showToast('success', `Successfully imported ${parsed.length} tasks!`);
        } else {
          showToast('error', 'Invalid task backup file format');
        }
      } catch {
        showToast('error', 'Error reading JSON backup file');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className={`min-h-screen flex bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors ${theme === 'dark' ? 'dark' : ''}`}>
      {/* 1. Left Sidebar Navigation */}
      <Sidebar
        currentView={currentView}
        selectedCategory={selectedCategory}
        onSelectView={(v) => {
          setCurrentView(v);
          if (v !== 'calendar') {
            setFilters((prev) => ({ ...prev, status: 'all' }));
          }
        }}
        onSelectCategory={(c) => {
          setSelectedCategory(c);
        }}
        tasks={tasks}
        onResetSampleData={handleResetSampleData}
        onClearAllTasks={handleClearAllTasks}
        onExportTasks={handleExportTasks}
        onImportTasks={handleImportTasks}
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* 2. Main Content Wrapper */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <Header
          currentView={currentView}
          selectedCategory={selectedCategory}
          onOpenAddTask={() => handleOpenAddTask()}
          theme={theme}
          onToggleTheme={toggleTheme}
          onToggleMobileSidebar={() => setIsMobileSidebarOpen(true)}
        />

        {/* Scrollable Workspace */}
        <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
          {/* Dashboard Metric Stat Cards */}
          <StatsCards
            stats={stats}
            activeStatusFilter={filters.status}
            onSelectStatusFilter={(status) => {
              setFilters((prev) => ({ ...prev, status }));
            }}
          />

          {/* Main Layout Grid: Left Content + Right Panel */}
          {currentView === 'calendar' ? (
            /* Full Calendar View */
            <CalendarView
              tasks={tasks}
              onToggleComplete={handleToggleComplete}
              onEdit={handleOpenEditTask}
              onDelete={handleDeleteTask}
              onAddTaskForDate={(dateStr) => handleOpenAddTask(dateStr)}
            />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
              {/* Left / Center: Filter Bar + Tasks List */}
              <div className="lg:col-span-2 space-y-4">
                {/* Search & Filter Bar */}
                <FilterBar
                  filters={filters}
                  onChange={setFilters}
                  onReset={resetFilters}
                  isFiltered={isFiltered}
                  totalFilteredCount={filteredTasks.length}
                />

                {/* Tasks List */}
                {filteredTasks.length === 0 ? (
                  /* Clean, helpful empty state */
                  <div className="p-8 sm:p-12 text-center bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 mx-auto flex items-center justify-center">
                      {isFiltered ? <FilterX className="w-6 h-6" /> : <CheckCircle2 className="w-6 h-6" />}
                    </div>

                    <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
                      {isFiltered
                        ? 'No tasks match your current filters'
                        : currentView === 'completed'
                        ? 'No completed tasks yet'
                        : currentView === 'today'
                        ? 'No tasks scheduled for today'
                        : 'No tasks found in this view'}
                    </h3>

                    <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto leading-relaxed">
                      {isFiltered
                        ? 'Try clearing the search query or adjusting your category/priority filter options.'
                        : currentView === 'today'
                        ? 'Enjoy a clear schedule, or add priority goals for today to maintain steady momentum.'
                        : 'Start adding tasks to track your schedule, deadlines, and accomplishments.'}
                    </p>

                    <div className="pt-2 flex items-center justify-center gap-3">
                      {isFiltered ? (
                        <button
                          type="button"
                          onClick={resetFilters}
                          className="px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors"
                        >
                          Clear Filters
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleOpenAddTask()}
                          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 dark:bg-sky-500 dark:hover:bg-sky-600 rounded-xl shadow-xs transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                          Add Task
                        </button>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {filteredTasks.map((task) => (
                      <TaskCard
                        key={task.id}
                        task={task}
                        onToggleComplete={handleToggleComplete}
                        onEdit={handleOpenEditTask}
                        onDelete={handleDeleteTask}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Right: Progress & Upcoming Deadlines Panel */}
              <div className="lg:col-span-1">
                <RightPanel
                  stats={stats}
                  tasks={tasks}
                  onSelectTask={(task) => handleOpenEditTask(task)}
                  onAddTask={() => handleOpenAddTask()}
                  onNavigateToCalendar={() => setCurrentView('calendar')}
                />
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Task Creation / Edit Modal */}
      <TaskModal
        isOpen={isTaskModalOpen}
        initialTask={editingTask}
        defaultDate={modalDefaultDate}
        onSave={handleSaveTask}
        onClose={() => {
          setIsTaskModalOpen(false);
          setEditingTask(null);
          setModalDefaultDate(undefined);
        }}
      />

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={confirmConfig.isOpen}
        title={confirmConfig.title}
        message={confirmConfig.message}
        confirmLabel={confirmConfig.confirmLabel}
        confirmVariant={confirmConfig.confirmVariant}
        onConfirm={confirmConfig.onConfirm}
        onCancel={() => setConfirmConfig((prev) => ({ ...prev, isOpen: false }))}
      />

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
