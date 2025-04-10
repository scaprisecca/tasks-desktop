import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useWindowStore } from '../../src/stores/windowStore';
import Store from 'electron-store';

// Mock electron-store
const mockGet = vi.fn();
const mockSet = vi.fn();
const mockDelete = vi.fn();

vi.mock('electron-store', () => {
  return {
    default: vi.fn().mockImplementation(() => ({
      get: mockGet,
      set: mockSet,
      delete: mockDelete,
    })),
  };
});

describe('Window Store', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset store state before each test
    useWindowStore.setState({
      isMaximized: false,
      bounds: {
        x: 100,
        y: 100,
        width: 1200,
        height: 800,
      },
    });
  });

  it('initializes with default state', () => {
    const state = useWindowStore.getState();
    expect(state.isMaximized).toBe(false);
    expect(state.bounds).toEqual({
      x: 100,
      y: 100,
      width: 1200,
      height: 800,
    });
  });

  it('updates isMaximized state', () => {
    const { setMaximized } = useWindowStore.getState();
    
    setMaximized(true);
    expect(useWindowStore.getState().isMaximized).toBe(true);
    
    setMaximized(false);
    expect(useWindowStore.getState().isMaximized).toBe(false);
  });

  it('updates bounds state', () => {
    const { setBounds } = useWindowStore.getState();
    const newBounds = {
      x: 200,
      y: 200,
      width: 1000,
      height: 600,
    };
    
    setBounds(newBounds);
    expect(useWindowStore.getState().bounds).toEqual(newBounds);
  });

  it('persists state changes', () => {
    const { setMaximized, setBounds } = useWindowStore.getState();
    
    // Change the state
    setMaximized(true);
    setBounds({ x: 200, y: 200, width: 1000, height: 600 });
    
    // Verify that the storage adapter was called with the correct data
    expect(mockSet).toHaveBeenCalledWith('window-state', JSON.stringify({
      state: {
        isMaximized: true,
        bounds: { x: 200, y: 200, width: 1000, height: 600 },
      },
      version: 0,
    }));
  });
}); 