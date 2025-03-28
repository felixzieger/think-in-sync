import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useTranslation } from "@/hooks/useTranslation";
import { useContext } from "react";
import { LanguageContext } from "@/contexts/LanguageContext";
import { ArrowLeft } from "lucide-react";
import { modelNames } from "@/lib/modelNames";

interface ModelSelectorProps {
  onModelSelect: (model: string) => void;
  onBack: () => void;
}

// TODO: Once user authentication is implemented, this will be replaced with a dynamic list
// based on the user's subscription level
const AVAILABLE_MODELS = [
  "google/gemini-2.0-flash-exp:free",
  "mistralai/mistral-nemo",
  "deepseek/deepseek-chat:free"
];

export const ModelSelector = ({ onModelSelect, onBack }: ModelSelectorProps) => {
  const [selectedModel, setSelectedModel] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);
  const t = useTranslation();
  const { language } = useContext(LanguageContext);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return;
      
      // Allow backspace to go back
      if (e.key === 'backspace') {
        e.preventDefault();
        onBack();
      }
      
      // Allow enter to submit if a model is selected
      if (e.key === 'enter' && selectedModel) {
        handleSubmit();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [selectedModel, onBack]);

  const handleSubmit = async () => {
    if (!selectedModel) return;
    
    setIsGenerating(true);
    try {
      await onModelSelect(selectedModel);
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
      <div className="flex items-center justify-between mb-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="hover:bg-gray-100"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-2xl font-bold text-gray-900">{t.models.title}</h2>
        <div className="w-8" /> {/* Spacer for centering */}
      </div>

      <p className="text-gray-600 text-center">{t.models.subtitle}</p>

      <div className="space-y-4">
        {AVAILABLE_MODELS.map((modelId) => (
          <Button
            key={modelId}
            variant={selectedModel === modelId ? "default" : "outline"}
            className="w-full justify-between"
            onClick={() => setSelectedModel(modelId)}
          >
            {modelNames[modelId]}
          </Button>
        ))}
      </div>

      <Button
        onClick={handleSubmit}
        className="w-full"
        disabled={!selectedModel || isGenerating}
      >
        {isGenerating ? t.models.generating : `${t.models.continue} ⏎`}
      </Button>
    </motion.div>
  );
}; 