import { useState } from "react";
import { generateAIResponse } from "@/services/mistralService";
import { useToast } from "@/components/ui/use-toast";
import { Language } from "@/i18n/translations";

export const useSentenceState = (language: Language) => {
  const [sentence, setSentence] = useState<string[]>([]);
  const [playerInput, setPlayerInput] = useState<string>("");
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [aiGuess, setAiGuess] = useState<string>("");
  const { toast } = useToast();

  const handlePlayerWord = async (
    e: React.FormEvent,
    currentWord: string,
    onTotalWordsUpdate: (fn: (prev: number) => number) => void
  ) => {
    e.preventDefault();
    if (!playerInput.trim()) return;

    const word = playerInput.trim();
    const newSentence = [...sentence, word];
    setSentence(newSentence);
    setPlayerInput("");
    onTotalWordsUpdate(prev => prev + 1);

    setIsAiThinking(true);
    try {
      const aiWord = await generateAIResponse(currentWord, newSentence, language);
      const newSentenceWithAi = [...newSentence, aiWord];
      setSentence(newSentenceWithAi);
      onTotalWordsUpdate(prev => prev + 1);
    } catch (error) {
      console.error('Error in AI turn:', error);
      toast({
        title: "AI Thinking",
        description: "The AI is currently busy. Please try again in a moment.",
        variant: "default",
      });
    } finally {
      setIsAiThinking(false);
    }
  };

  return {
    sentence,
    setSentence,
    playerInput,
    setPlayerInput,
    isAiThinking,
    setIsAiThinking,
    aiGuess,
    setAiGuess,
    handlePlayerWord,
  };
};