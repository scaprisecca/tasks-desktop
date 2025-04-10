## Security Considerations – Tasks.org Desktop Application

### 🔐 Credential Storage
- App credentials (e.g. CalDAV username/password):
  - Encrypted using Web Crypto API (`crypto.subtle`)
  - Stored locally in IndexedDB or `electron-store`
  - Never transmitted or stored unencrypted

### 🧱 Local Storage Protection
- IndexedDB storage is sandboxed per app
- Optional: Offer master password to lock access (future version)
- Wipe local task data on logout

### 🌐 Network Security
- CalDAV connections:
  - Require HTTPS only
  - Certificate errors prompt manual override (dev/debug mode only)

### 🧠 Data Integrity
- Use `dirty` and `deleted` flags to avoid accidental data loss
- Validate and sanitize task fields before syncing

### 🔍 Error Handling
- Sync errors are logged locally (not sent externally)
- No crash/error reports without user opt-in
- Sensitive fields never exposed in UI logs

### 💾 Auto-Backup Feature
- **User-Configurable Backups:**
  - Users can choose a local folder where backups are stored
  - Option to enable/disable automatic backups
- **Backup Schedule Options:**
  - Daily
  - Weekly
  - Bi-weekly
  - Monthly
  - Quarterly
- **Backup Format:**
  - JSON or zipped export of IndexedDB contents and metadata
  - Timestamps included in filenames
- **Manual Backup:**
  - Users can trigger a backup manually at any time

> Future enhancements may include password-protected backup archives and automatic backup cleanup based on age or quantity.

