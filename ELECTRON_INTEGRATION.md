# Electron Integration Summary

This document explains how Electron.js was integrated into the React web app to support desktop deployment.

## 🎯 What Was Done

### 1. Installed Electron Dependencies

```bash
npm install -D electron electron-builder concurrently wait-on cross-env
```

- **electron**: Desktop framework
- **electron-builder**: Package and build desktop apps
- **concurrently**: Run multiple commands simultaneously
- **wait-on**: Wait for dev server before launching Electron
- **cross-env**: Cross-platform environment variables

### 2. Created Electron Files

#### `electron/main.js` - Main Process

The main Electron process that creates and manages windows.

**Key Features:**

- Creates application window
- Loads dev server (development) or built files (production)
- Handles window lifecycle
- Platform-specific behavior

#### `electron/preload.js` - Preload Script

Safely exposes Electron APIs to the renderer process.

**Exposes:**

- `window.electron.isElectron` - Detect if running in Electron
- `window.electron.platform` - Operating system (darwin/win32/linux)

### 3. Updated Package.json

#### Added Fields

```json
{
  "main": "electron/main.js",
  "author": "TMDB Worlder Team",
  "description": "A modern React app with Firebase and Electron support"
}
```

#### Added Scripts

```json
{
  "electron:dev": "Start Electron in development mode",
  "electron:build": "Build for current platform",
  "electron:build:win": "Build Windows executable",
  "electron:build:mac": "Build macOS app",
  "electron:build:linux": "Build Linux app"
}
```

#### Added Electron Builder Config

```json
{
  "build": {
    "appId": "com.tmdbworlder.app",
    "productName": "TMDB Worlder",
    "directories": { "output": "release" },
    "files": ["dist/**/*", "electron/**/*", "package.json"],
    "mac": { "target": ["dmg", "zip"] },
    "win": { "target": ["nsis", "portable"] },
    "linux": { "target": ["AppImage", "deb"] }
  }
}
```

### 4. Updated Vite Configuration

Added to `vite.config.ts`:

```typescript
{
  base: "./",  // Use relative paths for Electron
  build: {
    outDir: "dist",
    emptyOutDir: true
  }
}
```

**Why?**

- `base: "./"` ensures assets load correctly in Electron
- Paths are relative, not absolute

### 5. Created Type Definitions

`src/types/electron.d.ts`:

```typescript
interface Window {
  electron?: {
    isElectron: boolean;
    platform: string;
  };
}
```

Provides TypeScript support for Electron APIs in React code.

### 6. Added Environment Detection

`src/lib/environment.ts`:

```typescript
export const isElectron = () => !!window.electron?.isElectron;
export const isWeb = () => !isElectron();
export const getPlatform = () => window.electron?.platform || "web";
```

Use these helpers to write platform-specific code.

### 7. Updated .gitignore

Added:

```
release
out
.webpack
*.exe
*.dmg
*.AppImage
*.deb
```

Prevents committing built desktop apps to git.

## 🔧 How It Works

### Development Mode

1. Run `npm run electron:dev`
2. Vite dev server starts on port 5173
3. Script waits for server to be ready
4. Electron launches and loads `http://localhost:5173`
5. Hot reload works as normal
6. DevTools open automatically

**Flow:**

```
npm run electron:dev
  ↓
  Vite dev server (5173)
  ↓
  wait-on checks if ready
  ↓
  Electron launches
  ↓
  Loads from localhost:5173
```

### Production Build

1. Run `npm run electron:build`
2. React app builds to `dist/`
3. Electron builder packages everything
4. Creates installers in `release/`

**Flow:**

```
npm run electron:build
  ↓
  npm run build (Vite build)
  ↓
  dist/ folder created
  ↓
  electron-builder packages
  ↓
  release/ folder with installers
```

## 🌐 Dual Deployment Architecture

### Same Codebase, Two Targets

```
src/
  ├── components/     ← Shared by web & desktop
  ├── pages/          ← Shared by web & desktop
  ├── services/       ← Shared by web & desktop
  └── ...

electron/
  ├── main.js         ← Desktop-only
  └── preload.js      ← Desktop-only
```

### How React Code Stays Shared

**React code doesn't need to change!** Both web and desktop use the same React components.

**Platform-Specific Code (when needed):**

```typescript
import { isElectron } from "@/lib/environment";

function MyComponent() {
  if (isElectron()) {
    // Desktop-specific feature
    console.log("Running in desktop app");
  } else {
    // Web-specific feature
    console.log("Running in browser");
  }

  return <div>Works everywhere!</div>;
}
```

### Build Outputs

**Web Build (`npm run build:web`):**

```
dist/
  ├── index.html
  ├── assets/
  │   ├── index.css
  │   └── index.js
  └── vite.svg
```

→ Deploy to Vercel/Netlify

**Desktop Build (`npm run electron:build`):**

```
release/
  ├── TMDB Worlder Setup 1.0.0.exe (Windows)
  ├── TMDB Worlder-1.0.0.dmg (macOS)
  └── TMDB Worlder-1.0.0.AppImage (Linux)
```

→ Distribute to users

## 🔐 Security Considerations

### Context Isolation

```javascript
// electron/main.js
webPreferences: {
  nodeIntegration: false,      // ✅ Disabled for security
  contextIsolation: true,      // ✅ Enabled for security
  preload: path.join(__dirname, "preload.js")
}
```

**Why?**

- Protects against malicious code
- React code can't access Node.js directly
- Only preload script APIs are exposed

### Environment Variables

**Safe to Bundle:**

- ✅ Firebase client config
- ✅ API endpoints
- ✅ Public keys

**Never Bundle:**

- ❌ Server API keys
- ❌ Private keys
- ❌ Database credentials

**In Desktop Apps:**
Environment variables are bundled into the app, so only use client-safe values.

## 📊 Feature Comparison

| Feature       | Web     | Desktop       |
| ------------- | ------- | ------------- |
| React UI      | ✅      | ✅            |
| Firebase Auth | ✅      | ✅            |
| Firestore     | ✅      | ✅            |
| Analytics     | ✅      | ✅            |
| Dark Mode     | ✅      | ✅            |
| i18n          | ✅      | ✅            |
| Hot Reload    | ✅      | ✅            |
| Offline Mode  | Limited | Better        |
| Native Menus  | ❌      | ✅            |
| System Tray   | ❌      | ✅ (possible) |
| Auto-Update   | N/A     | ✅ (possible) |
| File System   | Limited | ✅ (via IPC)  |
| Distribution  | URL     | Installer     |

## 🎨 Customization Options

### Window Configuration

Edit `electron/main.js`:

```javascript
mainWindow = new BrowserWindow({
  width: 1400, // Window width
  height: 900, // Window height
  minWidth: 800, // Minimum width
  minHeight: 600, // Minimum height
  frame: true, // Show window frame
  transparent: false, // Transparent window
  resizable: true, // Allow resize
  fullscreen: false, // Start fullscreen
  autoHideMenuBar: true, // Hide menu bar
  icon: "path/to/icon", // Window icon
});
```

### App Information

Edit `package.json`:

```json
{
  "name": "tmdb-worlder", // App internal name
  "version": "1.0.0", // Version number
  "productName": "TMDB Worlder", // Display name
  "description": "...", // Description
  "author": "Your Name", // Author
  "build": {
    "appId": "com.yourcompany.app" // Unique app ID
  }
}
```

### Build Targets

Edit `package.json` → `build` section:

```json
{
  "win": {
    "target": ["nsis", "portable", "msi"]
  },
  "mac": {
    "target": ["dmg", "zip", "pkg"]
  },
  "linux": {
    "target": ["AppImage", "deb", "rpm", "snap"]
  }
}
```

## 🚨 Common Pitfalls

### ❌ Absolute Paths

```typescript
// DON'T
<img src="/logo.png" />

// DO
<img src="./logo.png" />
```

### ❌ Window Object Checks

```typescript
// DON'T
if (window.electron) { ... }

// DO
if (window.electron?.isElectron) { ... }
```

### ❌ Node.js APIs in React

```typescript
// DON'T (won't work due to context isolation)
import fs from 'fs';
fs.readFile(...);

// DO (use preload script or IPC)
window.electron.readFile(...);
```

## ✅ Best Practices

### 1. Test Both Environments

- Always test in both web browser and Electron
- Features might behave differently

### 2. Use Environment Detection

```typescript
import { isElectron } from "@/lib/environment";

if (isElectron()) {
  // Desktop-only code
}
```

### 3. Keep React Code Agnostic

- Avoid platform-specific code in components
- Use HOCs or hooks for platform differences

### 4. Handle Offline Gracefully

- Desktop apps might start offline
- Test with network disabled

### 5. Version Consistently

- Keep web and desktop versions in sync
- Use same version number in package.json

## 📚 Additional Resources

### Documentation Files

- [README.md](./README.md) - Overview
- [SETUP.md](./SETUP.md) - Initial setup
- [ELECTRON.md](./ELECTRON.md) - Detailed Electron guide
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Deployment guide
- [SCRIPTS.md](./SCRIPTS.md) - Script reference

### External Resources

- [Electron Documentation](https://www.electronjs.org/docs)
- [Electron Builder](https://www.electron.build/)
- [Security Best Practices](https://www.electronjs.org/docs/tutorial/security)

## 🎯 Next Steps

### Enhancements You Could Add

1. **Native Menus**

   - Add File, Edit, View menus
   - Platform-specific menu items

2. **System Tray**

   - Minimize to tray
   - Quick actions menu

3. **Auto-Updates**

   - Install electron-updater
   - Check for updates on startup

4. **Native Notifications**

   - Use Electron's notification API
   - Desktop alerts

5. **IPC Communication**

   - React ↔ Main process communication
   - File system access
   - OS integration

6. **Deep Linking**
   - Handle custom URL schemes
   - `tmdb://` links

## 💡 Tips

1. **Dev Workflow**: Keep `npm run dev` running in one terminal, use it for both web and desktop development

2. **Build Speed**: First build is slow, subsequent builds are faster due to caching

3. **Icon Generation**: Use tools like [electron-icon-builder](https://www.npmjs.com/package/electron-icon-builder) to generate all icon formats

4. **Code Signing**: Not required for development, but recommended for distribution

5. **Cross-Platform**: Test on actual platforms, not just build for them

## 🎉 Conclusion

You now have a single React codebase that:

- ✅ Runs in browsers (Chrome, Firefox, Safari, Edge)
- ✅ Runs as desktop app (Windows, macOS, Linux)
- ✅ Shares 100% of React code
- ✅ Uses same Firebase backend
- ✅ Has platform-specific enhancements when needed

**One codebase. Two platforms. Infinite possibilities!** 🚀
