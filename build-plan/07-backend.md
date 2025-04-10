## Backend Architecture – Tasks.org Desktop Application

### 📦 Local Persistence
- **Storage Engine:** IndexedDB (via `dexie` or `idb`)
- **Data Stored:**
  - Tasks (full schema)
  - Lists (from CalDAV)
  - Sync metadata (timestamps, dirty flags, UUIDs)
  - Settings and credentials (encrypted)

### 🔁 Sync Engine
- **Library:** `tsdav`
- **Sync Targets:** CalDAV-compatible services (e.g. Nextcloud Tasks)
- **Mechanism:**
  - On startup: pull tasks, lists
  - On task change: push update (if online) or queue
  - Offline: mark task as "dirty", queue changes
  - Auto-retry on reconnect
  - Conflict Handling: Last-write-wins (initial) with option to override later

### 🔐 Credentials Handling
- Store app-specific password or token
- Encrypt at rest in local storage (e.g. using `crypto.subtle`)
- Support 2FA-friendly workflows (e.g. prompt user to use app password)

### 🧪 Background Sync & Tasks
- Poll server every X minutes or watch for activity
- Visual sync indicator in UI (sync success/error states)
- Optional background job queue (indexed and persistent)

