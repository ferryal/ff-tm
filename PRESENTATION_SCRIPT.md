TMDB Worlder — Speaker Notes for Senior Frontend Engineer Interview (20–25 mins)

### 0:00 – 0:45 • Opening & Value Proposition

- **Intro**: I’ll walk through TMDB Worlder, a React + TypeScript app that runs as both a web and desktop app (Electron) from the same codebase.
- **Focus**: Architecture, reasoning, code quality, developer experience, and a live demo (web + Electron), then tests, deployment, and Q&A.

### 0:45 – 1:30 • Goals & Senior-IC Focus

- **Goals**: Demonstrate system design in the frontend, robust state management, safe desktop integration, scalable component patterns, and DX.
- **Role fit**: I’ll highlight trade-offs, performance, accessibility, testing, and release/distribution.

### 1:30 – 3:00 • High-Level Architecture

- **Stack**: React 19, TypeScript, Vite, Tailwind + shadcn/ui, Zustand (app state), TanStack Query (server state), Firebase (Auth/Firestore/Analytics), Electron.
- **Key idea**: One codebase, two runtimes (web + Electron) with a secure preload bridge; platform detection is non-invasive.
- **Data Flow**:
  - Auth → Firebase → `authStore` → `ProtectedRoute` gates routes
  - Movies → React Query + Axios → TMDB API → cached in `QueryClient`
  - Favorites → Zustand + localStorage, optional Firestore sync when logged-in

### 3:00 – 4:00 • Quick Repo Tour (files-by-purpose)

- `src/` components, pages, hooks, lib, store, services, i18n, types
- `electron/` main & preload for desktop
- `dist/` web build, `release/` desktop bundles
- `package.json` scripts for dev, build, test, and Electron packaging

### 4:00 – 5:30 • Core Flows at a Glance

- **Auth lifecycle**: `onAuthStateChanged` hydrates `authStore`, routes protected by `ProtectedRoute`.
- **Movies**: `useMovies` hooks fetch categories, details, credits, videos with React Query; debounced search avoids wasteful calls.
- **Favorites**: Local-first via Zustand + localStorage; Firestore sync on login.

### 5:30 – 9:00 • Code Walkthrough (selected excerpts)

- Providers and boundaries (`src/main.tsx`): QueryClientProvider, ThemeProvider, ErrorBoundary.

```19:27:/Users/ferryal/Documents/test-interview/tmdb-worlder/src/main.tsx
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  </StrictMode>
);
```

- Routing and protection (`src/App.tsx`): auth hydration, favorites load, analytics, and protected routes.

```39:90:/Users/ferryal/Documents/test-interview/tmdb-worlder/src/App.tsx
return (
  <BrowserRouter>
    <div className="min-h-screen bg-background">
      {user && <Navbar />}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/movies"
          element={
            <ProtectedRoute>
              <Movies />
            </ProtectedRoute>
          }
        />
        <Route
          path="/movie/:id"
          element={
            <ProtectedRoute>
              <MovieDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/favorites"
          element={
            <ProtectedRoute>
              <Favorites />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  </BrowserRouter>
);
```

- API client (`src/lib/axios.ts`): base URL from env, bearer token injected via interceptor.

```3:16:/Users/ferryal/Documents/test-interview/tmdb-worlder/src/lib/axios.ts
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "https://api.themoviedb.org/3",
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = import.meta.env.VITE_TMDB_API_KEY;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

- Data hooks (`src/hooks/useMovies.ts`): category queries, search, details/credits/videos, with `enabled` flags and stable `queryKey`s.

```10:21:/Users/ferryal/Documents/test-interview/tmdb-worlder/src/hooks/useMovies.ts
export const usePopularMovies = (page?: number) => {
  return useQuery<MoviesResponse>({
    queryKey: ["movies", "popular", page],
    queryFn: async () => {
      const response = await api.get("/movie/popular", { params: { page: page || 1 } });
      return response.data;
    },
    enabled: page !== undefined,
  });
};
```

- Movies page (`src/pages/Movies.tsx`): debounced search, conditional category fetching, pagination, resilient loading UI.

```112:141:/Users/ferryal/Documents/test-interview/tmdb-worlder/src/pages/Movies.tsx
return (
  <div className="container mx-auto px-4 py-8">
    <div className="mb-8">
      <h1 className="text-4xl font-bold mb-6">Discover Movies</h1>
      <div className="flex flex-col gap-6">
        <SearchBar onSearch={handleSearch} placeholder="Search for movies..." />
        {!isSearching && (
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button key={category.id} variant={
                activeCategory === category.id ? "default" : "outline"
              } onClick={() => handleCategoryChange(category.id)}>
                {category.label}
              </Button>
            ))}
          </div>
        )}
      </div>
    </div>
```

- Electron preload and security: Node disabled in renderer, strict contextIsolation, safe API exposure.

```204:211:/Users/ferryal/Documents/test-interview/tmdb-worlder/ARCHITECTURE_EXPLANATION.md
// Preload script - secure bridge
const { contextBridge } = require("electron");

contextBridge.exposeInMainWorld("electron", {
  isElectron: true,
  platform: process.platform, // "darwin" | "win32" | "linux"
});
```

### 9:00 – 14:00 • Live Demo Script (web first, then desktop)

Prereqs (if needed): ensure `.env` has Firebase + TMDB keys.

- Start web dev server:
  - Command: `npm run dev` (open http://localhost:5173)
- Auth flow:
  - Navigate to Login → sign up or log in (email/password)
  - Observe navbar appears when authenticated (protected routes)
- i18n + Theme:
  - Toggle language (English/Indonesian) and theme (dark/light), refresh to show persistence
- Movies:
  - Go to `Movies` → switch categories (Popular/Now Playing/Upcoming/Top Rated)
  - Use search; show debounced network activity, results list
  - Pagination: next/prev with smooth scroll
- Details + Trailer:
  - Open a movie → show details (genres, rating, cast grid)
  - Play trailer in modal; close with ESC
- Favorites:
  - Toggle heart on a few movies; open `Favorites` page to confirm
  - Refresh to show local persistence; if logged in, mention Firestore sync

Desktop (Electron):

- Start desktop dev:
  - Command: `npm run electron:dev` (auto-opens window)
- Show identical experience in Electron; note secure preload bridge and disabled Node in renderer.

If something breaks (fallback):

- No Firebase/TMDB keys? Still demo UI/UX (theme/i18n/navigation), unit tests, and desktop shell; optionally narrate API calls with Network tab screenshots or mock flows.

### 14:00 – 16:00 • Testing

- Command(s): `npm test`, `npm run test:watch`, `npm run test:coverage`
- Coverage highlights: component tests for `Navbar`, `ThemeToggle`, `LanguageToggle`, `MovieCard`, `SearchBar`, and UI primitives.
- Key point: colocated tests under `__tests__` with simple arrangements for maintainability.

### 16:00 – 18:30 • Deployment & Distribution

- Web:
  - Command: `npm run build:web` → `dist/`
  - Deploy to Vercel (recommended) with `dist/` as output; env vars in dashboard
- Desktop:
  - `npm run electron:build` (current OS) or platform-specific `:win | :mac | :linux`
  - Outputs installers in `release//`
  - Notes: code signing, auto-updates with `electron-updater`, GitHub Releases for distribution

### 18:30 – 20:30 • Trade-offs, Decisions, and Improvements

- **Zustand vs React Context**: minimal boilerplate, explicit stores, persistence; React Query for server cache separation.
- **Axios + interceptors**: centralizes auth headers and error handling; easy swap/testing.
- **Electron security**: `contextIsolation: true`, `nodeIntegration: false`, preload-only bridge; avoids supply-chain or XSS elevation risks.
- **Performance**: debounced search, conditional queries (`enabled`), query caching, lazy images; future: route-based code splitting, virtualization for very large grids, PWA/offline cache.
- **Accessibility**: semantic structure, keyboard support, focus management in modal; future: audit with tooling (axe, pa11y), add aria refinements.

### 20:30 – End • Q&A Anchor Points

- How would you scale features across web + desktop while keeping one codebase?
- Where would you add E2E tests and contract tests for the TMDB API?
- What is your performance budget and how do you enforce it in CI?
- How do you handle secrets and environment differences (local/staging/prod/desktop)?

---

## Quick Command Reference (for live demo)

- Install deps: `npm install`
- Web dev: `npm run dev`
- Electron dev: `npm run electron:dev`
- Unit tests: `npm test`
- Build web: `npm run build:web`
- Build desktop: `npm run electron:build`

## Environment Notes

- TMDB API: `VITE_TMDB_API_KEY` (read-access bearer), `VITE_API_BASE_URL` optional
- Firebase: `VITE_FIREBASE_*` per `SETUP.md` and `PROJECT_SUMMARY.md`

## One-slide Architecture Recap (talk track)

- UI (React + shadcn/Tailwind) → app state (Zustand) + server state (React Query) → Services (Axios) → TMDB API and Firebase
- Electron uses secure preload to expose a tiny, typed surface: same React app runs as desktop without Node in renderer

## Appendix: References

- See `ARCHITECTURE_EXPLANATION.md`, `PROJECT_SUMMARY.md`, `TMDB_INTEGRATION.md`, `SCRIPTS.md`, `DEPLOYMENT.md`, `TESTING.md`
