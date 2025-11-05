import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useTranslation } from "react-i18next";
import { Popcorn, Chrome } from "lucide-react";
import { signUpWithEmail, signInWithGoogle } from "@/services/authService";
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

const signupSchema = z
  .object({
    email: z.string().email(),
    password: z.string().min(6),
    confirmPassword: z.string().min(6),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type SignupFormData = z.infer<typeof signupSchema>;

export const SignupForm = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const getErrorMessage = (error: any): string => {
    const errorCode = error?.code || "";

    switch (errorCode) {
      case "auth/email-already-in-use":
        return "An account with this email already exists";
      case "auth/invalid-email":
        return "Invalid email address";
      case "auth/operation-not-allowed":
        return "Email/password accounts are not enabled";
      case "auth/weak-password":
        return "Password is too weak. Please use at least 6 characters";
      case "auth/network-request-failed":
        return "Network error. Please check your connection";
      case "auth/popup-closed-by-user":
        return "Sign-up cancelled";
      case "auth/popup-blocked":
        return "Popup blocked. Please allow popups for this site";
      case "auth/cancelled-popup-request":
        return "Sign-up cancelled";
      case "auth/account-exists-with-different-credential":
        return "An account already exists with this email using a different sign-in method";
      default:
        return error?.message || "An error occurred during sign up";
    }
  };

  const onSubmit = async (data: SignupFormData) => {
    try {
      setLoading(true);
      setError("");
      const user = await signUpWithEmail(data.email, data.password);
      setUser(user);
      navigate("/");
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
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
          <CardTitle>{t("signup")}</CardTitle>
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
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">{t("confirmPassword")}</Label>
              <Input
                id="confirmPassword"
                type="password"
                {...register("confirmPassword")}
                disabled={loading}
              />
              {errors.confirmPassword && (
                <p className="text-sm text-destructive">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Loading..." : t("signup")}
            </Button>
          </form>
          <div className="mt-4 space-y-2">
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={handleGoogleSignup}
              disabled={loading}
            >
              <Chrome className="mr-2 h-4 w-4" />
              {t("continueWithGoogle")}
            </Button>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            {t("alreadyHaveAccount")}{" "}
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="text-primary hover:underline"
            >
              {t("login")}
            </button>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};
