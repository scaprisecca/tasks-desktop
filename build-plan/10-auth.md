## Authentication Strategy – Tasks.org Desktop Application

### 🔑 Connection Setup
- **User Input:**
  - CalDAV server URL (e.g. `https://cloud.example.com/remote.php/dav`)
  - Username
  - App-specific password (recommended for 2FA setups)
- **UI Flow:**
  - Simple login form on first launch or via Settings
  - Validate credentials via `tsdav` ping
  - Store credentials securely if successful

### 🔐 Credential Storage
- **Encryption:** Use `crypto.subtle` (Web Crypto API) to encrypt credentials before saving
- **Storage Location:** IndexedDB or `electron-store` (if using Node-backed file storage)
- **App Behavior:**
  - Auto-login on startup if credentials are stored
  - Allow user to logout or reauthenticate from Settings

### ⚠️ 2FA & Security Guidance
- Prompt user to use **app-specific passwords** if 2FA is enabled
- Display helper text or link to relevant Nextcloud documentation
- No password recovery (handled by CalDAV provider)

### 🔄 Token Refresh / Reauth
- Not needed for static credentials (basic auth)
- If supporting OAuth2 in future, add token refresh flow

