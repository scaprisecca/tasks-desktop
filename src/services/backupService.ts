import { db } from './database';
import { taskService } from './database';
import { TaskWithList, TaskList } from '../models/Task';
import { ipcRenderer } from 'electron';

// Define backup data structure
export interface BackupData {
  version: string;
  timestamp: string;
  tasks: TaskWithList[];
  lists: TaskList[];
  metadata: {
    appVersion: string;
    schemaVersion: number;
  };
}

// Backup service
export const backupService = {
  /**
   * Create a backup of the current database
   * @returns The backup data as a JSON string
   */
  async createBackup(): Promise<string> {
    try {
      // Get all tasks and lists
      const tasks = await taskService.getAllTasks();
      const lists = await taskService.getAllLists();
      
      // Create backup data
      const backupData: BackupData = {
        version: '1.0',
        timestamp: new Date().toISOString(),
        tasks,
        lists,
        metadata: {
          appVersion: process.env.npm_package_version || '0.0.0',
          schemaVersion: parseInt(localStorage.getItem('dbSchemaVersion') || '0', 10)
        }
      };
      
      // Convert to JSON
      return JSON.stringify(backupData, null, 2);
    } catch (error) {
      console.error('Backup creation failed:', error);
      throw error;
    }
  },
  
  /**
   * Save a backup to a file
   * @returns The path to the saved backup file
   */
  async saveBackupToFile(): Promise<string> {
    try {
      // Create backup data
      const backupData = await this.createBackup();
      
      // Generate filename with timestamp
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const filename = `tasks-backup-${timestamp}.json`;
      
      // Use Electron's dialog to save the file
      const result = await ipcRenderer.invoke('save-backup', {
        data: backupData,
        filename
      });
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to save backup');
      }
      
      return result.filePath;
    } catch (error) {
      console.error('Backup save failed:', error);
      throw error;
    }
  },
  
  /**
   * Restore data from a backup
   * @param backupData The backup data as a JSON string
   */
  async restoreFromBackup(backupData: string): Promise<void> {
    try {
      // Parse the backup data
      const data: BackupData = JSON.parse(backupData);
      
      // Validate the backup data
      if (!data.version || !data.tasks || !data.lists) {
        throw new Error('Invalid backup data format');
      }
      
      // Clear the current database
      await db.tasks.clear();
      await db.lists.clear();
      
      // Restore lists first (since tasks reference lists)
      for (const list of data.lists) {
        await taskService.createList(list);
      }
      
      // Then restore tasks
      for (const task of data.tasks) {
        await taskService.createTask(task);
      }
      
      console.log(`Restored ${data.tasks.length} tasks and ${data.lists.length} lists from backup`);
    } catch (error) {
      console.error('Restore failed:', error);
      throw error;
    }
  },
  
  /**
   * Load a backup from a file
   * @returns The backup data as a JSON string
   */
  async loadBackupFromFile(): Promise<string> {
    try {
      // Use Electron's dialog to open the file
      const result = await ipcRenderer.invoke('load-backup');
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to load backup');
      }
      
      return result.data;
    } catch (error) {
      console.error('Backup load failed:', error);
      throw error;
    }
  },
  
  /**
   * Restore from a backup file
   */
  async restoreFromBackupFile(): Promise<void> {
    try {
      // Load the backup data
      const backupData = await this.loadBackupFromFile();
      
      // Restore from the backup data
      await this.restoreFromBackup(backupData);
    } catch (error) {
      console.error('Restore from file failed:', error);
      throw error;
    }
  }
}; 