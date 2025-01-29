import { Button } from "@/components/ui/button";
import { useTranslation } from "@/hooks/useTranslation";
import { Filter } from "lucide-react";

type Theme = 'standard' | 'sports' | 'food' | 'custom';

interface ThemeFilterProps {
  selectedTheme: Theme;
  onThemeChange: (theme: Theme) => void;
}

export const ThemeFilter = ({ selectedTheme, onThemeChange }: ThemeFilterProps) => {
  const t = useTranslation();

  const themes: Theme[] = ['standard', 'sports', 'food', 'custom'];

  return (
    <div className="flex flex-wrap gap-2 mb-4 items-center">
      <Filter className="h-4 w-4 text-gray-500" />
      {themes.map((theme) => (
        <Button
          key={theme}
          variant={selectedTheme === theme ? "default" : "outline"}
          size="sm"
          onClick={() => onThemeChange(theme)}
        >
          {t.themes[theme]}
        </Button>
      ))}
    </div>
  );
};