# Deployment Guide

Complete guide for deploying TMDB Worlder to web and distributing as desktop app.

## 📦 Web Deployment (Vercel)

### Option 1: Deploy via GitHub (Recommended)

1. **Push to GitHub**

   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/tmdb-worlder.git
   git push -u origin main
   ```

2. **Connect to Vercel**

   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Configure:
     - **Framework Preset**: Vite
     - **Build Command**: `npm run build:web`
     - **Output Directory**: `dist`
   - Add Environment Variables:
     ```
     VITE_FIREBASE_API_KEY=your_key
     VITE_FIREBASE_AUTH_DOMAIN=your_domain
     VITE_FIREBASE_PROJECT_ID=your_project_id
     VITE_FIREBASE_STORAGE_BUCKET=your_bucket
     VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
     VITE_FIREBASE_APP_ID=your_app_id
     VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
     ```
   - Click "Deploy"

3. **Auto-Deploy**
   - Every push to `main` branch auto-deploys
   - Preview deployments for pull requests

### Option 2: Deploy via CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Build the project
npm run build:web

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

### Other Hosting Options

#### Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build
npm run build:web

# Deploy
netlify deploy --prod --dir=dist
```

#### GitHub Pages

```bash
# Install gh-pages
npm install -D gh-pages

# Add to package.json scripts:
"deploy:gh": "npm run build:web && gh-pages -d dist"

# Deploy
npm run deploy:gh
```

## 🖥️ Desktop Distribution

### Prerequisites

1. **Code Signing Certificates (Optional but Recommended)**

   - **macOS**: Apple Developer Account ($99/year)
   - **Windows**: Code signing certificate (~$100-400)
   - Without signing: Users get security warnings

2. **Build Icons**
   - Place icons in `build/` directory:
     - `icon.icns` (macOS, 1024x1024)
     - `icon.ico` (Windows, multi-size)
     - `icon.png` (Linux, 512x512)

### Building Desktop Apps

#### Windows (.exe)

On Windows machine:

```bash
npm run electron:build:win
```

Output files in `release/`:

- `TMDB Worlder Setup 1.0.0.exe` (NSIS Installer)
- `TMDB Worlder 1.0.0.exe` (Portable)

**Distribution:**

1. Upload to GitHub Releases
2. Users download and install
3. Supports auto-updates

#### macOS (.dmg)

On macOS machine:

```bash
npm run electron:build:mac
```

Output files in `release/`:

- `TMDB Worlder-1.0.0.dmg` (Installer)
- `TMDB Worlder-1.0.0-mac.zip` (ZIP Archive)

**Distribution:**

1. Upload to GitHub Releases
2. Users drag to Applications folder
3. Without signing: Users need to right-click > Open

#### Linux (.AppImage, .deb)

On Linux machine:

```bash
npm run electron:build:linux
```

Output files in `release/`:

- `TMDB Worlder-1.0.0.AppImage` (Universal, no install)
- `tmdb-worlder_1.0.0_amd64.deb` (Debian/Ubuntu)

**Distribution:**

1. Upload to GitHub Releases
2. AppImage: Make executable, double-click
3. .deb: Install with package manager

### Cross-Platform Building with GitHub Actions

Create `.github/workflows/build.yml`:

```yaml
name: Build Desktop Apps

on:
  push:
    tags:
      - "v*"

jobs:
  build:
    runs-on: ${{ matrix.os }}
    strategy:
      matrix:
        os: [macos-latest, ubuntu-latest, windows-latest]

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: 18

      - name: Install dependencies
        run: npm install

      - name: Build app (Windows)
        if: matrix.os == 'windows-latest'
        run: npm run electron:build:win

      - name: Build app (macOS)
        if: matrix.os == 'macos-latest'
        run: npm run electron:build:mac
        env:
          CSC_LINK: ${{ secrets.MAC_CERT }}
          CSC_KEY_PASSWORD: ${{ secrets.MAC_CERT_PASSWORD }}

      - name: Build app (Linux)
        if: matrix.os == 'ubuntu-latest'
        run: npm run electron:build:linux

      - name: Upload artifacts
        uses: actions/upload-artifact@v3
        with:
          name: ${{ matrix.os }}-build
          path: release/*
```

Push a tag to trigger:

```bash
git tag v1.0.0
git push origin v1.0.0
```

### Creating GitHub Releases

1. **Create Release**

   ```bash
   # Tag your version
   git tag v1.0.0
   git push origin v1.0.0
   ```

2. **Upload Binaries**

   - Go to GitHub → Releases → Draft a new release
   - Choose your tag (v1.0.0)
   - Upload files from `release/` folder
   - Write release notes

3. **Users Download**
   - Visit your GitHub releases page
   - Download appropriate installer
   - Install and run

## 🔄 Auto-Updates

### Setup electron-updater

1. **Install**

   ```bash
   npm install electron-updater
   ```

2. **Update `electron/main.js`**

   ```javascript
   const { autoUpdater } = require("electron-updater");

   app.whenReady().then(() => {
     createWindow();

     // Check for updates
     autoUpdater.checkForUpdatesAndNotify();
   });

   autoUpdater.on("update-available", () => {
     console.log("Update available");
   });

   autoUpdater.on("update-downloaded", () => {
     autoUpdater.quitAndInstall();
   });
   ```

3. **Configure in package.json**

   ```json
   {
     "build": {
       "publish": {
         "provider": "github",
         "owner": "yourusername",
         "repo": "tmdb-worlder"
       }
     }
   }
   ```

4. **Release Process**
   - Build new version
   - Create GitHub release with files
   - Users get notified of updates automatically

## 🔐 Code Signing

### macOS Code Signing

1. **Get Certificate**

   - Enroll in Apple Developer Program
   - Create Developer ID Application certificate
   - Download and install in Keychain

2. **Configure**

   ```json
   {
     "build": {
       "mac": {
         "identity": "Developer ID Application: Your Name (TEAM_ID)",
         "hardenedRuntime": true,
         "gatekeeperAssess": false,
         "entitlements": "build/entitlements.mac.plist",
         "entitlementsInherit": "build/entitlements.mac.plist"
       }
     }
   }
   ```

3. **Build**
   ```bash
   CSC_LINK=/path/to/certificate.p12 CSC_KEY_PASSWORD=password npm run electron:build:mac
   ```

### Windows Code Signing

1. **Get Certificate**

   - Purchase from trusted CA (DigiCert, Sectigo, etc.)
   - Receive .pfx or .p12 file

2. **Configure**

   ```json
   {
     "build": {
       "win": {
         "certificateFile": "path/to/certificate.pfx",
         "certificatePassword": "password"
       }
     }
   }
   ```

3. **Build**
   ```bash
   npm run electron:build:win
   ```

## 📊 Analytics & Monitoring

### Web Analytics (Firebase)

Already configured! Firebase Analytics tracks:

- Page views
- User interactions
- Sign-ups and logins

### Desktop Analytics

Same Firebase Analytics works in Electron:

- User activities tracked
- Custom events logged
- Works offline, syncs when online

### Error Tracking (Optional)

Add Sentry:

```bash
npm install @sentry/react @sentry/electron
```

Configure in `src/main.tsx`:

```typescript
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "your-sentry-dsn",
  environment: import.meta.env.MODE,
});
```

## 🚀 Deployment Checklist

### Before Deploying Web

- [ ] Environment variables configured
- [ ] Firebase services enabled
- [ ] Build succeeds locally (`npm run build:web`)
- [ ] Test with `npm run preview`
- [ ] All features work in production mode
- [ ] Analytics working
- [ ] Authentication working

### Before Releasing Desktop

- [ ] Version updated in package.json
- [ ] Icons added to `build/` folder
- [ ] Build succeeds (`npm run electron:build`)
- [ ] App launches correctly
- [ ] All features work (auth, DB, analytics)
- [ ] Firebase works (not blocked by firewall)
- [ ] Tested on target platform
- [ ] Release notes written

## 📱 Multi-Platform Testing

### Test Environments

**Web:**

- Chrome, Firefox, Safari, Edge
- Desktop and mobile views
- Different screen sizes

**Desktop:**

- Windows 10/11
- macOS 11+ (Big Sur and newer)
- Ubuntu 20.04+ / Debian-based Linux

### Testing Checklist

- [ ] Login/Signup works
- [ ] Social auth works (Google, Facebook, Twitter)
- [ ] Database read/write works
- [ ] Theme switching works
- [ ] Language switching works
- [ ] Analytics events tracked
- [ ] Offline behavior acceptable
- [ ] Window resize/maximize works (desktop)
- [ ] App icon displays correctly (desktop)

## 🔧 Troubleshooting

### Web Deploy Fails

- Check environment variables in Vercel dashboard
- Verify build command is `npm run build:web`
- Check build logs for errors

### Desktop Build Fails

- Ensure icons exist in `build/` directory
- Check Node.js version (18+)
- Install platform-specific dependencies
- Clear cache: `rm -rf release node_modules && npm install`

### App Won't Start After Install

- Check antivirus/firewall (desktop)
- Verify Firebase config is correct
- Check browser console (web) or Electron logs (desktop)

## 📚 Resources

- [Vercel Deployment Docs](https://vercel.com/docs)
- [Electron Builder Docs](https://www.electron.build/)
- [Code Signing Guide](https://www.electron.build/code-signing)
- [Firebase Hosting](https://firebase.google.com/docs/hosting)
- [GitHub Actions](https://docs.github.com/en/actions)

## 🎉 Post-Deployment

### After Web Deployment

1. Visit your Vercel URL
2. Test all features
3. Share with users
4. Monitor Firebase Analytics

### After Desktop Release

1. Create GitHub Release
2. Upload installers
3. Write release notes
4. Announce to users
5. Monitor for issues

### Marketing

- Add download badges to README
- Create landing page
- Share on social media
- Submit to app directories (if applicable)

## 💡 Tips

1. **Version Control**: Use semantic versioning (1.0.0, 1.1.0, 2.0.0)
2. **Changelog**: Keep a CHANGELOG.md file
3. **Beta Testing**: Release to small group first
4. **Backup**: Keep copies of signed installers
5. **Documentation**: Keep docs updated with each release
