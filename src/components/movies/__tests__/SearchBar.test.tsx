// @ts-nocheck
import { render, screen, fireEvent } from "@testing-library/react";
import { SearchBar } from "../SearchBar";

describe("SearchBar", () => {
  test("renders search bar", () => {
    const mockOnSearch = jest.fn();
    render(<SearchBar onSearch={mockOnSearch} />);
    expect(screen.getByPlaceholderText("Search movies...")).toBeInTheDocument();
  });

  test("renders with custom placeholder", () => {
    const mockOnSearch = jest.fn();
    render(<SearchBar onSearch={mockOnSearch} placeholder="Find movies" />);
    expect(screen.getByPlaceholderText("Find movies")).toBeInTheDocument();
  });

  test("calls onSearch when typing", () => {
    const mockOnSearch = jest.fn();
    render(<SearchBar onSearch={mockOnSearch} />);
    const input = screen.getByPlaceholderText("Search movies...");
    fireEvent.change(input, { target: { value: "Inception" } });
    expect(mockOnSearch).toHaveBeenCalledWith("Inception");
  });

  test("shows clear button when there is text", () => {
    const mockOnSearch = jest.fn();
    render(<SearchBar onSearch={mockOnSearch} />);
    const input = screen.getByPlaceholderText("Search movies...");
    fireEvent.change(input, { target: { value: "Test" } });
    expect(screen.getByLabelText("Clear search")).toBeInTheDocument();
  });

  test("clears input when clear button is clicked", () => {
    const mockOnSearch = jest.fn();
    render(<SearchBar onSearch={mockOnSearch} />);
    const input = screen.getByPlaceholderText(
      "Search movies..."
    ) as HTMLInputElement;
    fireEvent.change(input, { target: { value: "Test" } });
    const clearButton = screen.getByLabelText("Clear search");
    fireEvent.click(clearButton);
    expect(input.value).toBe("");
    expect(mockOnSearch).toHaveBeenCalledWith("");
  });
});
