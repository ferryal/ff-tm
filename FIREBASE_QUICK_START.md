# 🔥 Firebase Authentication - Quick Start Guide

## Current Issue: 400 Bad Request

The error you're seeing means Firebase is not properly configured. Follow these steps to fix it:

## ⚡ Quick Fix (5 minutes)

### Step 1: Create Firebase Project

1. Go to https://console.firebase.google.com/
2. Click **"Add project"** or **"Create a project"**
3. Enter a project name (e.g., "tmdb-worlder")
4. Disable Google Analytics (optional, can enable later)
5. Click **"Create project"**

### Step 2: Register Web App

1. In your Firebase project overview, click the **Web icon** (`</>`)
2. Register app with nickname: **"TMDB Worlder Web"**
3. **Copy the configuration** - you'll need this!
4. Click **"Continue to console"**

### Step 3: Enable Authentication

1. In Firebase Console sidebar, click **"Authentication"**
2. Click **"Get started"** button
3. Click **"Sign-in method"** tab

**Enable Email/Password:**

- Click "Email/Password"
- Toggle **Enable** ON
- Click **"Save"**

**Enable Google Sign-In:**

- Click "Google"
- Toggle **Enable** ON
- Select a support email from dropdown
- Click **"Save"**

### Step 4: Set Up Firestore

1. In sidebar, click **"Firestore Database"**
2. Click **"Create database"**
3. Select **"Start in production mode"** (recommended)
4. Choose a location (closest to your users)
5. Click **"Enable"**

**Set Firestore Rules:**

1. Click **"Rules"** tab
2. Replace with this:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }

    match /users/{userId}/favorites/{movieId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    match /users/{userId}/activities/{activityId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

3. Click **"Publish"**

### Step 5: Create .env File

1. In your project root, create a file named `.env`:

```bash
# In terminal (project root):
touch .env
```

2. Open `.env` and add your Firebase config:

```env
# TMDB API (keep your existing key)
VITE_TMDB_API_KEY=your_existing_tmdb_key_here
VITE_TMDB_API_URL=https://api.themoviedb.org/3

# Firebase Configuration (from Step 2)
VITE_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abcdef123456
VITE_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
```

**Important:** Replace the values with YOUR Firebase config values from Step 2!

### Step 6: Restart Dev Server

```bash
# Stop the current server (Ctrl+C)
# Then restart:
npm run dev
```

## ✅ Testing

1. Go to http://localhost:5173/login
2. Try to sign up with email/password
3. Try Google sign-in
4. Check Firebase Console → Authentication → Users to see if user was created

## 🎯 What's Protected Now

After successful authentication, you can access:

- **/** (Home) - Protected ✅
- **/movies** - Protected ✅
- **/movie/:id** (Movie Details) - Protected ✅
- **/favorites** - Protected ✅
- **/dashboard** - Protected ✅

Without login, you'll be redirected to `/login`

## 🔧 Optional: Facebook & Twitter Login

### Facebook Login:

1. Create app at https://developers.facebook.com/
2. Get App ID & App Secret
3. In Firebase → Authentication → Sign-in method → Facebook:
   - Enable it
   - Add App ID & Secret
   - Copy OAuth redirect URI
4. Add redirect URI to Facebook App settings

### Twitter Login:

1. Create app at https://developer.twitter.com/
2. Get API Key & API Secret
3. In Firebase → Authentication → Sign-in method → Twitter:
   - Enable it
   - Add API Key & Secret
   - Copy callback URL
4. Add callback URL to Twitter App settings

## 🚨 Common Issues

### Still getting 400 errors?

- ✅ Check all environment variables are set in `.env`
- ✅ Restart dev server after creating `.env`
- ✅ Verify Authentication is enabled in Firebase Console
- ✅ Check Firebase project ID matches in `.env`

### "auth/configuration-not-found"

- Enable Authentication in Firebase Console

### "auth/unauthorized-domain"

- Go to Firebase → Authentication → Settings → Authorized domains
- Add `localhost` and your domain

### Google popup blocked?

- Allow popups in browser
- Or use redirect instead of popup (see authService.ts)

## 📚 Resources

- [Firebase Console](https://console.firebase.google.com/)
- [Firebase Auth Docs](https://firebase.google.com/docs/auth)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)

---

**Need Help?** Check the detailed guide in `FIREBASE_SETUP.md`
