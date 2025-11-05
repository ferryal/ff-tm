import { useNavigate } from "react-router-dom";
import {
  usePopularMovies,
  useNowPlayingMovies,
  useUpcomingMovies,
  useTopRatedMovies,
} from "@/hooks/useMovies";
import { MovieSection } from "@/components/movies/MovieSection";

export const Home = () => {
  const navigate = useNavigate();

  const { data: popularMovies, isLoading: isLoadingPopular } =
    usePopularMovies(1);
  const { data: nowPlayingMovies, isLoading: isLoadingNowPlaying } =
    useNowPlayingMovies(1);
  const { data: upcomingMovies, isLoading: isLoadingUpcoming } =
    useUpcomingMovies(1);
  const { data: topRatedMovies, isLoading: isLoadingTopRated } =
    useTopRatedMovies(1);

  const renderLoadingSkeleton = () => (
    <div className="flex gap-4 overflow-hidden">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="flex-none w-[calc(50%-8px)] sm:w-[calc(33.333%-11px)] md:w-[calc(25%-12px)] lg:w-[calc(20%-13px)] animate-pulse"
        >
          <div className="aspect-[2/3] bg-muted rounded-lg" />
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8 space-y-12">
        {isLoadingPopular ? (
          <div className="space-y-4">
            <div className="h-8 w-48 bg-muted rounded animate-pulse" />
            {renderLoadingSkeleton()}
          </div>
        ) : popularMovies?.results ? (
          <MovieSection
            title="Popular Movies"
            movies={popularMovies.results.slice(0, 16)}
            onExploreMore={() => navigate("/movies")}
          />
        ) : null}

        {isLoadingNowPlaying ? (
          <div className="space-y-4">
            <div className="h-8 w-48 bg-muted rounded animate-pulse" />
            {renderLoadingSkeleton()}
          </div>
        ) : nowPlayingMovies?.results ? (
          <MovieSection
            title="Now Playing"
            movies={nowPlayingMovies.results.slice(0, 16)}
            onExploreMore={() => navigate("/movies")}
          />
        ) : null}

        {isLoadingUpcoming ? (
          <div className="space-y-4">
            <div className="h-8 w-48 bg-muted rounded animate-pulse" />
            {renderLoadingSkeleton()}
          </div>
        ) : upcomingMovies?.results ? (
          <MovieSection
            title="Upcoming Movies"
            movies={upcomingMovies.results.slice(0, 16)}
            onExploreMore={() => navigate("/movies")}
          />
        ) : null}

        {isLoadingTopRated ? (
          <div className="space-y-4">
            <div className="h-8 w-48 bg-muted rounded animate-pulse" />
            {renderLoadingSkeleton()}
          </div>
        ) : topRatedMovies?.results ? (
          <MovieSection
            title="Top Rated Movies"
            movies={topRatedMovies.results.slice(0, 16)}
            onExploreMore={() => navigate("/movies")}
          />
        ) : null}
      </div>
    </div>
  );
};
