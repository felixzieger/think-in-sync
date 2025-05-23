import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useTranslation } from "@/hooks/useTranslation";
import { ArrowLeft } from "lucide-react";

interface GameInvitationProps {
  onContinue: () => void;
  onBack: () => void;
}

export const GameInvitation = ({ onContinue, onBack }: GameInvitationProps) => {
  const t = useTranslation();
  
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
        <h2 className="text-2xl font-bold text-gray-900">{t.game.invitation.title}</h2>
        <div className="w-8" /> {/* Spacer for centering */}
      </div>

      <p className="text-gray-600 text-center">{t.game.invitation.description}</p>

      <Button
        onClick={onContinue}
        className="w-full"
      >
        {t.themes.continue} ⏎
      </Button>
    </motion.div>
  );
};