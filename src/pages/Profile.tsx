import { useTranslation } from "react-i18next";
import { useAuthStore } from "@/store/authStore";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const Profile = () => {
  const { t } = useTranslation();
  const user = useAuthStore((state) => state.user);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>{t("profile")}</CardTitle>
            <CardDescription>Your account information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Email</p>
              <p className="text-lg">{user?.email}</p>
            </div>
            {user?.displayName && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Display Name
                </p>
                <p className="text-lg">{user.displayName}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
