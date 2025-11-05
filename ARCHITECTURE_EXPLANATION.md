# TMDB Worlder - Architecture & Lifecycle Explanation

## 📖 Codebase Overview

**TMDB Worlder** is a hybrid application that can run as both a **web app** (deployed to Vercel) and a **desktop app** (using Electron) from the same codebase.

### Tech Stack

- **Frontend:** React 19 + TypeScript + Vite
- **Styling:** Tailwind CSS + Shadcn UI components
- **State Management:** 
  - Zustand (global state: auth, theme, language)
  - TanStack Query (server state: movies, API data)
- **Backend:** Firebase (Auth, Firestore, Analytics)
- **Desktop:** Electron.js
- **Testing:** Jest + React Testing Library
- **i18n:** i18next (English & Indonesian)
- **Forms:** React Hook Form + Zod validation

---

## 🏗️ Application Architecture

### High-Level Structure

```
┌─────────────────────────────────────────────────┐
│              User Interface (React)             │
│  ┌───────────┐  ┌────────────┐  ┌───────────┐  │
│  │  Pages    │  │ Components │  │   Hooks   │  │
│  └───────────┘  └────────────┘  └───────────┘  │
└─────────────────────────────────────────────────┘
                   ↓
┌─────────────────────────────────────────────────┐
│              State Management                   │
│  ┌───────────┐  ┌──────────────────────────┐    │
│  │ Zustand   │  │   TanStack Query         │    │
│  │ (Global)  │  │   (Server State)         │    │
│  └───────────┘  └──────────────────────────┘    │
└─────────────────────────────────────────────────┘
                   ↓
┌─────────────────────────────────────────────────┐
│              External Services                  │
│  ┌─────────────┐  ┌────────────────────┐       │
│  │   Firebase  │  │     TMDB API       │       │
│  │ (Auth, DB)  │  │   (Movie Data)     │       │
│  └─────────────┘  └────────────────────┘       │
└─────────────────────────────────────────────────┘
```

### Directory Structure

```
src/
├── components/          # Reusable UI components
│   ├── auth/           # Login, Signup forms
│   ├── movies/         # Movie-specific components
│   ├── ui/             # Shadcn base components
│   ├── Navbar.tsx      # Main navigation
│   ├── ErrorBoundary.tsx  # Error handling
│   └── ...
├── pages/              # Route components
│   ├── Home.tsx        # Landing page
│   ├── Movies.tsx      # Browse movies
│   ├── MovieDetails.tsx # Movie info
│   ├── Favorites.tsx   # Saved movies
│   ├── Login.tsx       # Authentication
│   └── ...
├── store/              # Zustand stores
│   ├── authStore.ts    # User auth state
│   ├── favoritesStore.ts # Favorites state
│   ├── themeStore.ts   # Dark/light mode
│   └── languageStore.ts # i18n state
├── hooks/              # Custom React hooks
│   ├── useMovies.ts    # TMDB API hooks
│   ├── useFavorites.ts # Favorites logic
│   ├── useDebounce.ts  # Search optimization
│   └── ...
├── services/           # Business logic
│   ├── authService.ts  # Firebase auth
│   └── analyticsService.ts # Tracking
├── lib/                # Utilities
│   ├── axios.ts        # HTTP client
│   ├── tmdb.ts         # TMDB helpers
│   └── utils.ts        # Common functions
├── config/             # Configuration
│   └── firebase.ts     # Firebase setup
├── i18n/               # Translations
│   ├── config.ts
│   └── locales/
└── types/              # TypeScript definitions
    ├── movie.ts
    └── electron.d.ts
```

---

## ⚡ Electron Lifecycle

### What is Electron?

Electron wraps your web app in a desktop application shell. It has **3 main processes:**

```
┌─────────────────────────────────────────────────────┐
│                 Main Process                        │
│  (Node.js environment, manages app lifecycle)       │
│  - Creates windows                                  │
│  - Handles system events                            │
│  - Native OS APIs                                   │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│              Preload Script                         │
│  (Secure bridge between Main & Renderer)            │
│  - Exposes safe API to renderer                     │
│  - Context isolation                                │
│  - IPC communication                                │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│              Renderer Process                       │
│  (Chromium browser running your React app)          │
│  - Your React app runs here                         │
│  - DOM rendering                                    │
│  - No direct Node.js access                         │
└─────────────────────────────────────────────────────┘
```

### Electron Lifecycle Flow

```
1. App Start
   └─> electron/main.cjs runs
       └─> app.whenReady() fires
           └─> createWindow() creates BrowserWindow

2. Window Creation
   └─> Loads preload script (preload.cjs)
       └─> Context Bridge sets up secure APIs
           └─> Loads your React app (index.html)
               └─> React renders

3. Development Mode
   └─> mainWindow.loadURL("http://localhost:5173")
       └─> Vite dev server serves React app
           └─> Hot reload works!

4. Production Mode
   └─> mainWindow.loadFile("dist/index.html")
       └─> Built static files served from disk

5. App Events
   ├─> app.on("window-all-closed")
   ├─> app.on("activate") (macOS)
   └─> mainWindow.on("closed")
```

### Current Electron Implementation

#### `electron/main.cjs`
```javascript
// Main process - manages app lifecycle
const { app, BrowserWindow } = require("electron");

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, "preload.cjs"), // ← Bridge
      nodeIntegration: false,  // Security: disable
      contextIsolation: true,  // Security: enable
    },
  });

  if (isDev) {
    mainWindow.loadURL("http://localhost:5173");  // Dev mode
    mainWindow.webContents.openDevTools();        // Auto-open DevTools
  } else {
    mainWindow.loadFile(path.join(__dirname, "../dist/index.html")); // Prod
  }
}

app.whenReady().then(() => {
  createWindow();
  
  // macOS: re-create window when dock icon clicked
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Windows/Linux: quit when all windows closed
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit(); // macOS stays alive
});
```

#### `electron/preload.cjs`
```javascript
// Preload script - secure bridge
const { contextBridge } = require("electron");

contextBridge.exposeInMainWorld("electron", {
  isElectron: true,
  platform: process.platform, // "darwin" | "win32" | "linux"
});
```

#### `src/types/electron.d.ts`
```typescript
// TypeScript definitions for window.electron
export interface ElectronAPI {
  isElectron: boolean;
  platform: string;
}

declare global {
  interface Window {
    electron?: ElectronAPI;
  }
}
```

### Why This Architecture?

**Security First:**
- `contextIsolation: true` - Prevents renderer from accessing Node.js directly
- `nodeIntegration: false` - Renderer can't use `require()`
- `preload` script acts as a controlled bridge

**Seamless Web/Desktop:**
- Same code runs in browser and Electron
- Detect platform: `window.electron?.isElectron`
- No code changes needed between environments

---

## 🔄 Data Flow

### Authentication Flow

```
User → LoginForm → authService.signInWithEmail()
                    ↓
              Firebase Auth
                    ↓
          onAuthStateChanged()
                    ↓
            authStore.setUser()
                    ↓
          ProtectedRoute checks user
                    ↓
        Render protected content ✅
```

### Movie Data Flow

```
Component → useMovies hook → TanStack Query
                              ↓
                        Axios client
                              ↓
                        TMDB API
                              ↓
                    Cached in QueryClient
                              ↓
              Component re-renders with data
```

### Favorites Flow

```
User clicks heart → useFavorites.toggleFavorite()
                            ↓
                    LocalStorage (immediate)
                            ↓
                    Zustand state updates
                            ↓
                    If logged in: Firestore sync
                            ↓
              UI updates with heart animation ✅
```

---

## 🎯 Key Design Patterns

### 1. **Separation of Concerns**

```
presentation logic → components/
business logic → services/
state logic → hooks/
data fetching → TanStack Query
persistent state → Zustand stores
```

### 2. **Conditional Rendering**

Only fetch what's needed:
```typescript
// Only fetch active category
const { data } = usePopularMovies(
  activeCategory === "popular" ? page : undefined
);
```

### 3. **Protected Routes**

```typescript
<ProtectedRoute>
  <Movies />  // Only renders if user is logged in
</ProtectedRoute>
```

### 4. **Error Boundaries**

```typescript
<ErrorBoundary>  // Catches any errors
  <App />
</ErrorBoundary>
```

---

## 🚀 Build Process

### Web Deployment

```
npm run build:web
├─> TypeScript compilation (tsc -b)
├─> Vite bundling
├─> React optimization
├─> Asset generation
└─> Output: dist/

Deploy dist/ to:
- Vercel (recommended)
- Netlify
- GitHub Pages
- Any static host
```

### Desktop Build

```
npm run electron:build
├─> Build web app (npm run build)
├─> Electron Builder bundles:
│   ├─> Your built web app (dist/)
│   ├─> Electron runtime
│   ├─> Node.js dependencies
│   ├─> Icons and metadata
│   └─> Native modules
└─> Output: release/ (exe, dmg, AppImage)
```

---

## 🔐 Security Considerations

### Web App Security
- ✅ Firebase handles authentication
- ✅ Environment variables for API keys
- ✅ HTTPS enforced in production
- ✅ CORS handled by Firebase/TMDB

### Electron Security
- ✅ Context isolation enabled
- ✅ Node integration disabled
- ✅ Preload script for controlled IPC
- ✅ No direct Node.js access from renderer

### Recommendations Added
- ⚠️ Add Content Security Policy (CSP)
- ⚠️ Implement rate limiting
- ⚠️ Sanitize user inputs

---

## 📊 State Management Strategy

### When to Use Zustand?
- Global app state (auth, theme, language)
- Needs persistence (localStorage)
- Favorites list
- Simple state updates

### When to Use TanStack Query?
- Server data (movies, API responses)
- Caching and refetching
- Optimistic updates
- Background synchronization
- Pagination

### Example: Favorites

```typescript
// Zustand for global state
const favorites = useFavoritesStore(state => state.movies);

// TanStack Query for server sync
const { data } = useQuery({
  queryKey: ['favorites', userId],
  queryFn: fetchFavoritesFromFirestore
});
```

---

## 🎨 Styling Architecture

### Tailwind CSS
- Utility-first CSS
- Responsive design built-in
- Dark mode via theme classes

### Shadcn UI
- Copy-paste components
- Fully customizable
- TypeScript support
- Accessible by default

### Theme System
```typescript
// Theme stored in Zustand
const { theme, toggleTheme } = useThemeStore();

// Applied via CSS variables
<div className="bg-background text-foreground">
```

---

## 🧪 Testing Strategy

### Current Coverage
- ✅ Component tests (Jest + RTL)
- ✅ Unit tests for utilities
- ✅ Hooks testing
- ⚠️ Missing: E2E tests

### Test Files
```
src/components/__tests__/
├── LanguageToggle.test.tsx
├── Navbar.test.tsx
├── ThemeToggle.test.tsx
└── ...

src/components/movies/__tests__/
├── MovieCard.test.tsx
└── SearchBar.test.tsx
```

---

## 🌐 Internationalization (i18n)

### Supported Languages
- English (en) - default
- Indonesian (id)

### How It Works

```typescript
// useTranslation hook
const { t } = useTranslation();

// In JSX
<h1>{t('welcome')}</h1>

// In translations file
{
  "welcome": "Welcome to TMDB Worlder"
}
```

---

## 📈 Performance Optimizations

### Implemented
- ✅ Debounced search (500ms)
- ✅ TanStack Query caching
- ✅ Conditional API fetching
- ✅ Lazy loading images
- ✅ Code splitting (Vite)

### Recommended
- ⚠️ Service Worker for offline
- ⚠️ Virtual scrolling for lists
- ⚠️ Route-based code splitting
- ⚠️ Image optimization pipeline

---

## 🔧 Development Workflow

### Local Development (Web)
```bash
npm run dev          # Vite dev server on :5173
```

### Local Development (Electron)
```bash
npm run electron:dev  # Launches Electron + dev server
```

### Build for Production
```bash
npm run build:web           # Web bundle
npm run electron:build      # Desktop app
npm run electron:build:win  # Windows specific
npm run electron:build:mac  # macOS specific
npm run electron:build:linux # Linux specific
```

---

## 📚 Key Files Explained

| File | Purpose |
|------|---------|
| `src/main.tsx` | React entry point, providers setup |
| `src/App.tsx` | Main app component, routing |
| `src/config/firebase.ts` | Firebase initialization |
| `electron/main.cjs` | Electron main process |
| `electron/preload.cjs` | IPC bridge setup |
| `vite.config.ts` | Build configuration |
| `package.json` | Dependencies & scripts |

---

## 🎓 Learning Resources

- [Electron Documentation](https://www.electronjs.org/docs)
- [TanStack Query Guide](https://tanstack.com/query/latest)
- [React Router](https://reactrouter.com/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Firebase Docs](https://firebase.google.com/docs)

---

## 🤝 Contributing

When adding features:
1. Follow existing code patterns
2. Add TypeScript types
3. Write tests for new components
4. Update documentation
5. Ensure web & electron both work

---

## 📝 Summary

**TMDB Worlder** successfully demonstrates:
- Modern React architecture
- Secure Electron integration
- Efficient state management
- Clean code organization
- Progressive enhancement

The codebase is well-structured, maintainable, and ready for production deployment.


