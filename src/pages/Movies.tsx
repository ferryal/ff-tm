import { useState } from "react";
import {
  usePopularMovies,
  useNowPlayingMovies,
  useUpcomingMovies,
  useTopRatedMovies,
  useSearchMovies,
} from "@/hooks/useMovies";
import { useDebounce } from "@/hooks/useDebounce";
import { MovieGrid } from "@/components/movies/MovieGrid";
import { SearchBar } from "@/components/movies/SearchBar";
import { Button } from "@/components/ui/button";

type MovieCategory = "popular" | "now_playing" | "upcoming" | "top_rated";

export const Movies = () => {
  const [activeCategory, setActiveCategory] =
    useState<MovieCategory>("popular");
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 500);

  const { data: popularData, isLoading: popularLoading } =
    usePopularMovies(page);
  const { data: nowPlayingData, isLoading: nowPlayingLoading } =
    useNowPlayingMovies(page);
  const { data: upcomingData, isLoading: upcomingLoading } =
    useUpcomingMovies(page);
  const { data: topRatedData, isLoading: topRatedLoading } =
    useTopRatedMovies(page);
  const { data: searchData, isLoading: searchLoading } = useSearchMovies(
    debouncedSearch,
    page
  );

  const isSearching = debouncedSearch.length > 0;

  const getCurrentData = () => {
    if (isSearching) return searchData;

    switch (activeCategory) {
      case "popular":
        return popularData;
      case "now_playing":
        return nowPlayingData;
      case "upcoming":
        return upcomingData;
      case "top_rated":
        return topRatedData;
      default:
        return popularData;
    }
  };

  const isCurrentLoading = () => {
    if (isSearching) return searchLoading;

    switch (activeCategory) {
      case "popular":
        return popularLoading;
      case "now_playing":
        return nowPlayingLoading;
      case "upcoming":
        return upcomingLoading;
      case "top_rated":
        return topRatedLoading;
      default:
        return popularLoading;
    }
  };

  const data = getCurrentData();
  const isLoading = isCurrentLoading();
  const movies = data?.results || [];
  const totalPages = data?.total_pages || 1;

  const handleCategoryChange = (category: MovieCategory) => {
    setActiveCategory(category);
    setPage(1);
    setSearchQuery("");
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setPage(1);
  };

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePrevPage = () => {
    if (page > 1) {
      setPage(page - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const categories = [
    { id: "popular" as MovieCategory, label: "Popular" },
    { id: "now_playing" as MovieCategory, label: "Now Playing" },
    { id: "upcoming" as MovieCategory, label: "Upcoming" },
    { id: "top_rated" as MovieCategory, label: "Top Rated" },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-6">Discover Movies</h1>

        <div className="flex flex-col gap-6">
          <SearchBar
            onSearch={handleSearch}
            placeholder="Search for movies..."
          />

          {!isSearching && (
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={
                    activeCategory === category.id ? "default" : "outline"
                  }
                  onClick={() => handleCategoryChange(category.id)}
                >
                  {category.label}
                </Button>
              ))}
            </div>
          )}
        </div>
      </div>

      {isSearching && (
        <div className="mb-6">
          <p className="text-muted-foreground">
            {searchLoading
              ? "Searching..."
              : `Search results for "${debouncedSearch}"`}
          </p>
        </div>
      )}

      <MovieGrid movies={movies} isLoading={isLoading} />

      {!isLoading && movies.length > 0 && (
        <div className="mt-8 flex items-center justify-center gap-4">
          <Button
            variant="outline"
            onClick={handlePrevPage}
            disabled={page === 1}
          >
            Previous
          </Button>

          <span className="text-sm text-muted-foreground">
            Page {page} of {totalPages > 500 ? 500 : totalPages}
          </span>

          <Button
            variant="outline"
            onClick={handleNextPage}
            disabled={page >= totalPages || page >= 500}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};
