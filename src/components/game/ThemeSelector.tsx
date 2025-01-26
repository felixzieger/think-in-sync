import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";

type Theme = "standard" | "sports" | "food" | "custom";

interface ThemeSelectorProps {
  onThemeSelect: (theme: string) => void;
}

export const ThemeSelector = ({ onThemeSelect }: ThemeSelectorProps) => {
  const [selectedTheme, setSelectedTheme] = useState<Theme>("standard");
  const [customTheme, setCustomTheme] = useState("");

  const handleSubmit = () => {
    if (selectedTheme === "custom" && !customTheme.trim()) return;
    onThemeSelect(selectedTheme === "custom" ? customTheme : selectedTheme);
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

      <RadioGroup
        defaultValue="standard"
        onValueChange={(value) => setSelectedTheme(value as Theme)}
        className="space-y-4"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="standard" id="standard" />
          <Label htmlFor="standard">Standard</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="sports" id="sports" />
          <Label htmlFor="sports">Sports</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="food" id="food" />
          <Label htmlFor="food">Food</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="custom" id="custom" />
          <Label htmlFor="custom">Custom Theme</Label>
        </div>
      </RadioGroup>

      {selectedTheme === "custom" && (
        <Input
          type="text"
          placeholder="Enter your theme (e.g., Animals, Movies)"
          value={customTheme}
          onChange={(e) => setCustomTheme(e.target.value)}
          className="mt-2"
        />
      )}

      <Button
        onClick={handleSubmit}
        className="w-full"
        disabled={selectedTheme === "custom" && !customTheme.trim()}
      >
        Continue ⏎
      </Button>
    </motion.div>
  );
};