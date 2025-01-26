import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";

type Theme = "standard" | "sports" | "food" | "custom";

interface ThemeSelectorProps {
  onThemeSelect: (theme: string) => void;
}

export const ThemeSelector = ({ onThemeSelect }: ThemeSelectorProps) => {
  const [selectedTheme, setSelectedTheme] = useState<Theme>("standard");
  const [customTheme, setCustomTheme] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return; // Ignore when typing in input
      
      switch(e.key.toLowerCase()) {
        case 'a':
          setSelectedTheme("standard");
          break;
        case 'b':
          setSelectedTheme("sports");
          break;
        case 'c':
          setSelectedTheme("food");
          break;
        case 'z':
          setSelectedTheme("custom");
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  const handleSubmit = async () => {
    if (selectedTheme === "custom" && !customTheme.trim()) return;
    
    setIsGenerating(true);
    try {
      await onThemeSelect(selectedTheme === "custom" ? customTheme : selectedTheme);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-gray-900">Choose a Theme</h2>
        <p className="text-gray-600">Select a theme for your word-guessing adventure</p>
      </div>

      <div className="space-y-4">
        <Button
          variant={selectedTheme === "standard" ? "default" : "outline"}
          className="w-full justify-between"
          onClick={() => setSelectedTheme("standard")}
        >
          Standard <span className="text-sm opacity-50">Press A</span>
        </Button>
        
        <Button
          variant={selectedTheme === "sports" ? "default" : "outline"}
          className="w-full justify-between"
          onClick={() => setSelectedTheme("sports")}
        >
          Sports <span className="text-sm opacity-50">Press B</span>
        </Button>
        
        <Button
          variant={selectedTheme === "food" ? "default" : "outline"}
          className="w-full justify-between"
          onClick={() => setSelectedTheme("food")}
        >
          Food <span className="text-sm opacity-50">Press C</span>
        </Button>

        <Button
          variant={selectedTheme === "custom" ? "default" : "outline"}
          className="w-full justify-between"
          onClick={() => setSelectedTheme("custom")}
        >
          Choose your theme <span className="text-sm opacity-50">Press Z</span>
        </Button>

        {selectedTheme === "custom" && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Input
              type="text"
              placeholder="Enter a theme (e.g., Animals, Movies)"
              value={customTheme}
              onChange={(e) => setCustomTheme(e.target.value)}
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
        {isGenerating ? "Generating themed words..." : "Continue ⏎"}
      </Button>
    </motion.div>
  );
};