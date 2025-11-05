# NPM Scripts Reference

Quick reference for all available npm scripts in this project.

## Development Scripts

### `npm run dev`

Start Vite development server for web development.

- Opens at: `http://localhost:5173`
- Hot module reload enabled
- Best for web-only development

### `npm run electron:dev`

Start Electron desktop app in development mode.

- Starts Vite dev server
- Launches Electron window
- Hot reload for React code
- DevTools open by default
- Best for desktop app development

## Build Scripts

### `npm run build`

Default build (same as `build:web`).

- TypeScript compilation
- Vite production build
- Output: `dist/` folder

### `npm run build:web`

Build for web deployment.

- Optimized for browsers
- Ready for Vercel/Netlify
- Output: `dist/` folder

### `npm run electron:build`

Build desktop app for current OS.

- Builds web assets first
- Packages with Electron
- Output: `release/` folder

### `npm run electron:build:win`

Build Windows desktop app.

- Creates `.exe` installer
- Creates portable `.exe`
- Output: `release/TMDB Worlder Setup.exe`

### `npm run electron:build:mac`

Build macOS desktop app.

- Creates `.dmg` installer
- Creates `.zip` archive
- Output: `release/TMDB Worlder.dmg`

### `npm run electron:build:linux`

Build Linux desktop app.

- Creates `.AppImage`
- Creates `.deb` package
- Output: `release/TMDB Worlder.AppImage`

## Utility Scripts

### `npm run preview`

Preview production build locally.

- Builds the app first
- Starts local server
- Good for testing before deploy

### `npm run lint`

Run ESLint on the codebase.

- Checks for code quality issues
- TypeScript type checking
- Best practices enforcement

## Workflow Examples

### Web Development Flow

```bash
# Install dependencies (first time only)
npm install

# Start development server
npm run dev

# Make changes, test in browser

# Build for production
npm run build:web

# Deploy to Vercel
npx vercel --prod
```

### Desktop Development Flow

```bash
# Install dependencies (first time only)
npm install

# Start Electron in dev mode
npm run electron:dev

# Make changes, test in desktop app

# Build desktop app
npm run electron:build:win  # or :mac or :linux

# Distribute from release/ folder
```

### Full Stack Development

```bash
# Start web dev server in one terminal
npm run dev

# Start Electron in another terminal
npm run electron:dev

# Now you can test both simultaneously
```

## Environment Setup

Before running any scripts, ensure:

1. ✅ Node.js v18+ installed
2. ✅ Dependencies installed: `npm install`
3. ✅ `.env` file configured with Firebase credentials
4. ✅ Firebase services enabled (Auth, Firestore, Analytics)

## Platform-Specific Notes

### Windows

- Use `npm run electron:build:win` to build
- Requires Windows 10+ to build Windows apps
- Output: `.exe` files in `release/`

### macOS

- Use `npm run electron:build:mac` to build
- Requires macOS to build macOS apps
- May need Xcode Command Line Tools
- Output: `.dmg` files in `release/`

### Linux

- Use `npm run electron:build:linux` to build
- Works on most Linux distributions
- Output: `.AppImage` and `.deb` in `release/`

## Cross-Platform Building

⚠️ **Important**: You generally need to build on the target platform.

- Build Windows apps → Need Windows
- Build macOS apps → Need macOS
- Build Linux apps → Can build on Linux or macOS

**Exception**: Using cloud services like GitHub Actions or CircleCI can build for all platforms.

## Troubleshooting

### `npm run dev` fails

- Check if port 5173 is available
- Try: `npx vite --port 3000`

### `npm run electron:dev` fails

- Ensure Vite server starts first
- Check if port 5173 is available
- Try running `npm run dev` first to verify

### `npm run electron:build` fails

- Run `npm run build` first to verify
- Check `dist/` folder exists and has files
- Verify icons are in `build/` directory
- Check platform-specific requirements

### Build is slow

- First build is always slower
- Subsequent builds use cache
- Desktop builds are naturally slower (packaging)

## Quick Tips

1. **Faster development**: Use `npm run dev` for web-only work
2. **Test both**: Use `npm run electron:dev` to test desktop features
3. **Before deploy**: Always run `npm run build:web` to check for errors
4. **Before release**: Test with `npm run preview` first
5. **Clean build**: Delete `dist/` and `release/` if builds act weird

## Need Help?

- Web issues → Check [README.md](./README.md)
- Desktop issues → Check [ELECTRON.md](./ELECTRON.md)
- Firebase issues → Check [SETUP.md](./SETUP.md)
