import { useEffect, useState } from 'react';
import { Layout } from './components/Layout';
import TaskList from './components/TaskList';
import { useSettingsStore } from './stores/settingsStore';
import { useTaskStore } from './stores/taskStore';

function App() {
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const checkAndMigrate = useSettingsStore(state => state.checkAndMigrate);
  const checkAndPerformBackup = useSettingsStore(state => state.checkAndPerformBackup);
  const { fetchTasks, fetchLists, createList, lists, selectedListId, setSelectedList } = useTaskStore();
  
  // Initialize the app
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Check and apply database migrations
        await checkAndMigrate();
        
        // Fetch tasks and lists
        await Promise.all([
          fetchTasks(),
          fetchLists()
        ]);
        
        // Check if backup is needed
        await checkAndPerformBackup();
        
        setIsInitialized(true);
      } catch (err) {
        console.error('Failed to initialize app:', err);
        setError((err as Error).message);
      }
    };
    
    initializeApp();
  }, [checkAndMigrate, fetchTasks, fetchLists, checkAndPerformBackup]);
  
  // Create default list and select it if no lists exist
  useEffect(() => {
    const ensureDefaultList = async () => {
      if (isInitialized && lists.length === 0) {
        try {
          await createList({
            name: 'My Tasks',
            color: '#3b82f6',
            icon: 'list',
            createdAt: new Date(),
            updatedAt: new Date(),
            order: 0,
          });
        } catch (err) {
          console.error('Failed to create default list:', err);
        }
      }
    };
    
    ensureDefaultList();
  }, [isInitialized, lists.length, createList]);
  
  // Auto-select the first list if none is selected
  useEffect(() => {
    if (isInitialized && lists.length > 0 && !selectedListId) {
      setSelectedList(lists[0].id!);
    }
  }, [isInitialized, lists, selectedListId, setSelectedList]);
  
  if (error) {
    return (
      <Layout>
        <div className="p-4 bg-red-100 text-red-800 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Error Initializing App</h2>
          <p>{error}</p>
        </div>
      </Layout>
    );
  }
  
  if (!isInitialized) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-lg">Initializing...</p>
          </div>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <TaskList />
    </Layout>
  );
}

export default App;
