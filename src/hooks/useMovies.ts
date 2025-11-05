import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import type {
  MoviesResponse,
  MovieDetails,
  Credits,
  VideosResponse,
} from "@/types/movie";

export const usePopularMovies = (page: number = 1) => {
  return useQuery<MoviesResponse>({
    queryKey: ["movies", "popular", page],
    queryFn: async () => {
      const response = await api.get("/movie/popular", {
        params: { page },
      });
      return response.data;
    },
  });
};

export const useNowPlayingMovies = (page: number = 1) => {
  return useQuery<MoviesResponse>({
    queryKey: ["movies", "now_playing", page],
    queryFn: async () => {
      const response = await api.get("/movie/now_playing", {
        params: { page },
      });
      return response.data;
    },
  });
};

export const useUpcomingMovies = (page: number = 1) => {
  return useQuery<MoviesResponse>({
    queryKey: ["movies", "upcoming", page],
    queryFn: async () => {
      const response = await api.get("/movie/upcoming", {
        params: { page },
      });
      return response.data;
    },
  });
};

export const useTopRatedMovies = (page: number = 1) => {
  return useQuery<MoviesResponse>({
    queryKey: ["movies", "top_rated", page],
    queryFn: async () => {
      const response = await api.get("/movie/top_rated", {
        params: { page },
      });
      return response.data;
    },
  });
};

export const useSearchMovies = (query: string, page: number = 1) => {
  return useQuery<MoviesResponse>({
    queryKey: ["movies", "search", query, page],
    queryFn: async () => {
      const response = await api.get("/search/movie", {
        params: { query, page },
      });
      return response.data;
    },
    enabled: query.length > 0,
  });
};

export const useMovieDetails = (movieId: number) => {
  return useQuery<MovieDetails>({
    queryKey: ["movie", "details", movieId],
    queryFn: async () => {
      const response = await api.get(`/movie/${movieId}`);
      return response.data;
    },
    enabled: !!movieId,
  });
};

export const useMovieCredits = (movieId: number) => {
  return useQuery<Credits>({
    queryKey: ["movie", "credits", movieId],
    queryFn: async () => {
      const response = await api.get(`/movie/${movieId}/credits`);
      return response.data;
    },
    enabled: !!movieId,
  });
};

export const useMovieVideos = (movieId: number) => {
  return useQuery<VideosResponse>({
    queryKey: ["movie", "videos", movieId],
    queryFn: async () => {
      const response = await api.get(`/movie/${movieId}/videos`);
      return response.data;
    },
    enabled: !!movieId,
  });
};
