import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import type { Movie } from "@/types/movie";
import { getTMDBImageUrl, getYear } from "@/lib/tmdb";
import { useFavorites } from "@/hooks/useFavorites";

interface MovieCardProps {
  movie: Movie;
}

export const MovieCard = ({ movie }: MovieCardProps) => {
  const { isFavorite, toggleFavorite } = useFavorites();
  const isMovieFavorite = isFavorite(movie.id);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(movie);
  };

  return (
    <Link to={`/movie/${movie.id}`} className="group block">
      <div className="relative aspect-[2/3] overflow-hidden rounded-lg">
        <img
          src={getTMDBImageUrl(movie.poster_path, "w500")}
          alt={movie.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent group-hover:opacity-50 transition-opacity duration-300" />
        <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-sm rounded-full px-3 py-1.5 flex items-center gap-1 group-hover:opacity-30 transition-opacity duration-300 z-10">
          <span className="text-white font-semibold text-sm">
            {movie.vote_average.toFixed(1)}
          </span>
        </div>
        <button
          onClick={handleFavoriteClick}
          className="absolute top-3 right-3 p-2 rounded-full bg-black/70 hover:bg-black/90 transition-all backdrop-blur-sm z-20 group-hover:opacity-90"
          aria-label={
            isMovieFavorite ? "Remove from favorites" : "Add to favorites"
          }
        >
          <Heart
            className={`w-4 h-4 ${
              isMovieFavorite ? "fill-red-500 text-red-500" : "text-white"
            }`}
          />
        </button>
        <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-4 pointer-events-none">
          <p className="text-white text-sm line-clamp-6 text-center">
            {movie.overview || "No overview available."}
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-4 group-hover:opacity-30 transition-opacity duration-300 z-10">
          <h3 className="text-white font-semibold text-base mb-1 line-clamp-2">
            {movie.title}
          </h3>
          <p className="text-white/80 text-sm">{getYear(movie.release_date)}</p>
        </div>
      </div>
    </Link>
  );
};
