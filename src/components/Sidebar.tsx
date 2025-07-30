import React from 'react';
import { useTaskStore } from '../stores/taskStore';

interface SidebarProps {
  className?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ className = '' }) => {
  const { lists, selectedListId, setSelectedList, tasks } = useTaskStore();

  // Calculate task counts for filters
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const next7Days = new Date();
  next7Days.setDate(today.getDate() + 7);
  next7Days.setHours(23, 59, 59, 999);

  const todayTasks = tasks.filter(task => {
    if (!task.dueDate) return false;
    const dueDate = new Date(task.dueDate);
    dueDate.setHours(0, 0, 0, 0);
    return dueDate.getTime() === today.getTime() && task.status !== 'completed';
  });

  const next7DaysTasks = tasks.filter(task => {
    if (!task.dueDate) return false;
    const dueDate = new Date(task.dueDate);
    return dueDate >= today && dueDate <= next7Days && task.status !== 'completed';
  });

  const allIncompleteTasks = tasks.filter(task => task.status !== 'completed');

  const handleListSelect = (listId: number) => {
    setSelectedList(listId);
  };

  return (
    <div className={`bg-card border-r border-border ${className}`}>
      <div className="p-4">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
          My Tasks
        </h2>
        
        {/* Quick Filters */}
        <div className="space-y-1 mb-6">
          <button
            className="w-full flex items-center justify-between px-3 py-2 text-sm rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
            onClick={() => setSelectedList(null)}
          >
            <div className="flex items-center gap-3">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <span>All Tasks</span>
            </div>
            <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded-full">
              {allIncompleteTasks.length}
            </span>
          </button>
          
          <button
            className="w-full flex items-center justify-between px-3 py-2 text-sm rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
            onClick={() => {
              // TODO: Implement today filter
              console.log('Today filter clicked');
            }}
          >
            <div className="flex items-center gap-3">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>Today</span>
            </div>
            <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded-full">
              {todayTasks.length}
            </span>
          </button>
          
          <button
            className="w-full flex items-center justify-between px-3 py-2 text-sm rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
            onClick={() => {
              // TODO: Implement next 7 days filter
              console.log('Next 7 days filter clicked');
            }}
          >
            <div className="flex items-center gap-3">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>Next 7 Days</span>
            </div>
            <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded-full">
              {next7DaysTasks.length}
            </span>
          </button>
        </div>

        {/* Lists */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Lists
            </h3>
            <button
              className="text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => {
                // TODO: Implement add list functionality
                console.log('Add list clicked');
              }}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>
          
          <div className="space-y-1">
            {lists.map((list) => {
              const listTasks = tasks.filter(task => task.listId === list.id && task.status !== 'completed');
              const isSelected = selectedListId === list.id;
              
              return (
                <button
                  key={list.id}
                  className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-md transition-colors ${
                    isSelected 
                      ? 'bg-accent text-accent-foreground' 
                      : 'hover:bg-accent hover:text-accent-foreground'
                  }`}
                  onClick={() => handleListSelect(list.id!)}
                >
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: list.color || '#3b82f6' }}
                    />
                    <span>{list.name}</span>
                  </div>
                  <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded-full">
                    {listTasks.length}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tags */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Tags
            </h3>
            <button
              className="text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => {
                // TODO: Implement add tag functionality
                console.log('Add tag clicked');
              }}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>
          
          <div className="space-y-1">
            {/* TODO: Implement tags when tag system is added */}
            <div className="text-sm text-muted-foreground px-3 py-2">
              No tags yet
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 