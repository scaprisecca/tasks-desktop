## Sync Logic & Offline Mode – Tasks.org Desktop Application

### 🔁 Sync Lifecycle
- **Initial Load:** On app startup, sync with CalDAV server
  - Pull latest task collections and tasks
  - Store/update them in local IndexedDB
- **Live Updates:**
  - On every task/list change, queue change to sync immediately
  - If offline, mark task `dirty` and store sync intent
  - Auto-sync when reconnected
- **Scheduled Sync:**
  - Poll every 5–10 minutes for updates (configurable)
  - Retry failed syncs with exponential backoff

### 🧠 Change Queue
- Uses `dirty` flag and `deleted` field to identify unsynced changes
- Maintain a queue in IndexedDB for:
  - Create / update / delete operations
  - CalDAV UID mapping and ETags for optimistic concurrency

### 🪛 Conflict Handling
- **Default Strategy:** Last-write-wins
- **Optional Feature (Future):** Manual conflict resolution dialog (based on timestamps)

### 📡 Offline Mode UX
- **Visual Indicator:** Sync status badge (Idle, Syncing, Error)
- **Error Feedback:** Snackbar-style messages for sync failures
- **Task Actions:** Always enabled — sync queued in background
- **App Behavior:** Fully functional offline, no features disabled

