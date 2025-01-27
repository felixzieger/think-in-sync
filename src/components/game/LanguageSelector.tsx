import { Button } from "@/components/ui/button";
import { useContext } from "react";
import { LanguageContext } from "@/contexts/LanguageContext";
import { Language } from "@/i18n/translations";

const languages: { code: Language; name: string; flag: string }[] = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
];

export const LanguageSelector = () => {
  const { language, setLanguage } = useContext(LanguageContext);

  return (
    <div className="flex flex-wrap justify-center gap-2 mb-4">
      {languages.map(({ code, name, flag }) => (
        <Button
          key={code}
          variant={language === code ? "default" : "outline"}
          onClick={() => setLanguage(code)}
          className="flex items-center gap-2"
        >
          <span>{flag}</span>
          <span>{name}</span>
        </Button>
      ))}
    </div>
  );
};