import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useTranslation } from "react-i18next";
import { Popcorn, Chrome } from "lucide-react";
import { signInWithEmail, signInWithGoogle } from "@/services/authService";
import { useAuthStore } from "@/store/authStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const LoginForm = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const getErrorMessage = (error: any): string => {
    const errorCode = error?.code || "";

    switch (errorCode) {
      case "auth/invalid-email":
        return "Invalid email address";
      case "auth/user-disabled":
        return "This account has been disabled";
      case "auth/user-not-found":
        return "No account found with this email";
      case "auth/wrong-password":
        return "Incorrect password";
      case "auth/invalid-credential":
        return "Invalid email or password";
      case "auth/too-many-requests":
        return "Too many failed attempts. Please try again later";
      case "auth/network-request-failed":
        return "Network error. Please check your connection";
      case "auth/popup-closed-by-user":
        return "Sign-in cancelled";
      case "auth/popup-blocked":
        return "Popup blocked. Please allow popups for this site";
      case "auth/cancelled-popup-request":
        return "Sign-in cancelled";
      default:
        return error?.message || "An error occurred during sign in";
    }
  };

  const onSubmit = async (data: LoginFormData) => {
    try {
      setLoading(true);
      setError("");
      const user = await signInWithEmail(data.email, data.password);
      setUser(user);
      navigate("/");
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      setError("");
      const user = await signInWithGoogle();
      setUser(user);
      navigate("/");
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md space-y-6">
      <div className="flex items-center justify-center gap-2">
        <Popcorn className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold">TMDB Worlder</h1>
      </div>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>{t("login")}</CardTitle>
          <CardDescription>{t("welcome")}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">{t("email")}</Label>
              <Input
                id="email"
                type="email"
                {...register("email")}
                disabled={loading}
              />
              {errors.email && (
                <p className="text-sm text-destructive">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">{t("password")}</Label>
              <Input
                id="password"
                type="password"
                {...register("password")}
                disabled={loading}
              />
              {errors.password && (
                <p className="text-sm text-destructive">
                  {errors.password.message}
                </p>
              )}
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Loading..." : t("login")}
            </Button>
          </form>
          <div className="mt-4 space-y-2">
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={handleGoogleLogin}
              disabled={loading}
            >
              <Chrome className="mr-2 h-4 w-4" />
              {t("continueWithGoogle")}
            </Button>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            {t("dontHaveAccount")}{" "}
            <button
              type="button"
              onClick={() => navigate("/signup")}
              className="text-primary hover:underline"
            >
              {t("signup")}
            </button>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};
