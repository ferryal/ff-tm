import { useTranslation } from "react-i18next";
import { useLanguageStore } from "@/store/languageStore";
import { Button } from "@/components/ui/button";

export const LanguageToggle = () => {
  const { i18n } = useTranslation();
  const { language, setLanguage } = useLanguageStore();

  const toggleLanguage = () => {
    const newLang = language === "en" ? "id" : "en";
    setLanguage(newLang);
    i18n.changeLanguage(newLang);
  };

  return (
    <Button variant="outline" onClick={toggleLanguage}>
      {language === "en" ? "ID" : "EN"}
    </Button>
  );
};
