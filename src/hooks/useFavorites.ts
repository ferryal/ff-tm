import { useCallback } from "react";
import { useAuthStore } from "@/store/authStore";
import { useFavoritesStore } from "@/store/favoritesStore";
import type { Movie } from "@/types/movie";

export const useFavorites = () => {
  const user = useAuthStore((state) => state.user);
  const favorites = useFavoritesStore((state) => state.favorites);
  const isLoading = useFavoritesStore((state) => state.isLoading);
  const isFavoriteCheck = useFavoritesStore((state) => state.isFavorite);
  const addFavoriteStore = useFavoritesStore((state) => state.addFavorite);
  const removeFavoriteStore = useFavoritesStore(
    (state) => state.removeFavorite
  );
  const toggleFavoriteStore = useFavoritesStore(
    (state) => state.toggleFavorite
  );

  const addFavorite = useCallback(
    async (movie: Movie) => {
      await addFavoriteStore(movie, user?.uid);
    },
    [addFavoriteStore, user?.uid]
  );

  const removeFavorite = useCallback(
    async (movieId: number) => {
      await removeFavoriteStore(movieId, user?.uid);
    },
    [removeFavoriteStore, user?.uid]
  );

  const isFavorite = useCallback(
    (movieId: number) => {
      return isFavoriteCheck(movieId);
    },
    [isFavoriteCheck]
  );

  const toggleFavorite = useCallback(
    async (movie: Movie) => {
      await toggleFavoriteStore(movie, user?.uid);
    },
    [toggleFavoriteStore, user?.uid]
  );

  return {
    favorites,
    isLoading,
    addFavorite,
    removeFavorite,
    isFavorite,
    toggleFavorite,
  };
};
