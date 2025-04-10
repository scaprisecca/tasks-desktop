import { describe, it, expect, vi, beforeEach } from 'vitest';
import { app, BrowserWindow, ipcMain } from 'electron';
import Store from 'electron-store';

// Mock electron modules
vi.mock('electron', () => ({
  app: {
    on: vi.fn(),
    whenReady: vi.fn().mockResolvedValue(undefined),
  },
  BrowserWindow: vi.fn().mockImplementation(() => ({
    loadURL: vi.fn(),
    on: vi.fn(),
    minimize: vi.fn(),
    maximize: vi.fn(),
    unmaximize: vi.fn(),
    close: vi.fn(),
    isMaximized: vi.fn().mockReturnValue(false),
    getBounds: vi.fn().mockReturnValue({ x: 0, y: 0, width: 800, height: 600 }),
  })),
  ipcMain: {
    on: vi.fn(),
  },
}));

// Mock electron-store
vi.mock('electron-store', () => {
  return {
    default: vi.fn().mockImplementation(() => ({
      get: vi.fn(),
      set: vi.fn(),
    })),
  };
});

describe('Main Process Window Management', () => {
  let store: any;
  let mainWindow: any;

  beforeEach(() => {
    vi.clearAllMocks();
    store = new Store();
    mainWindow = new BrowserWindow();
  });

  it('creates window with saved state', () => {
    const savedState = {
      isMaximized: true,
      bounds: { x: 100, y: 100, width: 1024, height: 768 },
    };
    (store.get as any).mockReturnValue(savedState);

    // Import the main module after mocking
    const mainModule = require('../../src/main');
    
    expect(BrowserWindow).toHaveBeenCalledWith({
      ...savedState.bounds,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
      },
    });
  });

  it('handles window minimize event', () => {
    const mainModule = require('../../src/main');
    
    const minimizeHandler = (ipcMain.on as any).mock.calls.find(
      (call: any) => call[0] === 'window-minimize'
    )[1];

    minimizeHandler();
    expect(mainWindow.minimize).toHaveBeenCalled();
  });

  it('handles window maximize event', () => {
    const mainModule = require('../../src/main');
    
    const maximizeHandler = (ipcMain.on as any).mock.calls.find(
      (call: any) => call[0] === 'window-maximize'
    )[1];

    maximizeHandler();
    expect(mainWindow.isMaximized).toHaveBeenCalled();
    expect(mainWindow.maximize).toHaveBeenCalled();
  });

  it('handles window close event', () => {
    const mainModule = require('../../src/main');
    
    const closeHandler = (ipcMain.on as any).mock.calls.find(
      (call: any) => call[0] === 'window-close'
    )[1];

    closeHandler();
    expect(mainWindow.close).toHaveBeenCalled();
  });

  it('saves window state on close', () => {
    const mainModule = require('../../src/main');
    
    const mockWindow = new BrowserWindow();
    const closeHandler = mockWindow.on.mock.calls.find(
      (call: any) => call[0] === 'close'
    )[1];

    closeHandler();
    expect(store.set).toHaveBeenCalledWith('window-state', {
      isMaximized: false,
      bounds: { x: 0, y: 0, width: 800, height: 600 },
    });
  });
}); 