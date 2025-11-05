# Electron Desktop App Guide

This project supports both **web deployment** (Vercel) and **desktop application** (Electron) from the same codebase.

## 📁 Project Structure

```
tmdb-worlder/
├── src/              # React source code (shared between web & desktop)
├── electron/         # Electron-specific files
│   ├── main.js      # Main process
│   └── preload.js   # Preload script
├── build/           # Desktop app icons
├── dist/            # Web build output
├── release/         # Desktop build output (.exe, .dmg, etc.)
└── package.json     # Scripts for both web & desktop
```

## 🚀 Development

### Web Development (Default)

```bash
npm run dev
```

Runs at `http://localhost:5173`

### Desktop Development (Electron)

```bash
npm run electron:dev
```

This will:

1. Start Vite dev server
2. Wait for it to be ready
3. Launch Electron window pointing to dev server
4. Enable hot-reload for React code
5. Auto-open DevTools

## 📦 Building

### Build for Web (Vercel/Netlify/etc.)

```bash
npm run build:web
```

Output: `dist/` folder ready for deployment

### Build Desktop App

#### All Platforms (current OS)

```bash
npm run electron:build
```

#### Windows (.exe, .nsis installer)

```bash
npm run electron:build:win
```

Output:

- `release/TMDB Worlder Setup x.x.x.exe` (Installer)
- `release/TMDB Worlder x.x.x.exe` (Portable)

#### macOS (.dmg, .zip)

```bash
npm run electron:build:mac
```

Output:

- `release/TMDB Worlder-x.x.x.dmg` (DMG installer)
- `release/TMDB Worlder-x.x.x-mac.zip` (ZIP archive)

#### Linux (.AppImage, .deb)

```bash
npm run electron:build:linux
```

Output:

- `release/TMDB Worlder-x.x.x.AppImage`
- `release/tmdb-worlder_x.x.x_amd64.deb`

## 🎨 Custom App Icons

Replace placeholder icons in `build/` directory:

### macOS Icon (.icns)

1. Create a 1024x1024 PNG icon
2. Use an online converter or macOS tools to convert to `.icns`
3. Save as `build/icon.icns`

### Windows Icon (.ico)

1. Create icons in multiple sizes (16x16, 32x32, 48x48, 256x256)
2. Use an online converter to create `.ico`
3. Save as `build/icon.ico`

### Linux Icon (.png)

1. Create a 512x512 PNG icon
2. Save as `build/icon.png`

## 🔧 Configuration

### Electron Builder Config

Edit `package.json` under the `"build"` key:

```json
{
  "build": {
    "appId": "com.tmdbworlder.app",
    "productName": "TMDB Worlder",
    "directories": {
      "output": "release"
    }
  }
}
```

### App Details

- **App Name**: Change `productName` in package.json
- **App ID**: Change `appId` (reverse domain notation)
- **Version**: Update `version` in package.json

## 🌐 Deployment

### Web Deployment (Vercel)

1. Push to GitHub
2. Import project in Vercel
3. Build command: `npm run build:web`
4. Output directory: `dist`
5. Deploy!

**Or via CLI:**

```bash
npm run build:web
npx vercel --prod
```

### Desktop Distribution

After building, distribute files from `release/` folder:

**Windows:**

- Upload `.exe` installer to GitHub Releases
- Users download and install

**macOS:**

- Upload `.dmg` to GitHub Releases
- Users drag to Applications folder

**Linux:**

- Upload `.AppImage` (universal, no installation)
- Upload `.deb` for Debian/Ubuntu users

## 🔐 Environment Variables

Desktop apps use the same `.env` file as web:

```env
VITE_FIREBASE_API_KEY=your_key
VITE_FIREBASE_AUTH_DOMAIN=your_domain
...
```

**⚠️ Security Note**:

- Environment variables are bundled into the app
- Don't use server-side secrets in desktop apps
- Firebase client SDK is safe for public distribution

## 🧪 Testing Desktop App

### Development Mode

```bash
npm run electron:dev
```

- Hot reload enabled
- DevTools open by default
- Loads from Vite dev server

### Production Build Testing

```bash
npm run build
npm run preview
```

Then launch Electron manually to test against preview build.

## 📱 Platform-Specific Features

### Detect if Running in Electron

```typescript
if (window.electron?.isElectron) {
  console.log("Running in Electron");
  console.log("Platform:", window.electron.platform);
}
```

### Platform Detection

```typescript
const platform = window.electron?.platform;

if (platform === "darwin") {
  // macOS specific
} else if (platform === "win32") {
  // Windows specific
} else if (platform === "linux") {
  // Linux specific
}
```

## 🛠️ Advanced Configuration

### Custom Window Size

Edit `electron/main.js`:

```javascript
mainWindow = new BrowserWindow({
  width: 1400, // Change width
  height: 900, // Change height
  minWidth: 800, // Minimum width
  minHeight: 600, // Minimum height
});
```

### Auto-Updater

Install `electron-updater`:

```bash
npm install electron-updater
```

Add to `electron/main.js`:

```javascript
const { autoUpdater } = require("electron-updater");

app.whenReady().then(() => {
  autoUpdater.checkForUpdatesAndNotify();
});
```

### Native Menus

Create custom menu bar in `electron/main.js`:

```javascript
const { Menu } = require("electron");

const template = [
  {
    label: "File",
    submenu: [{ role: "quit" }],
  },
];

const menu = Menu.buildFromTemplate(template);
Menu.setApplicationMenu(menu);
```

## 🚨 Troubleshooting

### Build Fails on macOS

- Install Xcode Command Line Tools: `xcode-select --install`
- Accept Xcode license: `sudo xcodebuild -license accept`

### Build Fails on Windows

- Install Windows Build Tools: `npm install --global windows-build-tools`

### Build Fails on Linux

- Install required packages:
  ```bash
  sudo apt-get install -y libgtk-3-0 libnotify4 libnss3 libxss1 libxtst6 xdg-utils libatspi2.0-0 libdrm2 libgbm1 libxcb-dri3-0
  ```

### App Won't Start

- Check console for errors: `npm run electron:dev`
- Ensure Firebase config is correct in `.env`
- Clear electron cache: `rm -rf ~/.cache/electron`

## 📚 Resources

- [Electron Documentation](https://www.electronjs.org/docs)
- [Electron Builder](https://www.electron.build/)
- [Vite Documentation](https://vitejs.dev/)
- [Code Signing Guide](https://www.electron.build/code-signing)

## 🎯 Next Steps

1. ✅ Development works (web & desktop)
2. ✅ Build process configured
3. 🔲 Add custom app icons
4. 🔲 Test builds on target platforms
5. 🔲 Set up auto-updates (optional)
6. 🔲 Code signing for distribution (optional)
7. 🔲 Create GitHub releases for downloads

[1] ReferenceError: require is not defined in ES module scope, you can use import instead
[1] This file is being treated as an ES module because it has a '.js' file extension and '/Users/ferryal/Documents/test-interview/tmdb-worlder/package.json' contains "type": "module". To treat it as a CommonJS script, rename it to use the '.cjs' file extension.
Perfect catch! The issue is that your package.json has "type": "module", which makes all .js files use ES modules, but the Electron files are using CommonJS syntax (require). Let me fix this quickly:

solution

Your project uses "type": "module" in package.json, which makes all .js files use ES module syntax. But Electron files were using CommonJS syntax (require), causing a conflict.
✅ The Solution
Renamed Electron files to use .cjs extension:
electron/main.js → electron/main.cjs
electron/preload.js → electron/preload.cjs
Updated references:
package.json → "main": "electron/main.cjs"
electron/main.cjs → preload path updated to preload.cjs
Build config updated to include electron/\*_/_.cjs
