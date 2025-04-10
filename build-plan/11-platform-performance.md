## Platform Compatibility & Performance – Tasks.org Desktop Application

### 🎯 Target Platforms
- **Primary:** Linux Mint (deb-based distros prioritized)
- **Secondary:** Other major Linux distros (Flatpak/AppImage support planned)
- **Future Support:** Windows (installer via NSIS or Squirrel)
- **Optional:** macOS (to be evaluated after v1.0)

### 📦 Packaging Strategy
- Electron builder for:
  - `.deb` packages
  - `.AppImage` for broader Linux support
  - Windows `.exe` or `.msi` via NSIS/Squirrel

### 🚀 Performance Optimization
- **Code Splitting:** Lazy load views (Calendar, Detail Pane)
- **Virtualized Lists:** (if needed) use `react-window` or `react-virtual`
- **Efficient Rendering:**
  - Minimize re-renders with memoization (`React.memo`, `useMemo`)
  - Store derived/calculated values in Zustand selectors
- **Low Memory Footprint:** Avoid unnecessary background processes
- **Startup Speed:** Use preload scripts + IndexedDB snapshot cache

### 🧪 Dev & QA Tools
- DevTools toggle (via menu or shortcut)
- Logging mode for sync and CalDAV debugging
- Optional telemetry toggle (off by default)

