import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { TaskWithList, TaskList } from '../models/Task';
import { taskService } from '../services/database';

interface TaskState {
  tasks: TaskWithList[];
  lists: TaskList[];
  selectedListId: number | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  setSelectedList: (listId: number | null) => void;
  fetchTasks: () => Promise<void>;
  fetchLists: () => Promise<void>;
  createTask: (task: Omit<TaskWithList, 'id'>) => Promise<void>;
  updateTask: (id: number, task: Partial<TaskWithList>) => Promise<void>;
  deleteTask: (id: number) => Promise<void>;
  createList: (list: Omit<TaskList, 'id'>) => Promise<void>;
  updateList: (id: number, list: Partial<TaskList>) => Promise<void>;
  deleteList: (id: number) => Promise<void>;
}

export const useTaskStore = create<TaskState>()(
  persist(
    (set, get) => ({
      tasks: [],
      lists: [],
      selectedListId: null,
      isLoading: false,
      error: null,

      setSelectedList: (listId) => set({ selectedListId: listId }),

      fetchTasks: async () => {
        set({ isLoading: true, error: null });
        try {
          const tasks = await taskService.getAllTasks();
          set({ tasks, isLoading: false });
        } catch (error) {
          set({ error: (error as Error).message, isLoading: false });
        }
      },

      fetchLists: async () => {
        set({ isLoading: true, error: null });
        try {
          const lists = await taskService.getAllLists();
          set({ lists, isLoading: false });
        } catch (error) {
          set({ error: (error as Error).message, isLoading: false });
        }
      },

      createTask: async (task) => {
        set({ isLoading: true, error: null });
        try {
          const newTask = await taskService.createTask(task);
          set((state) => ({
            tasks: [...state.tasks, newTask],
            isLoading: false,
          }));
        } catch (error) {
          set({ error: (error as Error).message, isLoading: false });
        }
      },

      updateTask: async (id, task) => {
        set({ isLoading: true, error: null });
        try {
          await taskService.updateTask(id, task);
          set((state) => ({
            tasks: state.tasks.map((t) =>
              t.id === id ? { ...t, ...task } : t
            ),
            isLoading: false,
          }));
        } catch (error) {
          set({ error: (error as Error).message, isLoading: false });
        }
      },

      deleteTask: async (id) => {
        set({ isLoading: true, error: null });
        try {
          await taskService.deleteTask(id);
          set((state) => ({
            tasks: state.tasks.filter((t) => t.id !== id),
            isLoading: false,
          }));
        } catch (error) {
          set({ error: (error as Error).message, isLoading: false });
        }
      },

      createList: async (list) => {
        set({ isLoading: true, error: null });
        try {
          const newList = await taskService.createList(list);
          set((state) => ({
            lists: [...state.lists, newList],
            isLoading: false,
          }));
        } catch (error) {
          set({ error: (error as Error).message, isLoading: false });
        }
      },

      updateList: async (id, list) => {
        set({ isLoading: true, error: null });
        try {
          await taskService.updateList(id, list);
          set((state) => ({
            lists: state.lists.map((l) =>
              l.id === id ? { ...l, ...list } : l
            ),
            isLoading: false,
          }));
        } catch (error) {
          set({ error: (error as Error).message, isLoading: false });
        }
      },

      deleteList: async (id) => {
        set({ isLoading: true, error: null });
        try {
          await taskService.deleteList(id);
          set((state) => ({
            lists: state.lists.filter((l) => l.id !== id),
            isLoading: false,
          }));
        } catch (error) {
          set({ error: (error as Error).message, isLoading: false });
        }
      },
    }),
    {
      name: 'task-storage',
      partialize: (state) => ({
        selectedListId: state.selectedListId,
      }),
    }
  )
); 