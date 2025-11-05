# 🚨 Fix: Firebase 400 Bad Request Error

## The Problem

```
GET https://identitytoolkit.googleapis.com/v1/projects?key=... 400 (Bad Request)
```

## The Solution (3 Steps)

### Step 1: Go to Firebase Console

👉 https://console.firebase.google.com/

1. Create a new project (or select existing)
2. Click the Web icon (`</>`) to add web app
3. **COPY** the config object shown

### Step 2: Create .env File

Create a file named `.env` in your project root:

```env
VITE_TMDB_API_KEY=your_existing_tmdb_key

VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123
VITE_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXX
```

**Replace with YOUR values from Step 1!**

### Step 3: Enable Authentication

In Firebase Console:

1. Click **"Authentication"** in sidebar
2. Click **"Get started"**
3. Click **"Sign-in method"** tab
4. Enable **"Email/Password"** (toggle ON → Save)
5. Enable **"Google"** (toggle ON → select email → Save)

### Step 4: Create Firestore

1. Click **"Firestore Database"** in sidebar
2. Click **"Create database"**
3. Select **"Start in production mode"**
4. Click **"Enable"**

### Step 5: Restart Server

```bash
# Stop server (Ctrl+C)
npm run dev
```

## ✅ Done!

Now you can:

- Sign up with email/password at `/signup`
- Log in at `/login`
- Access all protected routes

## Still Not Working?

1. ✅ Check `.env` file exists in project root
2. ✅ Verify all values are from YOUR Firebase project
3. ✅ No quotes around values in `.env`
4. ✅ Server was restarted after creating `.env`
5. ✅ Authentication is enabled in Firebase Console

## Need More Help?

- Quick guide: `FIREBASE_QUICK_START.md`
- Detailed guide: `FIREBASE_SETUP.md`
- All changes: `FIREBASE_INTEGRATION_SUMMARY.md`
