import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Film, Heart, User, LogOut, Languages, Moon, Sun } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { logout } from "@/services/authService";
import { Button } from "@/components/ui/button";
import { useFavorites } from "@/hooks/useFavorites";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useLanguageStore } from "@/store/languageStore";
import { useThemeStore } from "@/store/themeStore";

export const Navbar = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, setUser } = useAuthStore();
  const { favorites } = useFavorites();
  const { language, setLanguage } = useLanguageStore();
  const { theme, toggleTheme } = useThemeStore();

  const handleLogout = async () => {
    await logout();
    setUser(null);
    navigate("/login");
  };

  const toggleLanguage = () => {
    const newLang = language === "en" ? "id" : "en";
    setLanguage(newLang);
    i18n.changeLanguage(newLang);
  };

  const isActive = (path: string) => location.pathname === path;

  const getUserInitials = () => {
    if (!user?.email) return "U";
    return user.email.charAt(0).toUpperCase();
  };

  return (
    <nav className="border-b sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <h1
            className="text-xl font-bold cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => navigate("/")}
          >
            TMDB Worlder
          </h1>

          {user && (
            <div className="hidden md:flex gap-1">
              <Button
                variant={isActive("/movies") ? "default" : "ghost"}
                onClick={() => navigate("/movies")}
              >
                <Film className="w-4 h-4 mr-2" />
                {t("movies")}
              </Button>

              <Button
                variant={isActive("/favorites") ? "default" : "ghost"}
                onClick={() => navigate("/favorites")}
                className="relative"
              >
                <Heart className="w-4 h-4 mr-2" />
                {t("favorites")}
                {favorites.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {favorites.length}
                  </span>
                )}
              </Button>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {user && (
            <div className="md:hidden flex gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("/movies")}
              >
                <Film className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("/favorites")}
                className="relative"
              >
                <Heart className="w-5 h-5" />
                {favorites.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full w-4 h-4 flex items-center justify-center text-[10px]">
                    {favorites.length}
                  </span>
                )}
              </Button>
            </div>
          )}

          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-10 w-10 rounded-full"
                >
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src={user.photoURL || undefined}
                      alt={user.email || t("user")}
                    />
                    <AvatarFallback>{getUserInitials()}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {user.displayName || t("user")}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate("/profile")}>
                  <User className="mr-2 h-4 w-4" />
                  <span>{t("profile")}</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={toggleLanguage}>
                  <Languages className="mr-2 h-4 w-4" />
                  <span>
                    {t("language")}:{" "}
                    {language === "en" ? t("english") : t("indonesian")}
                  </span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={toggleTheme}>
                  {theme === "light" ? (
                    <>
                      <Moon className="mr-2 h-4 w-4" />
                      <span>{t("darkMode")}</span>
                    </>
                  ) : (
                    <>
                      <Sun className="mr-2 h-4 w-4" />
                      <span>{t("lightMode")}</span>
                    </>
                  )}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>{t("logout")}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </nav>
  );
};
