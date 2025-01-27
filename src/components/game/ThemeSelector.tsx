import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { useTranslation } from "@/hooks/useTranslation";
import { useContext } from "react";
import { LanguageContext } from "@/contexts/LanguageContext";

type Theme = "standard" | "technology" | "sports" | "food" | "custom";

interface ThemeSelectorProps {
  onThemeSelect: (theme: string) => void;
}

export const ThemeSelector = ({ onThemeSelect }: ThemeSelectorProps) => {
  const [selectedTheme, setSelectedTheme] = useState<Theme>("standard");
  const [customTheme, setCustomTheme] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const t = useTranslation();
  const { language } = useContext(LanguageContext);

  useEffect(() => {
    if (language !== 'en') {
      setSelectedTheme("technology");
    }
  }, [language]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return;
      
      switch(e.key.toLowerCase()) {
        case 'a':
          if (language === 'en') {
            setSelectedTheme("standard");
          } else {
            setSelectedTheme("technology");
          }
          break;
        case 'b':
          setSelectedTheme("sports");
          break;
        case 'c':
          setSelectedTheme("food");
          break;
        case 'd':
          e.preventDefault();
          setSelectedTheme("custom");
          break;
        case 'enter':
          if (selectedTheme !== "custom" || customTheme.trim()) {
            handleSubmit();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [selectedTheme, customTheme, language]);

  useEffect(() => {
    if (selectedTheme === "custom") {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [selectedTheme]);

  const handleSubmit = async () => {
    if (selectedTheme === "custom" && !customTheme.trim()) return;
    
    setIsGenerating(true);
    try {
      await onThemeSelect(selectedTheme === "custom" ? customTheme : selectedTheme);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleInputKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && customTheme.trim()) {
      handleSubmit();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-gray-900">{t.themes.title}</h2>
        <p className="text-gray-600">{t.themes.subtitle}</p>
      </div>

      <div className="space-y-4">
        {language === 'en' ? (
          <Button
            variant={selectedTheme === "standard" ? "default" : "outline"}
            className="w-full justify-between"
            onClick={() => setSelectedTheme("standard")}
          >
            {t.themes.standard} <span className="text-sm opacity-50">{t.themes.pressKey} A</span>
          </Button>
        ) : (
          <Button
            variant={selectedTheme === "technology" ? "default" : "outline"}
            className="w-full justify-between"
            onClick={() => setSelectedTheme("technology")}
          >
            {t.themes.technology} <span className="text-sm opacity-50">{t.themes.pressKey} A</span>
          </Button>
        )}
        
        <Button
          variant={selectedTheme === "sports" ? "default" : "outline"}
          className="w-full justify-between"
          onClick={() => setSelectedTheme("sports")}
        >
          {t.themes.sports} <span className="text-sm opacity-50">{t.themes.pressKey} B</span>
        </Button>
        
        <Button
          variant={selectedTheme === "food" ? "default" : "outline"}
          className="w-full justify-between"
          onClick={() => setSelectedTheme("food")}
        >
          {t.themes.food} <span className="text-sm opacity-50">{t.themes.pressKey} C</span>
        </Button>

        <Button
          variant={selectedTheme === "custom" ? "default" : "outline"}
          className="w-full justify-between"
          onClick={() => setSelectedTheme("custom")}
        >
          {t.themes.custom} <span className="text-sm opacity-50">{t.themes.pressKey} D</span>
        </Button>

        {selectedTheme === "custom" && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Input
              ref={inputRef}
              type="text"
              placeholder={t.themes.customPlaceholder}
              value={customTheme}
              onChange={(e) => setCustomTheme(e.target.value)}
              onKeyPress={handleInputKeyPress}
              className="w-full"
            />
          </motion.div>
        )}
      </div>

      <Button
        onClick={handleSubmit}
        className="w-full"
        disabled={selectedTheme === "custom" && !customTheme.trim() || isGenerating}
      >
        {isGenerating ? t.themes.generating : `${t.themes.continue} ⏎`}
      </Button>
    </motion.div>
  );
};