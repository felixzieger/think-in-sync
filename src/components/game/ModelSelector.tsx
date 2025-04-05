import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useTranslation } from "@/hooks/useTranslation";
import { useContext } from "react";
import { LanguageContext } from "@/contexts/LanguageContext";
import { ArrowLeft } from "lucide-react";
import { modelNames } from "@/lib/modelNames";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ModelSelectorProps {
  onModelSelect: (model: string) => void;
  onBack: () => void;
}

// TODO: Once user authentication is implemented, this will be replaced with a dynamic list
// based on the user's subscription level
const AVAILABLE_MODELS = [
  "google/gemini-2.0-flash-lite-001",
  "deepseek/deepseek-chat:free",
  "meta-llama/llama-3.3-70b-instruct:free",
  "custom",
];

// A larger set of models that can be selected
const SEARCHABLE_MODELS = [
  "google/gemini-2.0-flash-001",
  "anthropic/claude-3.7-sonnet",
  "openai/gpt-4o",
  "mistralai/mistral-large-2411",
  "x-ai/grok-beta",
];

export const ModelSelector = ({ onModelSelect, onBack }: ModelSelectorProps) => {
  const [selectedModel, setSelectedModel] = useState<string>(AVAILABLE_MODELS[0]);
  const [customModel, setCustomModel] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);
  const t = useTranslation();
  const { language } = useContext(LanguageContext);
  const { user } = useAuth();

  const handleSubmit = async () => {
    if (!selectedModel) return;
    
    setIsGenerating(true);
    try {
      await onModelSelect(selectedModel === "custom" ? customModel : selectedModel);
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
        case 'd':
          e.preventDefault();
          setSelectedModel("custom");
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
  }, [selectedModel, customModel, onBack, handleSubmit]);

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
            <div className="flex items-center gap-2">
              {modelId === "custom" ? t.models.custom : modelNames[modelId]}
              {modelId === "custom" && !user}
            </div>
            <span className="text-sm opacity-50">{t.themes.pressKey} {String.fromCharCode(65 + index)}</span>
          </Button>
        ))}

        {selectedModel === "custom" && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            {user ? (
              <Select
                value={customModel}
                onValueChange={setCustomModel}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={t.models.searchPlaceholder} />
                </SelectTrigger>
                <SelectContent>
                  {SEARCHABLE_MODELS.map((model) => (
                    <SelectItem key={model} value={model}>
                      {modelNames[model] || model}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <div className="text-center text-sm text-gray-600">
                <p>{t.models.loginRequired}</p>
                <div className="mt-2 flex justify-center gap-2">
                  <Link to="/auth/login" className="text-primary hover:underline">
                    {t.auth.login.linkText}
                  </Link>
                  <span>or</span>
                  <Link to="/auth/register" className="text-primary hover:underline">
                    {t.auth.register.linkText}
                  </Link>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </div>

      <Button
        onClick={handleSubmit}
        className="w-full"
        disabled={!selectedModel || (selectedModel === "custom" && !customModel && user !== null) || isGenerating}
      >
        {isGenerating ? t.models.generating : `${t.models.continue} ⏎`}
      </Button>
    </motion.div>
  );
}; 