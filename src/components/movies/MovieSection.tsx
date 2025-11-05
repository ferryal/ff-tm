import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { MovieCardOverlay } from "./MovieCardOverlay";
import { Button } from "@/components/ui/button";
import type { Movie } from "@/types/movie";

interface MovieSectionProps {
  title: string;
  movies: Movie[];
  onExploreMore?: () => void;
}

export const MovieSection = ({
  title,
  movies,
  onExploreMore,
}: MovieSectionProps) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 400;
      const newPosition =
        scrollContainerRef.current.scrollLeft +
        (direction === "left" ? -scrollAmount : scrollAmount);

      scrollContainerRef.current.scrollTo({
        left: newPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl md:text-3xl font-bold">{title}</h2>
        <div className="flex items-center gap-2">
          {onExploreMore && (
            <Button variant="outline" size="sm" onClick={onExploreMore}>
              Explore more
            </Button>
          )}
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9"
              onClick={() => scroll("left")}
              aria-label="Scroll left"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9"
              onClick={() => scroll("right")}
              aria-label="Scroll right"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      <div className="relative">
        <div
          ref={scrollContainerRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {movies.map((movie) => (
            <div
              key={movie.id}
              className="flex-none w-[calc(50%-8px)] sm:w-[calc(33.333%-11px)] md:w-[calc(25%-12px)] lg:w-[calc(20%-13px)]"
            >
              <MovieCardOverlay movie={movie} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
