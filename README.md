# TMDB Worlder

A modern React TypeScript application built with Vite, featuring Firebase authentication, internationalization, and dark mode support. **Supports both web deployment and desktop application (Electron)**.

## Features

- **React + TypeScript + Vite**: Fast development with modern tooling
- **TanStack Query + Axios**: Powerful data fetching and state management
- **Tailwind CSS + Shadcn UI**: Beautiful, responsive UI components
- **Firebase Integration**:
  - Authentication (Email/Password + Social Login: Google)
  - Firestore for data storage
  - Analytics for user activity tracking
- **i18n Support**: English and Indonesian translations
- **Zustand**: Lightweight state management
- **Dark & Light Mode**: Theme switching with persistence
- **React Router**: Client-side routing with protected routes
- **Electron.js**: Desktop app support for Windows, macOS, and Linux
- **Dual Deployment**: Same codebase for web (Vercel) and desktop (.exe, .dmg, .AppImage)

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Firebase project

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Firebase & TMDB

Create a `.env` file in the root directory and add your Firebase credentials:

```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain_here
VITE_FIREBASE_PROJECT_ID=your_project_id_here
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket_here
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id_here
VITE_FIREBASE_APP_ID=your_app_id_here
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id_here
VITE_TMDB_API_KEY=your_tmdb_api_key_here
VITE_API_BASE_URL=https://api.themoviedb.org/3
```

You can find these credentials in your Firebase Console:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to Project Settings > General
4. Scroll down to "Your apps" section
5. Copy the config values

### 3. Enable Firebase Authentication

In your Firebase Console:

1. Go to Authentication > Sign-in method
2. Enable Email/Password
3. Enable Google, Facebook, and Twitter (optional)

### 4. Set up Firestore

1. Go to Firestore Database in Firebase Console
2. Create database
3. Start in production mode or test mode

### 5. Enable Firebase Analytics

1. Go to Analytics in Firebase Console
2. Enable Google Analytics for your project

## Development

### Web Development

Start the Vite development server:

```bash
npm run dev
```

Open `http://localhost:5173`

### Desktop Development (Electron)

Start the Electron desktop app in development mode:

```bash
npm run electron:dev
```

This launches the desktop app with hot-reload enabled.

## Build & Deploy

### Web Deployment (Vercel, Netlify, etc.)

Build for web:

```bash
npm run build:web
```

Deploy the `dist/` folder to Vercel:

```bash
npx vercel --prod
```

Or push to GitHub and connect with Vercel.

### Desktop Application

Build desktop executables:

```bash
# Build for current platform
npm run electron:build

# Build for specific platforms
npm run electron:build:win    # Windows .exe
npm run electron:build:mac    # macOS .dmg
npm run electron:build:linux  # Linux .AppImage
```

Output: `release/` folder with installable files.

**📘 See [ELECTRON.md](./ELECTRON.md) for detailed desktop app guide.**

## Preview Production Build

```bash
npm run preview
```

## Project Structure

```
src/
├── components/
│   ├── auth/           # Authentication components
│   ├── ui/             # Shadcn UI components
│   ├── Navbar.tsx
│   ├── ThemeProvider.tsx
│   ├── ThemeToggle.tsx
│   └── LanguageToggle.tsx
├── config/
│   └── firebase.ts     # Firebase configuration
├── i18n/
│   ├── config.ts       # i18n configuration
│   └── locales/        # Translation files
├── lib/
│   ├── axios.ts        # Axios instance
│   └── utils.ts        # Utility functions
├── pages/              # Page components
├── services/           # API and service functions
├── store/              # Zustand stores
├── App.tsx
└── main.tsx
```

## License

MIT
