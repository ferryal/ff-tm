import { useFavorites } from "@/hooks/useFavorites";
import { MovieGrid } from "@/components/movies/MovieGrid";
import { Heart } from "lucide-react";

export const Favorites = () => {
  const { favorites, isLoading } = useFavorites();

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">My Favorites</h1>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-[2/3] bg-muted rounded-lg mb-3" />
              <div className="h-4 bg-muted rounded w-3/4 mb-2" />
              <div className="h-3 bg-muted rounded w-1/2" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (favorites.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">My Favorites</h1>
        <div className="flex flex-col items-center justify-center py-20">
          <Heart className="w-24 h-24 text-muted-foreground mb-4" />
          <h2 className="text-2xl font-semibold mb-2">No favorites yet</h2>
          <p className="text-muted-foreground text-center max-w-md">
            Start adding movies to your favorites by clicking the heart icon on
            any movie card.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">My Favorites</h1>
        <p className="text-muted-foreground">
          {favorites.length} {favorites.length === 1 ? "movie" : "movies"} in
          your collection
        </p>
      </div>

      <MovieGrid movies={favorites} isLoading={false} />
    </div>
  );
};
