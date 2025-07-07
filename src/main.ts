import { app, BrowserWindow, ipcMain, dialog } from 'electron';
import path from 'path';
import isDev from 'electron-is-dev';
import Store from 'electron-store';
import fs from 'fs';

interface WindowState {
  isMaximized: boolean;
  bounds: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

const store = new Store();

let mainWindow: BrowserWindow | null = null;

function createWindow() {
  // Get the saved window state
  const windowState = store.get('windowState', {
    isMaximized: false,
    bounds: {
      x: 100,
      y: 100,
      width: 1200,
      height: 800,
    },
  }) as WindowState;

  mainWindow = new BrowserWindow({
    ...windowState.bounds,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
    titleBarStyle: 'hiddenInset', // For macOS
    frame: !process.platform.includes('win'), // For Windows
  });

  if (windowState.isMaximized) {
    mainWindow.maximize();
  }

  // Load the app
  if (isDev) {
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  // Save window state on close
  mainWindow.on('close', () => {
    if (mainWindow) {
      store.set('windowState', {
        isMaximized: mainWindow.isMaximized(),
        bounds: mainWindow.getBounds(),
      });
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Handle window control events
  ipcMain.on('window-minimize', () => {
    mainWindow?.minimize();
  });

  ipcMain.on('window-maximize', () => {
    if (mainWindow?.isMaximized()) {
      mainWindow.unmaximize();
    } else {
      mainWindow?.maximize();
    }
  });

  ipcMain.on('window-close', () => {
    mainWindow?.close();
  });

  // Handle window state changes
  ipcMain.on('window-state-changed', (_, state: WindowState) => {
    store.set('windowState', state);
  });

  // Handle get window bounds request
  ipcMain.on('get-window-bounds', (event) => {
    if (mainWindow) {
      event.returnValue = mainWindow.getBounds();
    }
  });

  // Handle save backup request
  ipcMain.handle('save-backup', async (_, { data, filename }) => {
    try {
      const { filePath } = await dialog.showSaveDialog({
        title: 'Save Backup',
        defaultPath: path.join(app.getPath('documents'), filename),
        filters: [{ name: 'JSON Files', extensions: ['json'] }],
      });

      if (!filePath) {
        return { success: false, error: 'Save cancelled' };
      }

      fs.writeFileSync(filePath, data, 'utf8');
      return { success: true, filePath };
    } catch (error) {
      console.error('Error saving backup:', error);
      return { success: false, error: (error as Error).message };
    }
  });

  // Handle load backup request
  ipcMain.handle('load-backup', async () => {
    try {
      const { filePaths } = await dialog.showOpenDialog({
        title: 'Load Backup',
        properties: ['openFile'],
        filters: [{ name: 'JSON Files', extensions: ['json'] }],
      });

      if (!filePaths || filePaths.length === 0) {
        return { success: false, error: 'Load cancelled' };
      }

      const filePath = filePaths[0];
      const data = fs.readFileSync(filePath, 'utf8');
      return { success: true, data };
    } catch (error) {
      console.error('Error loading backup:', error);
      return { success: false, error: (error as Error).message };
    }
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed, except on macOS.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
}); 