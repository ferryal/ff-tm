// @ts-nocheck
import { render, screen } from "@testing-library/react";
import { ThemeToggle } from "../ThemeToggle";

jest.mock("@/store/themeStore", () => ({
  useThemeStore: () => ({
    theme: "light",
    toggleTheme: jest.fn(),
  }),
}));

describe("ThemeToggle", () => {
  test("renders theme toggle button", () => {
    render(<ThemeToggle />);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  test("renders with light theme", () => {
    jest.spyOn(require("@/store/themeStore"), "useThemeStore").mockReturnValue({
      theme: "light",
      toggleTheme: jest.fn(),
    });

    render(<ThemeToggle />);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });
});
