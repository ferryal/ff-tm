// @ts-nocheck
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { MovieCard } from "../MovieCard";

jest.mock("@/hooks/useFavorites", () => ({
  useFavorites: () => ({
    isFavorite: jest.fn(() => false),
    toggleFavorite: jest.fn(),
  }),
}));

const mockMovie: any = {
  id: 1,
  title: "Test Movie",
  poster_path: "/test-poster.jpg",
  backdrop_path: "/test-backdrop.jpg",
  overview: "This is a test movie overview",
  release_date: "2023-01-01",
  vote_average: 8.5,
  vote_count: 100,
  popularity: 50.5,
  adult: false,
  genre_ids: [1, 2],
  original_language: "en",
  original_title: "Test Movie",
  video: false,
};

describe("MovieCard", () => {
  test("renders movie title", () => {
    render(
      <BrowserRouter>
        <MovieCard movie={mockMovie} />
      </BrowserRouter>
    );
    expect(screen.getByText("Test Movie")).toBeInTheDocument();
  });

  test("renders movie rating", () => {
    render(
      <BrowserRouter>
        <MovieCard movie={mockMovie} />
      </BrowserRouter>
    );
    expect(screen.getByText("8.5")).toBeInTheDocument();
  });

  test("renders movie image with correct alt text", () => {
    render(
      <BrowserRouter>
        <MovieCard movie={mockMovie} />
      </BrowserRouter>
    );
    const image = screen.getByAltText("Test Movie");
    expect(image).toBeInTheDocument();
  });

  test("renders favorite button", () => {
    render(
      <BrowserRouter>
        <MovieCard movie={mockMovie} />
      </BrowserRouter>
    );
    expect(screen.getByLabelText("Add to favorites")).toBeInTheDocument();
  });

  test("renders year from release date", () => {
    render(
      <BrowserRouter>
        <MovieCard movie={mockMovie} />
      </BrowserRouter>
    );
    expect(screen.getByText("2023")).toBeInTheDocument();
  });
});
