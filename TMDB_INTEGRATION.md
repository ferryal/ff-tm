# TMDB Integration Documentation

This document describes the comprehensive TMDB (The Movie Database) API integration implemented in this application.

## Overview

The application connects to TMDB API to provide users with:

- Browse movies (Popular, Now Playing, Upcoming, Top Rated)
- Search movies by keywords with debounced input
- View detailed movie information including cast, ratings, trailers
- Save movies to favorites (localStorage + Firestore sync)
- Watch movie trailers

## Features Implemented

### 1. Movie Categories

- **Popular Movies**: Most popular movies currently
- **Now Playing**: Movies currently in theaters
- **Upcoming**: Movies coming soon
- **Top Rated**: Highest rated movies of all time

### 2. Search Functionality

- Real-time search with 500ms debounce
- Search across all movies by title or keywords
- Instant results display

### 3. Movie Details Page

Comprehensive information including:

- Movie poster and backdrop
- Title, tagline, and overview
- Release date and runtime
- Rating (average and vote count)
- Genres
- Budget and revenue
- Production companies
- Cast with photos and character names
- Official website link
- Trailer player (YouTube embedded)

### 4. Favorites System

- Add/remove movies from favorites
- Heart icon toggle on movie cards
- Persist favorites in localStorage (offline access)
- Sync favorites to Firestore (cross-device access when logged in)
- Favorites count badge in navbar
- Dedicated favorites page

### 5. Reusable Components

#### Custom Hooks

- `useInput`: Form input management with validation
- `useDebounce`: Debounce values for search optimization
- `usePopularMovies`: Fetch popular movies
- `useNowPlayingMovies`: Fetch now playing movies
- `useUpcomingMovies`: Fetch upcoming movies
- `useTopRatedMovies`: Fetch top rated movies
- `useSearchMovies`: Search movies with query
- `useMovieDetails`: Fetch detailed movie information
- `useMovieCredits`: Fetch cast and crew
- `useMovieVideos`: Fetch trailers and videos
- `useFavorites`: Manage favorites list

#### UI Components

- `MovieCard`: Display movie with poster, title, rating, and favorite toggle
- `MovieGrid`: Grid layout with loading states
- `SearchBar`: Search input with clear functionality
- `TrailerModal`: Full-screen YouTube trailer player

## File Structure

```
src/
├── hooks/
│   ├── useInput.ts              # Form input hook
│   ├── useDebounce.ts           # Debounce hook
│   ├── useMovies.ts             # All movie-related hooks
│   └── useFavorites.ts          # Favorites management
├── components/
│   └── movies/
│       ├── MovieCard.tsx        # Movie card component
│       ├── MovieGrid.tsx        # Grid layout
│       ├── SearchBar.tsx        # Search input
│       └── TrailerModal.tsx     # Trailer player
├── pages/
│   ├── Home.tsx                 # Landing page with featured movies
│   ├── Movies.tsx               # Browse movies with categories
│   ├── MovieDetails.tsx         # Detailed movie view
│   └── Favorites.tsx            # User's favorite movies
├── types/
│   └── movie.ts                 # TypeScript interfaces
└── lib/
    ├── tmdb.ts                  # TMDB utility functions
    └── axios.ts                 # API configuration
```

## API Configuration

The TMDB API is configured in `.env`:

```env
VITE_TMDB_API_KEY=your_api_key_here
VITE_API_BASE_URL=https://api.themoviedb.org/3
```

The API client is configured in `src/lib/axios.ts` with:

- Base URL: `https://api.themoviedb.org/3`
- Authorization: Bearer token (API Read Access Token)
- Automatic error handling

## Utility Functions

### Image URLs

```typescript
getTMDBImageUrl(path, size); // Generate TMDB image URLs
```

Sizes available: `w92`, `w154`, `w185`, `w342`, `w500`, `w780`, `original`

### Formatting

```typescript
formatRuntime(minutes); // Format runtime (e.g., "2h 15m")
formatCurrency(amount); // Format currency (e.g., "$1,000,000")
formatDate(dateString); // Format date (e.g., "January 1, 2024")
getYear(dateString); // Extract year (e.g., "2024")
```

### YouTube

```typescript
getYouTubeUrl(key); // Get watch URL
getYouTubeEmbedUrl(key); // Get embed URL
getYouTubeThumbnail(key); // Get thumbnail URL
```

## User Experience Features

### Responsive Design

- Mobile-first approach
- Adaptive grid layouts (2-5 columns based on screen size)
- Touch-friendly interactions
- Sticky navigation bar

### Loading States

- Skeleton loaders for better perceived performance
- Smooth transitions and animations
- Progressive image loading

### Accessibility

- Semantic HTML
- ARIA labels on interactive elements
- Keyboard navigation support (Escape to close modals)
- Focus management

## Data Flow

1. **Initial Load**: Home page fetches popular movies
2. **Browse**: Movies page allows switching between categories
3. **Search**: Debounced search queries the search endpoint
4. **Details**: Clicking a movie fetches full details, credits, and videos
5. **Favorites**:
   - Guest users: Save to localStorage only
   - Logged-in users: Save to Firestore + localStorage backup

## Performance Optimizations

- TanStack Query for efficient data caching
- Debounced search (500ms delay)
- Pagination support (up to 500 pages)
- Lazy loading images
- Optimistic UI updates for favorites

## References

- [TMDB API Documentation](https://developer.themoviedb.org/docs)
- [Inspiration: Movies App](https://movies.oktaycolakoglu.com/)

## Future Enhancements

Potential features to add:

- Movie recommendations
- Similar movies
- User reviews
- Watchlist (separate from favorites)
- Filter by genre, year, rating
- Sort options
- Infinite scroll
- Share functionality
