import { describe, it, expect, beforeEach, vi } from 'vitest';
import { act } from '@testing-library/react';
import { useTaskStore } from '../../src/stores/taskStore';
import { taskService } from '../../src/services/database';

// Mock the database service
vi.mock('../../src/services/database', () => ({
  taskService: {
    getAllTasks: vi.fn(),
    getAllLists: vi.fn(),
    createTask: vi.fn(),
    updateTask: vi.fn(),
    deleteTask: vi.fn(),
    createList: vi.fn(),
    updateList: vi.fn(),
    deleteList: vi.fn(),
  },
}));

describe('Task Store', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    vi.clearAllMocks();
    // Reset the store state
    act(() => {
      useTaskStore.setState({
        tasks: [],
        lists: [],
        selectedListId: null,
        isLoading: false,
        error: null,
      });
    });
  });

  it('should initialize with default state', () => {
    const state = useTaskStore.getState();
    expect(state.tasks).toEqual([]);
    expect(state.lists).toEqual([]);
    expect(state.selectedListId).toBeNull();
    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
  });

  it('should fetch tasks successfully', async () => {
    const mockTasks = [
      {
        id: 1,
        title: 'Task 1',
        listId: 1,
        priority: 'medium' as const,
        status: 'todo' as const,
        createdAt: new Date(),
        updatedAt: new Date(),
        order: 0,
      },
      {
        id: 2,
        title: 'Task 2',
        listId: 1,
        priority: 'high' as const,
        status: 'in-progress' as const,
        createdAt: new Date(),
        updatedAt: new Date(),
        order: 1,
      },
    ];
    (taskService.getAllTasks as any).mockResolvedValue(mockTasks);

    await act(async () => {
      await useTaskStore.getState().fetchTasks();
    });

    const state = useTaskStore.getState();
    expect(state.tasks).toEqual(mockTasks);
    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
  });

  it('should handle task fetch error', async () => {
    const errorMessage = 'Failed to fetch tasks';
    (taskService.getAllTasks as any).mockRejectedValue(new Error(errorMessage));

    await act(async () => {
      await useTaskStore.getState().fetchTasks();
    });

    const state = useTaskStore.getState();
    expect(state.tasks).toEqual([]);
    expect(state.isLoading).toBe(false);
    expect(state.error).toBe(errorMessage);
  });

  it('should create a task successfully', async () => {
    const newTask = {
      title: 'New Task',
      listId: 1,
      priority: 'medium' as const,
      status: 'todo' as const,
      order: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const createdTask = {
      id: 1,
      ...newTask,
    };
    (taskService.createTask as any).mockResolvedValue(createdTask);

    await act(async () => {
      await useTaskStore.getState().createTask(newTask);
    });

    const state = useTaskStore.getState();
    expect(state.tasks).toContainEqual(createdTask);
    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
  });

  it('should update a task successfully', async () => {
    const initialTask = {
      id: 1,
      title: 'Task 1',
      listId: 1,
      priority: 'medium' as const,
      status: 'todo' as const,
      createdAt: new Date(),
      updatedAt: new Date(),
      order: 0,
    };
    const updatedTask = {
      ...initialTask,
      title: 'Updated Task',
    };
    
    act(() => {
      useTaskStore.setState({ tasks: [initialTask] });
    });

    (taskService.updateTask as any).mockResolvedValue(updatedTask);

    await act(async () => {
      await useTaskStore.getState().updateTask(1, { title: 'Updated Task' });
    });

    const state = useTaskStore.getState();
    expect(state.tasks[0].title).toBe('Updated Task');
    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
  });

  it('should delete a task successfully', async () => {
    const task = {
      id: 1,
      title: 'Task 1',
      listId: 1,
      priority: 'medium' as const,
      status: 'todo' as const,
      createdAt: new Date(),
      updatedAt: new Date(),
      order: 0,
    };
    
    act(() => {
      useTaskStore.setState({ tasks: [task] });
    });

    (taskService.deleteTask as any).mockResolvedValue(undefined);

    await act(async () => {
      await useTaskStore.getState().deleteTask(1);
    });

    const state = useTaskStore.getState();
    expect(state.tasks).toEqual([]);
    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
  });

  it('should set selected list', () => {
    act(() => {
      useTaskStore.getState().setSelectedList(1);
    });

    const state = useTaskStore.getState();
    expect(state.selectedListId).toBe(1);
  });
}); 