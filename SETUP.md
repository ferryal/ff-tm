# Setup Guide for TMDB Worlder

## Quick Start

Follow these steps to get the application up and running:

### 1. Install Dependencies

```bash
npm install
```

### 2. Firebase Configuration

#### Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or select an existing project
3. Follow the setup wizard

#### Get Firebase Configuration

1. In Firebase Console, go to Project Settings (gear icon)
2. Scroll down to "Your apps" section
3. Click the web icon (`</>`) to add a web app
4. Register your app
5. Copy the configuration values

#### Create Environment File

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env` and replace the placeholder values with your Firebase credentials:

```env
VITE_FIREBASE_API_KEY=your_actual_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

```
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB13mEUVlZ7I-x5S2ug77AtbI5CKWDcPMo",
  authDomain: "tmdb-worlder.firebaseapp.com",
  projectId: "tmdb-worlder",
  storageBucket: "tmdb-worlder.firebasestorage.app",
  messagingSenderId: "200909268825",
  appId: "1:200909268825:web:3e035204820f550bae8e48",
  measurementId: "G-QTBKQGPKDS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
```

### 3. Enable Firebase Services

#### Authentication

1. In Firebase Console, go to **Authentication**
2. Click **Get Started**
3. Enable the following sign-in methods:
   - **Email/Password**: Click and toggle to enable
   - **Google**: Click, enable, and configure OAuth consent screen
   - **Facebook** (optional): Enable and add App ID and App Secret
   - **Twitter** (optional): Enable and add API key and API secret

#### Firestore Database

1. Go to **Firestore Database** in Firebase Console
2. Click **Create database**
3. Choose **Start in test mode** or **production mode**
4. Select a region
5. Click **Enable**

#### Firebase Analytics

1. Go to **Analytics** in Firebase Console
2. Click **Enable Google Analytics**
3. Select or create a Google Analytics account
4. Accept terms and click **Enable Analytics**

### 4. Configure Firestore Security Rules

In Firestore Console, go to **Rules** tab and use these rules:

```
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

### 5. Run Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### 6. Build for Production

```bash
npm run build
```

### 7. Preview Production Build

```bash
npm run preview
```

## Features Overview

### Authentication

- Email/Password signup and login
- Google OAuth login
- Facebook OAuth login (requires Facebook App setup)
- Twitter OAuth login (requires Twitter Developer App setup)

### Internationalization

- Switch between English (EN) and Indonesian (ID)
- Translations automatically persist

### Theme

- Toggle between light and dark mode
- Theme preference is saved to localStorage

### Firebase Analytics

All user activities are automatically tracked:

- Page views
- User sign up
- User login/logout
- Custom user activities

## Project Structure

```
src/
├── components/       # Reusable UI components
│   ├── auth/        # Authentication forms
│   └── ui/          # Shadcn UI components
├── config/          # Configuration files
├── hooks/           # Custom React hooks with TanStack Query
├── i18n/            # Internationalization
├── lib/             # Utility libraries
├── pages/           # Page components
├── services/        # Firebase services
└── store/           # Zustand state management
```

## Troubleshooting

### Firebase Connection Issues

- Verify all environment variables are set correctly
- Check Firebase project settings match your `.env` file
- Ensure Firebase services are enabled in console

### Authentication Errors

- For social login, ensure OAuth providers are properly configured
- Check redirect URIs in provider settings
- Verify API keys and secrets are correct

### Build Errors

- Clear node_modules: `rm -rf node_modules package-lock.json && npm install`
- Clear Vite cache: `rm -rf node_modules/.vite`

## Additional Configuration

### TMDB API (Optional)

If you want to use the TMDB API features:

1. Get API key from [TMDB](https://www.themoviedb.org/settings/api)
2. Add to `.env`:

```env
VITE_TMDB_API_KEY=your_tmdb_api_key
```

## Support

For issues or questions, refer to:

- [Firebase Documentation](https://firebase.google.com/docs)
- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://react.dev/)
