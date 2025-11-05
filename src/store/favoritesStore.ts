import { create } from "zustand";
import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  getDocs,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "@/config/firebase";
import type { Movie, FavoriteMovie } from "@/types/movie";

const FAVORITES_STORAGE_KEY = "tmdb_favorites";

interface FavoritesState {
  favorites: FavoriteMovie[];
  isLoading: boolean;
  setFavorites: (favorites: FavoriteMovie[]) => void;
  setIsLoading: (isLoading: boolean) => void;
  loadFavorites: (userId?: string) => Promise<void>;
  addFavorite: (movie: Movie, userId?: string) => Promise<void>;
  removeFavorite: (movieId: number, userId?: string) => Promise<void>;
  toggleFavorite: (movie: Movie, userId?: string) => Promise<void>;
  isFavorite: (movieId: number) => boolean;
}

const loadFavoritesFromLocalStorage = (): FavoriteMovie[] => {
  try {
    const stored = localStorage.getItem(FAVORITES_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored) as FavoriteMovie[];
    }
  } catch (error) {
    console.error("Error loading favorites from localStorage:", error);
  }
  return [];
};

const saveFavoritesToLocalStorage = (favs: FavoriteMovie[]) => {
  try {
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favs));
  } catch (error) {
    console.error("Error saving favorites to localStorage:", error);
  }
};

const loadFavoritesFromFirestore = async (
  userId: string
): Promise<FavoriteMovie[]> => {
  try {
    const favoritesRef = collection(db, "users", userId, "favorites");
    const q = query(favoritesRef, orderBy("addedAt", "desc"));
    const snapshot = await getDocs(q);

    const favs: FavoriteMovie[] = [];
    snapshot.forEach((doc) => {
      favs.push(doc.data() as FavoriteMovie);
    });

    return favs;
  } catch (error) {
    console.error("Error loading favorites from Firestore:", error);
    return [];
  }
};

export const useFavoritesStore = create<FavoritesState>((set, get) => ({
  favorites: [],
  isLoading: true,

  setFavorites: (favorites) => set({ favorites }),

  setIsLoading: (isLoading) => set({ isLoading }),

  loadFavorites: async (userId) => {
    set({ isLoading: true });

    if (userId) {
      const firestoreFavs = await loadFavoritesFromFirestore(userId);
      set({ favorites: firestoreFavs, isLoading: false });
      saveFavoritesToLocalStorage(firestoreFavs);
    } else {
      const localFavs = loadFavoritesFromLocalStorage();
      set({ favorites: localFavs, isLoading: false });
    }
  },

  addFavorite: async (movie, userId) => {
    const favoriteMovie: FavoriteMovie = {
      ...movie,
      addedAt: Date.now(),
    };

    const currentFavorites = get().favorites;
    const newFavorites = [
      favoriteMovie,
      ...currentFavorites.filter((f) => f.id !== movie.id),
    ];

    set({ favorites: newFavorites });
    saveFavoritesToLocalStorage(newFavorites);

    if (userId) {
      try {
        const favRef = doc(
          db,
          "users",
          userId,
          "favorites",
          movie.id.toString()
        );
        await setDoc(favRef, favoriteMovie);
      } catch (error) {
        console.error("Error adding favorite to Firestore:", error);
      }
    }
  },

  removeFavorite: async (movieId, userId) => {
    const currentFavorites = get().favorites;
    const newFavorites = currentFavorites.filter((f) => f.id !== movieId);

    set({ favorites: newFavorites });
    saveFavoritesToLocalStorage(newFavorites);

    if (userId) {
      try {
        const favRef = doc(
          db,
          "users",
          userId,
          "favorites",
          movieId.toString()
        );
        await deleteDoc(favRef);
      } catch (error) {
        console.error("Error removing favorite from Firestore:", error);
      }
    }
  },

  toggleFavorite: async (movie, userId) => {
    const { isFavorite, addFavorite, removeFavorite } = get();
    if (isFavorite(movie.id)) {
      await removeFavorite(movie.id, userId);
    } else {
      await addFavorite(movie, userId);
    }
  },

  isFavorite: (movieId) => {
    return get().favorites.some((f) => f.id === movieId);
  },
}));
