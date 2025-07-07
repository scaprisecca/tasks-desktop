import Dexie from 'dexie';
import { db } from './database';
import { Task, TaskList, TaskWithList } from '../models/Task';

// Define migration types
export interface Migration {
  version: number;
  up: (db: Dexie) => Promise<void>;
  down: (db: Dexie) => Promise<void>;
}

// Define the current schema version
export const CURRENT_SCHEMA_VERSION = 1;

// Define migrations
const migrations: Migration[] = [
  {
    version: 1,
    up: async (db: Dexie) => {
      // Initial schema setup is handled by the TasksDatabase class
      // This is a placeholder for future migrations
    },
    down: async (db: Dexie) => {
      // This would revert the initial schema
      // For now, we'll just delete the database
      await db.delete();
    }
  }
];

// Migration service
export const migrationService = {
  /**
   * Check if migration is needed and apply if necessary
   */
  async checkAndMigrate(): Promise<void> {
    try {
      // Get the current version from localStorage
      const currentVersion = localStorage.getItem('dbSchemaVersion');
      const version = currentVersion ? parseInt(currentVersion, 10) : 0;
      
      // If we're already at the current version, no migration needed
      if (version === CURRENT_SCHEMA_VERSION) {
        return;
      }
      
      // Apply migrations in sequence
      for (let i = version; i < CURRENT_SCHEMA_VERSION; i++) {
        const migration = migrations.find(m => m.version === i + 1);
        if (migration) {
          console.log(`Applying migration to version ${migration.version}`);
          await migration.up(db);
        }
      }
      
      // Update the version in localStorage
      localStorage.setItem('dbSchemaVersion', CURRENT_SCHEMA_VERSION.toString());
      console.log(`Migration complete. Database is now at version ${CURRENT_SCHEMA_VERSION}`);
    } catch (error) {
      console.error('Migration failed:', error);
      throw error;
    }
  },
  
  /**
   * Reset the database to a specific version
   * This is mainly for testing and development
   */
  async resetToVersion(version: number): Promise<void> {
    if (version < 0 || version > CURRENT_SCHEMA_VERSION) {
      throw new Error(`Invalid version: ${version}`);
    }
    
    try {
      // Get the current version
      const currentVersion = localStorage.getItem('dbSchemaVersion');
      const current = currentVersion ? parseInt(currentVersion, 10) : 0;
      
      // If we need to go down in version
      if (current > version) {
        for (let i = current; i > version; i--) {
          const migration = migrations.find(m => m.version === i);
          if (migration) {
            console.log(`Reverting migration from version ${migration.version}`);
            await migration.down(db);
          }
        }
      } 
      // If we need to go up in version
      else if (current < version) {
        for (let i = current; i < version; i++) {
          const migration = migrations.find(m => m.version === i + 1);
          if (migration) {
            console.log(`Applying migration to version ${migration.version}`);
            await migration.up(db);
          }
        }
      }
      
      // Update the version in localStorage
      localStorage.setItem('dbSchemaVersion', version.toString());
      console.log(`Reset complete. Database is now at version ${version}`);
    } catch (error) {
      console.error('Reset failed:', error);
      throw error;
    }
  }
}; 