import React, { useState, useEffect } from 'react';
import { useTaskStore } from '../stores/taskStore';
import { TaskWithList } from '../models/Task';
import { format } from 'date-fns';

interface TaskDetailPaneProps {
  selectedTaskId: number | null;
  onClose: () => void;
  className?: string;
}

export const TaskDetailPane: React.FC<TaskDetailPaneProps> = ({ 
  selectedTaskId, 
  onClose, 
  className = '' 
}) => {
  const { tasks, lists, updateTask, deleteTask } = useTaskStore();
  const [editedTask, setEditedTask] = useState<TaskWithList | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Find the selected task
  const selectedTask = selectedTaskId ? tasks.find(task => task.id === selectedTaskId) : null;

  // Update editedTask when selectedTask changes
  useEffect(() => {
    if (selectedTask) {
      setEditedTask({ ...selectedTask });
    } else {
      setEditedTask(null);
    }
  }, [selectedTask]);

  const handleSave = async () => {
    if (!editedTask || !editedTask.id) return;
    
    setIsSaving(true);
    try {
      await updateTask(editedTask.id, {
        ...editedTask,
        updatedAt: new Date(),
      });
    } catch (error) {
      console.error('Failed to save task:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!editedTask || !editedTask.id) return;
    
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await deleteTask(editedTask.id);
        onClose();
      } catch (error) {
        console.error('Failed to delete task:', error);
      }
    }
  };

  const handleFieldChange = (field: keyof TaskWithList, value: any) => {
    if (!editedTask) return;
    
    setEditedTask({
      ...editedTask,
      [field]: value,
    });
  };

  const formatDateForInput = (date: Date | undefined) => {
    if (!date) return '';
    return format(new Date(date), 'yyyy-MM-dd');
  };

  const parseDateFromInput = (dateString: string) => {
    return dateString ? new Date(dateString) : undefined;
  };

  if (!selectedTask || !editedTask) {
    return (
      <div className={`bg-card border-l border-border ${className}`}>
        <div className="p-4 h-full flex items-center justify-center">
          <div className="text-center text-muted-foreground">
            <svg className="w-12 h-12 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p>Select a task to view details</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-card border-l border-border ${className}`}>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-lg font-semibold">Task Details</h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Close task details"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-4 space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium mb-2">Title</label>
            <input
              type="text"
              value={editedTask.title}
              onChange={(e) => handleFieldChange('title', e.target.value)}
              className="w-full p-3 border border-input rounded-md focus:ring-2 focus:ring-ring focus:border-ring"
              placeholder="Task title"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              value={editedTask.description || ''}
              onChange={(e) => handleFieldChange('description', e.target.value)}
              className="w-full p-3 border border-input rounded-md focus:ring-2 focus:ring-ring focus:border-ring"
              rows={4}
              placeholder="Task description"
            />
          </div>

          {/* List */}
          <div>
            <label className="block text-sm font-medium mb-2">List</label>
            <select
              value={editedTask.listId}
              onChange={(e) => handleFieldChange('listId', Number(e.target.value))}
              className="w-full p-3 border border-input rounded-md focus:ring-2 focus:ring-ring focus:border-ring"
            >
              {lists.map((list) => (
                <option key={list.id} value={list.id}>
                  {list.name}
                </option>
              ))}
            </select>
          </div>

          {/* Priority and Status */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Priority</label>
              <select
                value={editedTask.priority}
                onChange={(e) => handleFieldChange('priority', e.target.value as 'low' | 'medium' | 'high')}
                className="w-full p-3 border border-input rounded-md focus:ring-2 focus:ring-ring focus:border-ring"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Status</label>
              <select
                value={editedTask.status}
                onChange={(e) => handleFieldChange('status', e.target.value as 'todo' | 'in-progress' | 'completed')}
                className="w-full p-3 border border-input rounded-md focus:ring-2 focus:ring-ring focus:border-ring"
              >
                <option value="todo">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Start Date</label>
              <input
                type="date"
                value={formatDateForInput(editedTask.startDate)}
                onChange={(e) => handleFieldChange('startDate', parseDateFromInput(e.target.value))}
                className="w-full p-3 border border-input rounded-md focus:ring-2 focus:ring-ring focus:border-ring"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Due Date</label>
              <input
                type="date"
                value={formatDateForInput(editedTask.dueDate)}
                onChange={(e) => handleFieldChange('dueDate', parseDateFromInput(e.target.value))}
                className="w-full p-3 border border-input rounded-md focus:ring-2 focus:ring-ring focus:border-ring"
              />
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium mb-2">Location</label>
            <input
              type="text"
              value={editedTask.location || ''}
              onChange={(e) => handleFieldChange('location', e.target.value)}
              className="w-full p-3 border border-input rounded-md focus:ring-2 focus:ring-ring focus:border-ring"
              placeholder="Task location"
            />
          </div>

          {/* Metadata */}
          <div className="pt-4 border-t border-border">
            <h3 className="text-sm font-medium text-muted-foreground mb-3">Metadata</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div>Created: {format(new Date(editedTask.createdAt), 'PPpp')}</div>
              <div>Updated: {format(new Date(editedTask.updatedAt), 'PPpp')}</div>
              <div>Order: {editedTask.order}</div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border">
          <div className="flex gap-3">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2 rounded-md font-medium transition-colors"
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
            <button
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 px-4 py-2 rounded-md font-medium transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}; 