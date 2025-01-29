import { motion } from "framer-motion";
import { useState } from "react";
import { HighScoreBoard } from "../HighScoreBoard";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { LanguageSelector } from "./LanguageSelector";
import { useTranslation } from "@/hooks/useTranslation";
import { ContestSection } from "./welcome/ContestSection";
import { HuggingFaceLink } from "./welcome/HuggingFaceLink";
import { MainActions } from "./welcome/MainActions";
import { HowToPlayDialog } from "./welcome/HowToPlayDialog";

interface WelcomeScreenProps {
  onStart: () => void;
}

export const WelcomeScreen = ({ onStart }: WelcomeScreenProps) => {
  const [showHighScores, setShowHighScores] = useState(false);
  const [showHowToPlay, setShowHowToPlay] = useState(false);
  const t = useTranslation();

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-2xl mx-auto text-center space-y-8"
      >
        <LanguageSelector />
        
        <div>
          <h1 className="mb-4 text-4xl font-bold text-gray-900">{t.welcome.title}</h1>
          <p className="text-lg text-gray-600">
            {t.welcome.subtitle}
          </p>
        </div>

        <MainActions 
          onStart={onStart}
          onShowHowToPlay={() => setShowHowToPlay(true)}
          onShowHighScores={() => setShowHighScores(true)}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="max-w-2xl mx-auto text-center mt-8"
      >
        <HuggingFaceLink />
      </motion.div>

      <Dialog open={showHighScores} onOpenChange={setShowHighScores}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
          <HighScoreBoard
            showThemeFilter={true}
            onClose={() => setShowHighScores(false)}
            onPlayAgain={onStart}
          />
        </DialogContent>
      </Dialog>

      <HowToPlayDialog 
        open={showHowToPlay} 
        onOpenChange={setShowHowToPlay}
      />
    </>
  );
};
