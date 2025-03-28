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
  "google/gemini-2.0-flash-lite-001",
  // "x-ai/grok-2-1212",
  "deepseek/deepseek-chat:free",
  "meta-llama/llama-3.3-70b-instruct:free",
];

export const ModelSelector = ({ onModelSelect, onBack }: ModelSelectorProps) => {
  const [selectedModel, setSelectedModel] = useState<string>(AVAILABLE_MODELS[0]);
  const [isGenerating, setIsGenerating] = useState(false);
  const t = useTranslation();
  const { language } = useContext(LanguageContext);

  const handleSubmit = async () => {
    if (!selectedModel) return;
    
    setIsGenerating(true);
    try {
      await onModelSelect(selectedModel);
    } finally {
      setIsGenerating(false);
    }
  };

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

      // Model selection shortcuts
      switch(e.key.toLowerCase()) {
        case 'a':
          setSelectedModel(AVAILABLE_MODELS[0]);
          break;
        case 'b':
          setSelectedModel(AVAILABLE_MODELS[1]);
          break;
        case 'c':
          setSelectedModel(AVAILABLE_MODELS[2]);
          break;
        case 'enter':
          if (selectedModel) {
            handleSubmit();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [selectedModel, onBack, handleSubmit]);

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
        {AVAILABLE_MODELS.map((modelId, index) => (
          <Button
            key={modelId}
            variant={selectedModel === modelId ? "default" : "outline"}
            className="w-full justify-between"
            onClick={() => setSelectedModel(modelId)}
          >
            {modelNames[modelId]} <span className="text-sm opacity-50">{t.themes.pressKey} {String.fromCharCode(65 + index)}</span>
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