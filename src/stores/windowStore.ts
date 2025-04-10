import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import Store from 'electron-store';

const electronStore = new Store();

interface WindowState {
  isMaximized: boolean;
  bounds: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  setMaximized: (isMaximized: boolean) => void;
  setBounds: (bounds: { x: number; y: number; width: number; height: number }) => void;
}

export const useWindowStore = create<WindowState>()(
  persist(
    (set) => ({
      isMaximized: false,
      bounds: {
        x: 100,
        y: 100,
        width: 1200,
        height: 800,
      },
      setMaximized: (isMaximized) => set({ isMaximized }),
      setBounds: (bounds) => set({ bounds }),
    }),
    {
      name: 'window-state',
      storage: {
        getItem: (name) => {
          const value = electronStore.get(name);
          return value ? JSON.parse(value) : null;
        },
        setItem: (name, value) => {
          electronStore.set(name, JSON.stringify(value));
        },
        removeItem: (name) => {
          electronStore.delete(name);
        },
      },
    }
  )
); 