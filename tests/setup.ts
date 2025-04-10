import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock electron IPC
vi.mock('electron', () => ({
  ipcRenderer: {
    send: vi.fn(),
    sendSync: vi.fn(),
  },
}));

// Mock window events
Object.defineProperty(window, 'addEventListener', {
  value: vi.fn(),
  writable: true,
});

Object.defineProperty(window, 'removeEventListener', {
  value: vi.fn(),
  writable: true,
}); 