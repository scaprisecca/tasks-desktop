
## Testing the App
Based on your `package.json`, here are the **exact commands** to test and run your application:

---

### 1. **Install Dependencies**
```bash
npm install
```
or
```bash
pnpm install
```

---

### 2. **Start the App in Development Mode**
This will:
- Start the Vite dev server
- Wait for it to be ready
- Launch Electron in development mode

```bash
npm run dev
```
or
```bash
pnpm run dev
```
> This uses the script:  
> `"dev": "concurrently -k \"vite\" \"wait-on http://localhost:5173 && cross-env NODE_ENV=development electron .\""`

---

### 3. **Run Tests**
To run all tests using Vitest:
```bash
npm test
```
or
```bash
pnpm test
```
To run tests with coverage:
```bash
npm run test:coverage
```
or
```bash
pnpm run test:coverage
```

---

### 4. **Lint the Code**
To check for linting errors:
```bash
npm run lint
```
or
```bash
pnpm run lint
```

---

### 5. **Build for Production**
To build the frontend for production:
```bash
npm run build
```
or
```bash
pnpm build
```

---

### 6. **Preview the Production Build**
To preview the production build locally:
```bash
npm run preview
```
or
```bash
pnpm preview
```

---

### 7. **Build Electron App for Distribution**
To package the Electron app for distribution (using electron-builder):
```bash
npm run electron:build
```
or
```bash
pnpm run electron:build
```

---

## **Summary Table**

| Action                | Command (npm)         | Command (pnpm)         |
|-----------------------|-----------------------|------------------------|
| Install dependencies  | `npm install`         | `pnpm install`         |
| Start dev app         | `npm run dev`         | `pnpm run dev`         |
| Run tests             | `npm test`            | `pnpm test`            |
| Test coverage         | `npm run test:coverage` | `pnpm run test:coverage` |
| Lint                  | `npm run lint`        | `pnpm run lint`        |
| Build (frontend)      | `npm run build`       | `pnpm run build`       |
| Preview build         | `npm run preview`     | `pnpm run preview`     |
| Build Electron app    | `npm run electron:build` | `pnpm run electron:build` |

---

**To test out your application, just run:**
```bash
npm run dev
```
or
```bash
pnpm run dev
```