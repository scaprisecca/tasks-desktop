import React, { useEffect, useState } from 'react';
import { ipcRenderer } from 'electron';
import { WindowControls } from './WindowControls';
import { Sidebar } from './Sidebar';
import { TaskDetailPane } from './TaskDetailPane';
import { useWindowStore } from '../stores/windowStore';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { isMaximized, setMaximized, setBounds } = useWindowStore();
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);
  const [isTaskDetailVisible, setIsTaskDetailVisible] = useState(false);
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    // Listen for window state changes
    const handleMaximize = () => setMaximized(true);
    const handleUnmaximize = () => setMaximized(false);
    const handleResize = () => {
      const bounds = ipcRenderer.sendSync('get-window-bounds');
      setBounds(bounds);
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('maximize', handleMaximize);
    window.addEventListener('unmaximize', handleUnmaximize);
    window.addEventListener('resize', handleResize);
    window.addEventListener('move', handleResize);

    // Initial window width
    setWindowWidth(window.innerWidth);

    return () => {
      window.removeEventListener('maximize', handleMaximize);
      window.removeEventListener('unmaximize', handleUnmaximize);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('move', handleResize);
    };
  }, [setMaximized, setBounds]);

  // Handle task selection from child components
  const handleTaskSelect = (taskId: number | null) => {
    setSelectedTaskId(taskId);
    setIsTaskDetailVisible(!!taskId);
  };

  const handleCloseTaskDetail = () => {
    setSelectedTaskId(null);
    setIsTaskDetailVisible(false);
  };

  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  const handleMinimize = () => {
    ipcRenderer.send('window-minimize');
  };

  const handleMaximize = () => {
    ipcRenderer.send('window-maximize');
  };

  const handleClose = () => {
    ipcRenderer.send('window-close');
  };

  // Responsive behavior
  const isSmallScreen = windowWidth < 1024;
  const shouldShowSidebar = isSidebarVisible && (!isSmallScreen || !isTaskDetailVisible);
  const shouldShowTaskDetail = isTaskDetailVisible && (!isSmallScreen || selectedTaskId !== null);

  return (
    <div className="flex h-screen flex-col bg-background">
      {/* Title bar */}
      <div className="flex h-14 items-center justify-between border-b border-border bg-card">
        <div className="flex items-center px-4 gap-3">
          <button
            onClick={toggleSidebar}
            className="p-2 hover:bg-accent rounded-md transition-colors lg:hidden"
            aria-label="Toggle sidebar"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 className="text-lg font-semibold">Tasks.org</h1>
        </div>
        <WindowControls
          onMinimize={handleMinimize}
          onMaximize={handleMaximize}
          onClose={handleClose}
          isMaximized={isMaximized}
        />
      </div>

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        {shouldShowSidebar && (
          <Sidebar className={`${isSmallScreen ? 'absolute z-10 h-full' : ''} w-64 ${
            isSmallScreen ? 'shadow-lg' : ''
          }`} />
        )}

        {/* Center pane - TaskList */}
        <main className={`flex-1 overflow-hidden bg-background ${
          shouldShowTaskDetail ? 'border-r border-border' : ''
        } ${
          isSmallScreen && shouldShowSidebar ? 'hidden' : ''
        }`}>
          {React.cloneElement(children as React.ReactElement, {
            onTaskSelect: handleTaskSelect,
            selectedTaskId,
          })}
        </main>

        {/* Right pane - Task detail */}
        {shouldShowTaskDetail && (
          <TaskDetailPane
            selectedTaskId={selectedTaskId}
            onClose={handleCloseTaskDetail}
            className={`${isSmallScreen ? 'absolute right-0 top-0 h-full z-20 shadow-lg' : ''} ${
              isSmallScreen ? 'w-full' : 'w-80'
            }`}
          />
        )}
      </div>

      {/* Overlay for mobile when sidebar is open */}
      {isSmallScreen && shouldShowSidebar && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-5"
          onClick={toggleSidebar}
          aria-label="Close sidebar"
        />
      )}
    </div>
  );
}; 