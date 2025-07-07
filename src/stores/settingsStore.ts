import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { backupService } from '../services/backupService';
import { migrationService } from '../services/migrationService';

// Define backup frequency options
export type BackupFrequency = 'never' | 'daily' | 'weekly' | 'monthly';

// Define settings interface
interface SettingsState {
  // Theme settings
  theme: 'light' | 'dark' | 'system';
  
  // Backup settings
  backupEnabled: boolean;
  backupFrequency: BackupFrequency;
  lastBackupDate: string | null;
  backupDirectory: string | null;
  
  // Actions
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  setBackupEnabled: (enabled: boolean) => void;
  setBackupFrequency: (frequency: BackupFrequency) => void;
  setBackupDirectory: (directory: string | null) => void;
  
  // Backup actions
  createBackup: () => Promise<string>;
  restoreFromBackup: () => Promise<void>;
  checkAndPerformBackup: () => Promise<void>;
  
  // Migration actions
  checkAndMigrate: () => Promise<void>;
}

// Create the settings store
export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      // Initial state
      theme: 'system',
      backupEnabled: false,
      backupFrequency: 'never',
      lastBackupDate: null,
      backupDirectory: null,
      
      // Theme actions
      setTheme: (theme) => set({ theme }),
      
      // Backup settings actions
      setBackupEnabled: (enabled) => set({ backupEnabled: enabled }),
      setBackupFrequency: (frequency) => set({ backupFrequency: frequency }),
      setBackupDirectory: (directory) => set({ backupDirectory: directory }),
      
      // Backup actions
      createBackup: async () => {
        try {
          const filePath = await backupService.saveBackupToFile();
          set({ lastBackupDate: new Date().toISOString() });
          return filePath;
        } catch (error) {
          console.error('Failed to create backup:', error);
          throw error;
        }
      },
      
      restoreFromBackup: async () => {
        try {
          await backupService.restoreFromBackupFile();
        } catch (error) {
          console.error('Failed to restore from backup:', error);
          throw error;
        }
      },
      
      checkAndPerformBackup: async () => {
        const { backupEnabled, backupFrequency, lastBackupDate } = get();
        
        // If backups are disabled, do nothing
        if (!backupEnabled || backupFrequency === 'never') {
          return;
        }
        
        // If we've never done a backup, do one now
        if (!lastBackupDate) {
          await get().createBackup();
          return;
        }
        
        // Check if it's time for a backup based on frequency
        const lastBackup = new Date(lastBackupDate);
        const now = new Date();
        
        let shouldBackup = false;
        
        switch (backupFrequency) {
          case 'daily':
            shouldBackup = now.getDate() !== lastBackup.getDate() || 
                          now.getMonth() !== lastBackup.getMonth() || 
                          now.getFullYear() !== lastBackup.getFullYear();
            break;
          case 'weekly':
            // Check if it's been at least 7 days
            const daysSinceLastBackup = Math.floor((now.getTime() - lastBackup.getTime()) / (1000 * 60 * 60 * 24));
            shouldBackup = daysSinceLastBackup >= 7;
            break;
          case 'monthly':
            shouldBackup = now.getMonth() !== lastBackup.getMonth() || 
                          now.getFullYear() !== lastBackup.getFullYear();
            break;
        }
        
        if (shouldBackup) {
          await get().createBackup();
        }
      },
      
      // Migration actions
      checkAndMigrate: async () => {
        try {
          await migrationService.checkAndMigrate();
        } catch (error) {
          console.error('Failed to check and migrate database:', error);
          throw error;
        }
      }
    }),
    {
      name: 'settings-storage',
      partialize: (state) => ({
        theme: state.theme,
        backupEnabled: state.backupEnabled,
        backupFrequency: state.backupFrequency,
        lastBackupDate: state.lastBackupDate,
        backupDirectory: state.backupDirectory
      })
    }
  )
); 