import React, { useEffect, useState, useMemo } from 'react';
import { useTaskStore } from '../stores/taskStore';
import { TaskWithList } from '../models/Task';
import type { TaskList as TaskListType } from '../models/Task';
import { format } from 'date-fns';

type SortField = 'title' | 'dueDate' | 'priority' | 'status';
type SortOrder = 'asc' | 'desc';
type FilterStatus = 'all' | 'todo' | 'in-progress' | 'completed';

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'high':
      return 'bg-red-100 text-red-800';
    case 'medium':
      return 'bg-yellow-100 text-yellow-800';
    case 'low':
      return 'bg-green-100 text-green-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'completed':
      return 'bg-green-100 text-green-800';
    case 'in-progress':
      return 'bg-blue-100 text-blue-800';
    case 'todo':
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const TaskList: React.FC = () => {
  const {
    tasks,
    lists,
    selectedListId,
    isLoading,
    error,
    fetchTasks,
    fetchLists,
    createTask,
    updateTask,
    deleteTask,
    setSelectedList,
  } = useTaskStore();

  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [editingTask, setEditingTask] = useState<TaskWithList | null>(null);
  const [sortField, setSortField] = useState<SortField>('dueDate');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');

  useEffect(() => {
    fetchTasks();
    fetchLists();
  }, [fetchTasks, fetchLists]);

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim() || !selectedListId) return;

    const newTask: Omit<TaskWithList, 'id'> = {
      title: newTaskTitle,
      priority: 'medium',
      status: 'todo',
      createdAt: new Date(),
      updatedAt: new Date(),
      order: tasks.length,
      listId: selectedListId,
    };

    await createTask(newTask);
    setNewTaskTitle('');
  };

  const handleUpdateTask = async (task: TaskWithList | null) => {
    if (!task || !task.id) return;
    await updateTask(task.id, {
      ...task,
      updatedAt: new Date(),
    });
    setEditingTask(null);
  };

  const handleDeleteTask = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      await deleteTask(id);
    }
  };

  const filteredAndSortedTasks = useMemo(() => {
    let filtered = tasks.filter((task) => task.listId === selectedListId);
    
    // Apply status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter((task) => task.status === filterStatus);
    }

    // Apply sorting
    return filtered.sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'dueDate':
          comparison = (a.dueDate?.getTime() || 0) - (b.dueDate?.getTime() || 0);
          break;
        case 'priority': {
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          comparison = priorityOrder[a.priority] - priorityOrder[b.priority];
          break;
        }
        case 'status': {
          const statusOrder = { 'todo': 1, 'in-progress': 2, 'completed': 3 };
          comparison = statusOrder[a.status] - statusOrder[b.status];
          break;
        }
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });
  }, [tasks, selectedListId, sortField, sortOrder, filterStatus]);

  const handleKeyDown = (e: React.KeyboardEvent, task: TaskWithList) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setEditingTask(task);
    } else if (e.key === 'Delete' || e.key === 'Backspace') {
      e.preventDefault();
      handleDeleteTask(task.id!);
    }
  };

  const handleEditKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      setEditingTask(null);
    } else if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleUpdateTask(editingTask);
    }
  };

  if (isLoading) {
    return <div className="p-4">Loading...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <select
          value={selectedListId || ''}
          onChange={(e) => setSelectedList(Number(e.target.value) || null)}
          className="w-full p-2 border rounded"
        >
          <option value="">Select a list</option>
          {lists.map((list) => (
            <option key={list.id} value={list.id}>
              {list.name}
            </option>
          ))}
        </select>
      </div>

      <div className="p-4 border-b flex gap-4">
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as FilterStatus)}
          className="p-2 border rounded"
        >
          <option value="all">All Tasks</option>
          <option value="todo">To Do</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>

        <select
          value={sortField}
          onChange={(e) => setSortField(e.target.value as SortField)}
          className="p-2 border rounded"
        >
          <option value="title">Title</option>
          <option value="dueDate">Due Date</option>
          <option value="priority">Priority</option>
          <option value="status">Status</option>
        </select>

        <button
          onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
          className="p-2 border rounded"
          aria-label={`Sort ${sortOrder === 'asc' ? 'descending' : 'ascending'}`}
        >
          {sortOrder === 'asc' ? '↑' : '↓'}
        </button>
      </div>

      <div className="flex-1 overflow-auto p-4">
        {selectedListId ? (
          <>
            <form onSubmit={handleCreateTask} className="mb-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  placeholder="Add a new task..."
                  className="flex-1 p-2 border rounded"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Add
                </button>
              </div>
            </form>

            <div className="space-y-2" role="list">
              {filteredAndSortedTasks.map((task) => (
                <div
                  key={task.id}
                  className="p-4 border rounded-lg hover:bg-gray-50 transition-colors duration-200"
                  role="listitem"
                  tabIndex={0}
                  onKeyDown={(e) => handleKeyDown(e, task)}
                  aria-label={`Task: ${task.title}, Priority: ${task.priority}, Status: ${task.status}`}
                >
                  {editingTask?.id === task.id ? (
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={editingTask?.title ?? ''}
                        onChange={(e) => {
                          if (editingTask) {
                            setEditingTask({
                              ...editingTask,
                              title: e.target.value,
                            });
                          }
                        }}
                        onKeyDown={handleEditKeyDown}
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        aria-label="Edit task title"
                        autoFocus
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleUpdateTask(editingTask)}
                          className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition-colors duration-200"
                          aria-label="Save task changes"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingTask(null)}
                          className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors duration-200"
                          aria-label="Cancel editing"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium text-lg">{task.title}</h3>
                          <span 
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}
                            role="status"
                            aria-label={`Priority: ${task.priority}`}
                          >
                            {task.priority}
                          </span>
                          <span 
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}
                            role="status"
                            aria-label={`Status: ${task.status}`}
                          >
                            {task.status}
                          </span>
                        </div>
                        {task.description && (
                          <p className="text-sm text-gray-600 mb-2">
                            {task.description}
                          </p>
                        )}
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          {task.dueDate && (
                            <div className="flex items-center gap-1">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              <span>Due: {format(task.dueDate, 'PPP')}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>Created: {format(task.createdAt, 'PPP')}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setEditingTask(task)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors duration-200"
                          aria-label={`Edit task: ${task.title}`}
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDeleteTask(task.id!)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors duration-200"
                          aria-label={`Delete task: ${task.title}`}
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center text-gray-500">
            Select a list to view tasks
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskList; 