## Frontend Architecture – Tasks.org Desktop Application

### 🧱 Component Structure
```
<App>
  ├── <Sidebar />        // Lists, Filters, Tags
  ├── <MainView />
  │    ├── <TaskList />  // Grouped tasks
  │    └── <CalendarView /> // Switchable layout
  └── <TaskDetailPane /> // Task editor
```

### 🧠 State Management
- **Library:** Zustand
- **Global Stores:**
  - `useTaskStore` – task data, loading states, sync flags
  - `useFilterStore` – active filters, views
  - `useSettingsStore` – theme, layout, CalDAV credentials
  - `useSyncStore` – sync queue, status, error handling

### 💾 Local Storage (Offline Mode)
- **Storage:** IndexedDB (via `idb`, `dexie`, or custom wrapper)
- **Usage:**
  - Cache all tasks locally
  - Mark unsynced changes for later sync
  - Persist settings, filters, themes, and auth info

### 🔧 React Tools
- React + TypeScript
- Vite for bundling
- TailwindCSS for styling
- Zustand for state
- React Query (optional, for future remote sync abstraction)

### 💡 Dev Ergonomics
- File-based routing using `vite-plugin-pages` (if multipage)
- Custom React hooks for each store and sync logic
- Component splitting to lazy-load views like calendar

