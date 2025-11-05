# Quick Start Guide

Get up and running in 5 minutes! 🚀

## 1️⃣ Install Dependencies

```bash
npm install
```

## 2️⃣ Configure Firebase

Copy the `.env` file and add your Firebase credentials:

```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain_here
VITE_FIREBASE_PROJECT_ID=your_project_id_here
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket_here
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id_here
VITE_FIREBASE_APP_ID=your_app_id_here
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id_here
```

Get these from: [Firebase Console](https://console.firebase.google.com/) → Your Project → Project Settings

## 3️⃣ Start Developing

### For Web Development

```bash
npm run dev
```

Open http://localhost:5173

### For Desktop Development

```bash
npm run electron:dev
```

Desktop window opens automatically

## 4️⃣ Deploy

### Deploy to Web (Vercel)

```bash
npm run build:web
npx vercel --prod
```

### Build Desktop App

```bash
# Windows
npm run electron:build:win

# macOS
npm run electron:build:mac

# Linux
npm run electron:build:linux
```

Find your installers in the `release/` folder!

---

## Need More Help?

- **Full Setup**: [SETUP.md](./SETUP.md)
- **Electron Guide**: [ELECTRON.md](./ELECTRON.md)
- **Deployment**: [DEPLOYMENT.md](./DEPLOYMENT.md)
- **Scripts Reference**: [SCRIPTS.md](./SCRIPTS.md)
- **Project Overview**: [PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md)

## Firebase Setup Checklist

Before the app works, enable these in Firebase Console:

1. ✅ **Authentication**

   - Email/Password
   - Google (optional)
   - Facebook (optional)
   - Twitter (optional)

2. ✅ **Firestore Database**

   - Create database
   - Start in test mode

3. ✅ **Analytics**
   - Enable Google Analytics

## Common Issues

### "Firebase not configured"

→ Check your `.env` file has all variables set

### "Port 5173 is already in use"

→ Close other Vite instances or use different port: `npx vite --port 3000`

### Electron won't start

→ Make sure web dev server is running first: `npm run dev` (in another terminal)

## What You Get

✅ Modern React app with TypeScript
✅ Beautiful UI with Tailwind + Shadcn
✅ Firebase authentication (email + social)
✅ Dark/light theme
✅ English & Indonesian languages
✅ Works as web app
✅ Works as desktop app
✅ Same codebase for both!

Happy coding! 🎉
