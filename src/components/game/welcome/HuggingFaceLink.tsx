import { Heart } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

export const HuggingFaceLink = () => {
  const t = useTranslation();
  
  return (
    <div className="flex flex-col items-center gap-2">
      <a 
        href="https://huggingface.co/spaces/Mistral-AI-Game-Jam/description-improv/tree/main" 
        target="_blank" 
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary hover:text-primary/90 transition-colors border border-primary/20 rounded-md hover:border-primary/40"
      >
        <Heart className="w-4 h-4" /> {t.welcome.likeOnHuggingface}
      </a>
    </div>
  );
};