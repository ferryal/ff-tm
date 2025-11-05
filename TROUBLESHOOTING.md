# Troubleshooting Guide

Common issues and solutions for TMDB Worlder development.

## 🔥 Electron Issues

### Error: `require is not defined in ES module scope`

**Problem:**

```
ReferenceError: require is not defined in ES module scope
```

**Solution:**
The Electron files must use `.cjs` extension (not `.js`) because the project uses ES modules.

**Files that should be `.cjs`:**

- `electron/main.cjs`
- `electron/preload.cjs`

**Check package.json:**

```json
{
  "main": "electron/main.cjs",
  "type": "module"
}
```

### Electron window won't open

**Problem:** Electron dev command runs but no window appears.

**Solution:**

1. Check if Vite dev server is running first
2. Verify port 5173 is available
3. Check console for errors in terminal

**Manual test:**

```bash
# Terminal 1
npm run dev

# Terminal 2 (wait for Vite to start)
npx electron .
```

### Preload script errors

**Problem:** `Cannot find module 'preload.js'`

**Solution:**
Ensure `electron/main.cjs` references the correct file:

```javascript
preload: path.join(__dirname, "preload.cjs");
```

## 🌐 Web Development Issues

### Port 5173 already in use

**Problem:**

```
Error: Port 5173 is already in use
```

**Solution:**

```bash
# Find and kill process using port 5173
lsof -ti:5173 | xargs kill -9

# Or use different port
npx vite --port 3000
```

### Vite build fails

**Problem:** Build errors during `npm run build:web`

**Solution:**

1. Clear cache: `rm -rf node_modules/.vite`
2. Reinstall: `rm -rf node_modules && npm install`
3. Check TypeScript errors: `npx tsc --noEmit`

## 🔥 Firebase Issues

### Firebase not configured error

**Problem:**

```
Firebase: No Firebase App '[DEFAULT]' has been created
```

**Solution:**

1. Check `.env` file exists
2. Verify all Firebase env vars are set
3. Restart dev server after changing `.env`

### Authentication redirect error

**Problem:** Social login redirects fail

**Solution:**

1. Add authorized domains in Firebase Console
2. For localhost: Already authorized by default
3. For production: Add your domain (e.g., `yourapp.vercel.app`)

### Firestore permission denied

**Problem:**

```
FirebaseError: Missing or insufficient permissions
```

**Solution:**
Update Firestore rules in Firebase Console:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    match /activities/{activityId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
    }
  }
}
```

## 📦 Build Issues

### Desktop build fails

**Problem:** `electron-builder` errors

**Solutions by platform:**

**macOS:**

```bash
# Install Xcode Command Line Tools
xcode-select --install

# Accept license
sudo xcodebuild -license accept
```

**Windows:**

```bash
# Install Windows Build Tools
npm install --global windows-build-tools
```

**Linux:**

```bash
# Install dependencies
sudo apt-get install -y libgtk-3-0 libnotify4 libnss3 libxss1 libxtst6 xdg-utils libatspi2.0-0 libdrm2 libgbm1 libxcb-dri3-0
```

### Icon errors

**Problem:**

```
Error: Application icon is not set
```

**Solution:**

1. Create `build/` folder
2. Add icons:
   - `build/icon.icns` (macOS)
   - `build/icon.ico` (Windows)
   - `build/icon.png` (Linux)

Or update `package.json` to skip icons temporarily:

```json
{
  "build": {
    "mac": {
      "icon": null
    },
    "win": {
      "icon": null
    }
  }
}
```

### Large bundle size warning

**Problem:**

```
Some chunks are larger than 500 kB after minification
```

**Solution (optional optimization):**
This is a warning, not an error. To optimize:

Add to `vite.config.ts`:

```typescript
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom", "react-router-dom"],
          firebase: ["firebase/app", "firebase/auth", "firebase/firestore"],
        },
      },
    },
  },
});
```

## 🎨 Styling Issues

### Tailwind classes not working

**Problem:** Tailwind classes have no effect

**Solution:**

1. Check `tailwind.config.js` content array includes your files
2. Verify `@tailwind` directives in `src/index.css`
3. Restart dev server

### Dark mode not working

**Problem:** Theme toggle doesn't change appearance

**Solution:**

1. Check `tailwind.config.js` has `darkMode: 'class'`
2. Verify `ThemeProvider` wraps your app in `main.tsx`
3. Check localStorage for saved theme

## 🌍 i18n Issues

### Translations not loading

**Problem:** Text shows keys instead of translations (e.g., "welcome" instead of "Welcome")

**Solution:**

1. Check JSON files in `src/i18n/locales/`
2. Verify i18n config imported in `main.tsx`
3. Check browser console for loading errors

### Language not persisting

**Problem:** Language resets on page reload

**Solution:**
Check `languageStore.ts` uses `persist` middleware:

```typescript
export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      language: "en",
      setLanguage: (language) => set({ language }),
    }),
    {
      name: "language-storage",
    }
  )
);
```

## 🔐 Environment Variables

### Environment variables not loading

**Problem:** `import.meta.env.VITE_*` is undefined

**Solution:**

1. Check `.env` file is in project root
2. Verify variables start with `VITE_`
3. Restart dev server (required after changing `.env`)

### Different values in desktop vs web

**Problem:** Env vars work in web but not desktop

**Solution:**
Desktop apps bundle env vars at build time:

1. Rebuild desktop app after changing `.env`
2. For dev: Restart `npm run electron:dev`

## 💾 State Management

### Zustand state not persisting

**Problem:** State resets on page reload

**Solution:**
Ensure store uses `persist` middleware:

```typescript
import { persist } from "zustand/middleware";

export const useMyStore = create<MyState>()(
  persist(
    (set) => ({
      /* state */
    }),
    { name: "my-storage" }
  )
);
```

### React Query cache issues

**Problem:** Data not updating/refetching

**Solution:**

```typescript
// Invalidate queries manually
import { useQueryClient } from "@tanstack/react-query";

const queryClient = useQueryClient();
queryClient.invalidateQueries({ queryKey: ["myData"] });
```

## 🚀 Deployment Issues

### Vercel build fails

**Problem:** Build fails on Vercel

**Solution:**

1. Check build command: `npm run build:web`
2. Check output directory: `dist`
3. Add env vars in Vercel dashboard
4. Check Node version matches local (18+)

### Desktop app won't install

**Problem:** Users can't install the app

**Solution:**

**macOS:**

- Users see "damaged app" warning
- Solution: Code sign the app or users right-click > Open

**Windows:**

- SmartScreen warning
- Solution: Code sign or users click "More info" > "Run anyway"

## 📱 Platform Detection

### Can't detect if running in Electron

**Problem:** `window.electron` is undefined

**Solution:**

1. Check `electron/preload.cjs` exposes the API
2. Verify TypeScript types in `src/types/electron.d.ts`
3. Use helper: `import { isElectron } from "@/lib/environment"`

## 🧪 Testing

### Tests fail with Firebase

**Problem:** Jest/Vitest can't mock Firebase

**Solution:**
Mock Firebase in test setup:

```typescript
vi.mock("firebase/app", () => ({
  initializeApp: vi.fn(),
}));
```

## 🔍 Debugging

### Enable verbose logging

**Vite:**

```bash
npm run dev -- --debug
```

**Electron:**

```bash
DEBUG=* npm run electron:dev
```

**Firebase:**

```typescript
// In src/config/firebase.ts
import { setLogLevel } from "firebase/app";
setLogLevel("debug");
```

### Check what's running

```bash
# Check if Vite is running
lsof -i:5173

# Check Node processes
ps aux | grep node

# Check Electron processes
ps aux | grep electron
```

## 🆘 Nuclear Options

When all else fails:

### Clean reinstall

```bash
# Remove everything
rm -rf node_modules package-lock.json dist release

# Reinstall
npm install

# Try again
npm run dev
```

### Clear all caches

```bash
# NPM cache
npm cache clean --force

# Vite cache
rm -rf node_modules/.vite

# Electron cache
rm -rf ~/.cache/electron

# OS caches (macOS)
rm -rf ~/Library/Caches/tmdb-worlder

# Reinstall
npm install
```

### Check versions

```bash
# Node version (should be 18+)
node --version

# NPM version
npm --version

# Check package.json engines if specified
cat package.json | grep engines -A 3
```

## 📚 Getting More Help

### Check logs

**Web:**

- Browser DevTools Console
- Network tab for API calls

**Desktop:**

- Terminal output from `npm run electron:dev`
- Electron DevTools (opens automatically in dev mode)

**Firebase:**

- Firebase Console → Usage tab
- Firestore rules simulator
- Authentication logs

### Debug checklist

- [ ] Check error message carefully
- [ ] Read terminal/console output
- [ ] Check if `.env` exists and is correct
- [ ] Verify Firebase services are enabled
- [ ] Try in different browser/platform
- [ ] Check if issue happens in both web and desktop
- [ ] Clear cache and reinstall
- [ ] Check documentation files
- [ ] Search GitHub issues (if open source)

## 🔗 Useful Commands

```bash
# Check for outdated packages
npm outdated

# Update all packages (careful!)
npm update

# Audit security issues
npm audit

# Fix security issues
npm audit fix

# Check TypeScript errors
npx tsc --noEmit

# Format code (if using Prettier)
npx prettier --write .

# Lint code
npm run lint
```

## 💡 Prevention Tips

1. **Always use latest LTS Node.js**
2. **Keep dependencies updated** (but test after updating)
3. **Commit working state** before major changes
4. **Test in both web and desktop** during development
5. **Check console** for warnings/errors regularly
6. **Read error messages** completely before searching

## 📞 Still Stuck?

If you've tried everything:

1. Check documentation files in project root
2. Review code in `src/` for examples
3. Check Firebase Console for service status
4. Verify all prerequisites are installed
5. Try the examples from documentation
6. Check if similar projects work

Remember: Most issues are configuration or environment related, not code bugs! 🐛
