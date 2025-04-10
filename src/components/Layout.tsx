import React, { useEffect } from 'react';
import { ipcRenderer } from 'electron';
import { WindowControls } from './WindowControls';
import { useWindowStore } from '../stores/windowStore';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { isMaximized, setMaximized, setBounds } = useWindowStore();

  useEffect(() => {
    // Listen for window state changes
    const handleMaximize = () => setMaximized(true);
    const handleUnmaximize = () => setMaximized(false);
    const handleResize = () => {
      const bounds = ipcRenderer.sendSync('get-window-bounds');
      setBounds(bounds);
    };

    window.addEventListener('maximize', handleMaximize);
    window.addEventListener('unmaximize', handleUnmaximize);
    window.addEventListener('resize', handleResize);
    window.addEventListener('move', handleResize);

    return () => {
      window.removeEventListener('maximize', handleMaximize);
      window.removeEventListener('unmaximize', handleUnmaximize);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('move', handleResize);
    };
  }, [setMaximized, setBounds]);

  const handleMinimize = () => {
    ipcRenderer.send('window-minimize');
  };

  const handleMaximize = () => {
    ipcRenderer.send('window-maximize');
  };

  const handleClose = () => {
    ipcRenderer.send('window-close');
  };

  return (
    <div className="flex h-screen flex-col bg-background">
      {/* Title bar */}
      <div className="flex h-14 items-center justify-between border-b border-border bg-card">
        <div className="flex items-center px-4">
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
        <aside className="w-64 border-r border-border bg-card">
          <nav className="space-y-1 p-4">
            {/* Navigation items will go here */}
          </nav>
        </aside>

        {/* Content */}
        <main className="flex-1 overflow-auto">
          <div className="container mx-auto p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}; 