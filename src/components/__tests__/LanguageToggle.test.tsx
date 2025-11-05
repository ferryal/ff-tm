// @ts-nocheck
import { render, screen } from "@testing-library/react";
import { LanguageToggle } from "../LanguageToggle";

jest.mock("@/store/languageStore", () => ({
  useLanguageStore: () => ({
    language: "en",
    setLanguage: jest.fn(),
  }),
}));

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    i18n: {
      changeLanguage: jest.fn(),
    },
  }),
}));

describe("LanguageToggle", () => {
  test("renders language toggle button", () => {
    render(<LanguageToggle />);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  test("displays ID when current language is English", () => {
    render(<LanguageToggle />);
    expect(screen.getByText("ID")).toBeInTheDocument();
  });

  test("displays EN when current language is Indonesian", () => {
    jest
      .spyOn(require("@/store/languageStore"), "useLanguageStore")
      .mockReturnValue({
        language: "id",
        setLanguage: jest.fn(),
      });

    render(<LanguageToggle />);
    expect(screen.getByText("EN")).toBeInTheDocument();
  });
});
