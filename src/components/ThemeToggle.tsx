import { Moon, Sun } from "lucide-react";
import { useThemeStore } from "@/store/themeStore";
import { Button } from "@/components/ui/button";

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useThemeStore();

  return (
    <Button variant="outline" size="icon" onClick={toggleTheme}>
      {theme === "light" ? (
        <Moon className="h-5 w-5" />
      ) : (
        <Sun className="h-5 w-5" />
      )}
    </Button>
  );
};
