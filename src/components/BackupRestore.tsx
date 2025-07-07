import React, { useState } from 'react';
import { useSettingsStore, BackupFrequency } from '../stores/settingsStore';

const BackupRestore: React.FC = () => {
  const {
    backupEnabled,
    backupFrequency,
    lastBackupDate,
    setBackupEnabled,
    setBackupFrequency,
    createBackup,
    restoreFromBackup,
    checkAndPerformBackup
  } = useSettingsStore();

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);

  const handleBackupToggle = () => {
    setBackupEnabled(!backupEnabled);
    setMessage({ text: `Automatic backups ${!backupEnabled ? 'enabled' : 'disabled'}`, type: 'info' });
  };

  const handleFrequencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setBackupFrequency(e.target.value as BackupFrequency);
    setMessage({ text: `Backup frequency set to ${e.target.value}`, type: 'info' });
  };

  const handleCreateBackup = async () => {
    setIsLoading(true);
    setMessage(null);
    
    try {
      const filePath = await createBackup();
      setMessage({ text: `Backup created successfully at ${filePath}`, type: 'success' });
    } catch (error) {
      setMessage({ text: `Failed to create backup: ${(error as Error).message}`, type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRestoreBackup = async () => {
    if (!window.confirm('Are you sure you want to restore from a backup? This will replace all current data.')) {
      return;
    }
    
    setIsLoading(true);
    setMessage(null);
    
    try {
      await restoreFromBackup();
      setMessage({ text: 'Backup restored successfully', type: 'success' });
    } catch (error) {
      setMessage({ text: `Failed to restore backup: ${(error as Error).message}`, type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckBackup = async () => {
    setIsLoading(true);
    setMessage(null);
    
    try {
      await checkAndPerformBackup();
      setMessage({ text: 'Backup check completed', type: 'info' });
    } catch (error) {
      setMessage({ text: `Failed to check backup: ${(error as Error).message}`, type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Backup & Restore</h2>
      
      {/* Backup Settings */}
      <div className="mb-6">
        <div className="flex items-center mb-4">
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={backupEnabled}
              onChange={handleBackupToggle}
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">Enable Automatic Backups</span>
          </label>
        </div>
        
        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Backup Frequency</label>
          <select
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
            value={backupFrequency}
            onChange={handleFrequencyChange}
            disabled={!backupEnabled}
          >
            <option value="never">Never</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>
        
        {lastBackupDate && (
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Last backup: {new Date(lastBackupDate).toLocaleString()}
          </div>
        )}
      </div>
      
      {/* Backup Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleCreateBackup}
          disabled={isLoading}
        >
          {isLoading ? 'Creating...' : 'Create Backup Now'}
        </button>
        
        <button
          className="text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-green-600 dark:hover:bg-green-700 focus:outline-none dark:focus:ring-green-800 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleRestoreBackup}
          disabled={isLoading}
        >
          {isLoading ? 'Restoring...' : 'Restore from Backup'}
        </button>
        
        <button
          className="text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-purple-600 dark:hover:bg-purple-700 focus:outline-none dark:focus:ring-purple-800 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleCheckBackup}
          disabled={isLoading || !backupEnabled}
        >
          {isLoading ? 'Checking...' : 'Check for Backup'}
        </button>
      </div>
      
      {/* Message Display */}
      {message && (
        <div className={`mt-4 p-4 rounded-lg ${
          message.type === 'success' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
          message.type === 'error' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
          'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
        }`}>
          {message.text}
        </div>
      )}
    </div>
  );
};

export default BackupRestore; 