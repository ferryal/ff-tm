import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/config/firebase";
import { useAuthStore } from "@/store/authStore";
import { useFavoritesStore } from "@/store/favoritesStore";
import { Navbar } from "@/components/Navbar";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Home } from "@/pages/Home";
import { Login } from "@/pages/Login";
import { Signup } from "@/pages/Signup";
import { Profile } from "@/pages/Profile";
import { Movies } from "@/pages/Movies";
import { MovieDetails } from "@/pages/MovieDetails";
import { Favorites } from "@/pages/Favorites";
import { logPageView } from "@/services/analyticsService";

function App() {
  const { user, setUser, setLoading } = useAuthStore();
  const loadFavorites = useFavoritesStore((state) => state.loadFavorites);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [setUser, setLoading]);

  useEffect(() => {
    loadFavorites(user?.uid);
  }, [user, loadFavorites]);

  useEffect(() => {
    logPageView(window.location.pathname);
  }, []);

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background">
        {user && <Navbar />}
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/movies"
            element={
              <ProtectedRoute>
                <Movies />
              </ProtectedRoute>
            }
          />
          <Route
            path="/movie/:id"
            element={
              <ProtectedRoute>
                <MovieDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/favorites"
            element={
              <ProtectedRoute>
                <Favorites />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
