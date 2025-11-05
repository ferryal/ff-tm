import { useEffect } from "react";
import { useThemeStore } from "@/store/themeStore";

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const theme = useThemeStore((state) => state.theme);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
  }, [theme]);

  return <>{children}</>;
};
