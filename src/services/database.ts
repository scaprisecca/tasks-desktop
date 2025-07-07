import Dexie, { Table } from 'dexie';
import { Task, TaskList, TaskWithList } from '../models/Task';

export class TasksDatabase extends Dexie {
  tasks!: Table<TaskWithList>;
  lists!: Table<TaskList>;

  constructor() {
    super('TasksDatabase');
    this.version(1).stores({
      tasks: '++id, listId, status, dueDate, parentId, order',
      lists: '++id, order'
    });
  }
}

// Create a singleton instance
export const db = new TasksDatabase();

// Helper functions for task operations
export const taskService = {
  // Task operations
  async createTask(task: Omit<TaskWithList, 'id'>): Promise<TaskWithList> {
    return await db.tasks.add(task);
  },

  async updateTask(id: number, task: Partial<TaskWithList>): Promise<number> {
    return await db.tasks.update(id, task);
  },

  async deleteTask(id: number): Promise<void> {
    await db.tasks.delete(id);
  },

  async getTask(id: number): Promise<TaskWithList | undefined> {
    return await db.tasks.get(id);
  },

  async getAllTasks(): Promise<TaskWithList[]> {
    return await db.tasks.toArray();
  },

  async getTasksByList(listId: number): Promise<TaskWithList[]> {
    return await db.tasks.where('listId').equals(listId).toArray();
  },

  // List operations
  async createList(list: Omit<TaskList, 'id'>): Promise<TaskList> {
    return await db.lists.add(list);
  },

  async updateList(id: number, list: Partial<TaskList>): Promise<number> {
    return await db.lists.update(id, list);
  },

  async deleteList(id: number): Promise<void> {
    await db.lists.delete(id);
  },

  async getList(id: number): Promise<TaskList | undefined> {
    return await db.lists.get(id);
  },

  async getAllLists(): Promise<TaskList[]> {
    return await db.lists.toArray();
  }
}; 