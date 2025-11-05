# Firebase Setup Guide

This guide will help you set up Firebase Authentication for the TMDB Worlder application.

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or select an existing project
3. Follow the setup wizard to create your project
4. Enable Google Analytics (optional)

## Step 2: Register Your Web App

1. In your Firebase project, click the Web icon (`</>`) to add a web app
2. Register your app with a nickname (e.g., "TMDB Worlder")
3. Copy the Firebase configuration object - you'll need these values for your `.env` file
4. Click "Continue to console"

## Step 3: Enable Authentication Methods

1. In the Firebase Console, go to **Build** → **Authentication**
2. Click "Get started" if it's your first time
3. Go to the **Sign-in method** tab

### Enable Email/Password Authentication:

1. Click on "Email/Password"
2. Toggle "Enable"
3. Click "Save"

### Enable Google Sign-In:

1. Click on "Google"
2. Toggle "Enable"
3. Add a support email (required)
4. Click "Save"

### Enable Facebook Sign-In (Optional):

1. Create a Facebook App at [Facebook Developers](https://developers.facebook.com/)
2. Get your App ID and App Secret
3. In Firebase, click on "Facebook"
4. Toggle "Enable"
5. Enter your Facebook App ID and App Secret
6. Copy the OAuth redirect URI and add it to your Facebook App settings
7. Click "Save"

### Enable Twitter Sign-In (Optional):

1. Create a Twitter App at [Twitter Developer Portal](https://developer.twitter.com/)
2. Get your API Key and API Secret
3. In Firebase, click on "Twitter"
4. Toggle "Enable"
5. Enter your Twitter API Key and API Secret Key
6. Copy the callback URL and add it to your Twitter App settings
7. Click "Save"

## Step 4: Set Up Firestore Database

1. In the Firebase Console, go to **Build** → **Firestore Database**
2. Click "Create database"
3. Choose "Start in production mode" (recommended) or "Start in test mode"
4. Select your Cloud Firestore location
5. Click "Enable"

### Set Up Firestore Rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }

    // Favorites collection
    match /users/{userId}/favorites/{movieId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // User activities collection
    match /users/{userId}/activities/{activityId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## Step 5: Configure Environment Variables

1. Copy `.env.example` to `.env` in your project root:

   ```bash
   cp .env.example .env
   ```

2. Fill in your Firebase configuration values in `.env`:

   ```env
   VITE_FIREBASE_API_KEY=AIzaSy...
   VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
   VITE_FIREBASE_APP_ID=1:123456789:web:abcdef
   VITE_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
   ```

3. Also add your TMDB API key:
   ```env
   VITE_TMDB_API_KEY=your_tmdb_api_key
   VITE_TMDB_API_URL=https://api.themoviedb.org/3
   ```

## Step 6: Configure Authorized Domains

1. In Firebase Console, go to **Build** → **Authentication** → **Settings** tab
2. Scroll down to "Authorized domains"
3. Add your domains (e.g., `localhost`, your production domain)

## Step 7: Test Your Setup

1. Start your development server:

   ```bash
   npm run dev
   ```

2. Try to sign up with email/password
3. Try to log in with Google (if enabled)
4. Check Firebase Console → Authentication → Users to see if users are created

## Troubleshooting

### 400 Bad Request Error

- Make sure all environment variables are correctly set
- Verify that Authentication is enabled in Firebase Console
- Check that your Firebase project ID is correct
- Ensure you're using the correct API key

### Social Login Not Working

- Verify the provider is enabled in Firebase Console
- Check that you've added the OAuth redirect URIs to your social provider's app settings
- Make sure authorized domains are configured in Firebase

### Firestore Permission Denied

- Check your Firestore security rules
- Verify the user is authenticated before accessing Firestore
- Ensure the user's UID matches the document path for user-specific data

## Additional Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firebase Authentication Guide](https://firebase.google.com/docs/auth)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
