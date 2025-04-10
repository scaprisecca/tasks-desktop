import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import isDev from 'electron-is-dev';
import Store from 'electron-store';

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
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
}); 