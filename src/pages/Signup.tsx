import { SignupForm } from "@/components/auth/SignupForm";
import { useThemeStore } from "@/store/themeStore";

export const Signup = () => {
  const theme = useThemeStore((state) => state.theme);

  return (
    <div className="min-h-screen w-full relative">
      <div
        className="absolute inset-0 z-0"
        style={{
          background:
            theme === "light"
              ? "radial-gradient(125% 125% at 50% 10%, #fff 40%, #475569 100%)"
              : "radial-gradient(125% 125% at 50% 10%, #000000 40%, #350136 100%)",
        }}
      />
      <div className="container mx-auto px-4 py-12 flex items-center justify-center min-h-screen relative z-10">
        <SignupForm />
      </div>
    </div>
  );
};
