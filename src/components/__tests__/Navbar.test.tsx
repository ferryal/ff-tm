// @ts-nocheck
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { Navbar } from "../Navbar";

jest.mock("@/store/authStore", () => ({
  useAuthStore: () => ({
    user: null,
    setUser: jest.fn(),
  }),
}));

jest.mock("@/hooks/useFavorites", () => ({
  useFavorites: () => ({
    favorites: [],
  }),
}));

jest.mock("@/store/languageStore", () => ({
  useLanguageStore: () => ({
    language: "en",
    setLanguage: jest.fn(),
  }),
}));

jest.mock("@/store/themeStore", () => ({
  useThemeStore: () => ({
    theme: "light",
    toggleTheme: jest.fn(),
  }),
}));

jest.mock("@/services/authService", () => ({
  logout: jest.fn(),
}));

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: {
      changeLanguage: jest.fn(),
    },
  }),
}));

describe("Navbar", () => {
  test("renders app title", () => {
    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );
    expect(screen.getByText("TMDB Worlder")).toBeInTheDocument();
  });

  test("renders without user menu when not logged in", () => {
    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );
    expect(
      screen.queryByRole("button", { name: /user/i })
    ).not.toBeInTheDocument();
  });
});
