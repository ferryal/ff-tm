import { Link } from "react-router-dom";
import type { Movie } from "@/types/movie";
import { getTMDBImageUrl, getYear } from "@/lib/tmdb";

interface MovieCardOverlayProps {
  movie: Movie;
}

export const MovieCardOverlay = ({ movie }: MovieCardOverlayProps) => {
  return (
    <Link to={`/movie/${movie.id}`} className="group block">
      <div className="relative aspect-[2/3] overflow-hidden rounded-lg">
        <img
          src={getTMDBImageUrl(movie.poster_path, "w500")}
          alt={movie.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
        <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-sm rounded-full px-3 py-1.5 flex items-center gap-1">
          <span className="text-white font-semibold text-sm">
            {movie.vote_average.toFixed(1)}
          </span>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="text-white font-semibold text-base mb-1 line-clamp-2">
            {movie.title}
          </h3>
          <p className="text-white/80 text-sm">{getYear(movie.release_date)}</p>
        </div>
      </div>
    </Link>
  );
};
