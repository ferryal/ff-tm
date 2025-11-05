import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Star,
  Calendar,
  Clock,
  Heart,
  Play,
  ArrowLeft,
  DollarSign,
  TrendingUp,
} from "lucide-react";
import {
  useMovieDetails,
  useMovieCredits,
  useMovieVideos,
} from "@/hooks/useMovies";
import { useFavorites } from "@/hooks/useFavorites";
import {
  getTMDBImageUrl,
  formatRuntime,
  formatDate,
  formatCurrency,
} from "@/lib/tmdb";
import { TrailerModal } from "@/components/movies/TrailerModal";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const MovieDetails = () => {
  const { id } = useParams<{ id: string }>();
  const movieId = parseInt(id || "0");

  const [showTrailer, setShowTrailer] = useState(false);

  const { data: movie, isLoading: movieLoading } = useMovieDetails(movieId);
  const { data: credits } = useMovieCredits(movieId);
  const { data: videos } = useMovieVideos(movieId);
  const { isFavorite, toggleFavorite } = useFavorites();

  if (movieLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-96 bg-muted rounded-lg mb-8" />
          <div className="h-8 bg-muted rounded w-1/2 mb-4" />
          <div className="h-4 bg-muted rounded w-3/4 mb-2" />
          <div className="h-4 bg-muted rounded w-2/3" />
        </div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-center text-muted-foreground">Movie not found.</p>
      </div>
    );
  }

  const trailer = videos?.results.find(
    (video) => video.type === "Trailer" && video.site === "YouTube"
  );

  const isMovieFavorite = isFavorite(movie.id);
  const cast = credits?.cast.slice(0, 12) || [];

  return (
    <div className="min-h-screen">
      <div className="relative h-[60vh] lg:h-[70vh]">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${getTMDBImageUrl(
              movie.backdrop_path,
              "original"
            )})`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/40" />
        </div>

        <div className="container mx-auto px-4 relative h-full flex items-end pb-8">
          <Link to="/movies">
            <Button variant="ghost" className="absolute top-4 left-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>

          <div className="flex flex-col md:flex-row gap-8 items-end">
            <img
              src={getTMDBImageUrl(movie.poster_path, "w500")}
              alt={movie.title}
              className="w-48 md:w-64 rounded-lg shadow-2xl"
            />

            <div className="flex-1 pb-4">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                {movie.title}
              </h1>

              {movie.tagline && (
                <p className="text-lg text-muted-foreground italic mb-4">
                  "{movie.tagline}"
                </p>
              )}

              <div className="flex flex-wrap gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 fill-yellow-500 text-yellow-500" />
                  <span className="text-lg font-semibold">
                    {movie.vote_average.toFixed(1)}
                  </span>
                  <span className="text-muted-foreground">
                    ({movie.vote_count.toLocaleString()} votes)
                  </span>
                </div>

                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="w-5 h-5" />
                  <span>{formatDate(movie.release_date)}</span>
                </div>

                {movie.runtime && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="w-5 h-5" />
                    <span>{formatRuntime(movie.runtime)}</span>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                {movie.genres.map((genre) => (
                  <span
                    key={genre.id}
                    className="px-3 py-1 bg-primary/20 rounded-full text-sm"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>

              <div className="flex gap-3">
                {trailer && (
                  <Button onClick={() => setShowTrailer(true)} size="lg">
                    <Play className="w-5 h-5 mr-2" />
                    Watch Trailer
                  </Button>
                )}

                <Button
                  onClick={() => toggleFavorite(movie)}
                  variant={isMovieFavorite ? "default" : "outline"}
                  size="lg"
                >
                  <Heart
                    className={`w-5 h-5 mr-2 ${
                      isMovieFavorite ? "fill-current" : ""
                    }`}
                  />
                  {isMovieFavorite ? "In Favorites" : "Add to Favorites"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="md:col-span-2 space-y-8">
            <section>
              <h2 className="text-2xl font-bold mb-4">Overview</h2>
              <p className="text-lg leading-relaxed text-muted-foreground">
                {movie.overview || "No overview available."}
              </p>
            </section>

            {cast.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold mb-6">Cast</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {cast.map((actor) => (
                    <div
                      key={actor.id}
                      className="group relative aspect-[2/3] overflow-hidden rounded-lg"
                    >
                      <img
                        src={getTMDBImageUrl(actor.profile_path, "w185")}
                        alt={actor.name}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-3">
                        <p className="font-semibold text-sm text-white line-clamp-1 mb-0.5">
                          {actor.name}
                        </p>
                        <p className="text-xs text-white/80 line-clamp-1">
                          {actor.character}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          <div className="space-y-6">
            <Card>
              <CardContent className="p-6 space-y-4">
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground mb-1">
                    Status
                  </h3>
                  <p className="text-lg">{movie.status}</p>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground mb-1">
                    Original Language
                  </h3>
                  <p className="text-lg uppercase">{movie.original_language}</p>
                </div>

                {movie.budget > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-muted-foreground mb-1 flex items-center gap-1">
                      <DollarSign className="w-4 h-4" />
                      Budget
                    </h3>
                    <p className="text-lg">{formatCurrency(movie.budget)}</p>
                  </div>
                )}

                {movie.revenue > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-muted-foreground mb-1 flex items-center gap-1">
                      <TrendingUp className="w-4 h-4" />
                      Revenue
                    </h3>
                    <p className="text-lg">{formatCurrency(movie.revenue)}</p>
                  </div>
                )}

                {movie.production_companies.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-muted-foreground mb-2">
                      Production Companies
                    </h3>
                    <div className="space-y-2">
                      {movie.production_companies.slice(0, 5).map((company) => (
                        <p key={company.id} className="text-sm">
                          {company.name}
                        </p>
                      ))}
                    </div>
                  </div>
                )}

                {movie.homepage && (
                  <div>
                    <a
                      href={movie.homepage}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline text-sm"
                    >
                      Official Website →
                    </a>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {showTrailer && trailer && (
        <TrailerModal
          videoKey={trailer.key}
          title={movie.title}
          onClose={() => setShowTrailer(false)}
        />
      )}
    </div>
  );
};
