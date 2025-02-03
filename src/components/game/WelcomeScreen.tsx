import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { HighScoreBoard } from "../HighScoreBoard";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { LanguageSelector } from "./LanguageSelector";
import { useTranslation } from "@/hooks/useTranslation";
import { ContestSection } from "./welcome/ContestSection";
import { HuggingFaceLink } from "./welcome/HuggingFaceLink";
import { MainActions } from "./welcome/MainActions";
import { HowToPlayDialog } from "./welcome/HowToPlayDialog";

interface WelcomeScreenProps {
  onStartDaily: () => void;
  onStartNew: () => void;
}

export const WelcomeScreen = ({ onStartDaily: onStartDaily, onStartNew: onStartNew }: WelcomeScreenProps) => {
  const [showHighScores, setShowHighScores] = useState(false);
  const [showHowToPlay, setShowHowToPlay] = useState(false);
  const t = useTranslation();

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        onStartDaily()
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [onStartDaily]);

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-2xl mx-auto text-center space-y-8"
      >

        <div className="relative">
          <h1 className="mb-4 text-4xl font-bold text-gray-900">{t.welcome.title}</h1>
          <div className="absolute top-0 right-0">
            <LanguageSelector />
          </div>
          <p className="text-lg text-gray-600">
            {t.welcome.subtitle}
          </p>
        </div>

        <MainActions
          onStartDaily={onStartDaily}
          onStartNew={onStartNew}
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
        <div className="mt-12 text-sm text-gray-500 space-y-2">
          <p>
            Made by{" "}
            <a href="https://www.linkedin.com/in/sandro-mikautadze/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Sandro</a>,{" "}
            <a href="https://www.linkedin.com/in/alessandro-pranzo/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Alessandro</a>,{" "}
            <a href="https://www.linkedin.com/in/mattia-martino-528363225/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline"> Mattia</a>,{" "}
            <a href="https://www.linkedin.com/in/michael-sheroubi/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Michael</a>,{" "}
            <a href="https://www.linkedin.com/in/michael-sheroubi/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Emiliano</a>, and{" "}
            <a href="https://felixzieger.de/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Felix</a>{" "}
          </p>
        </div>
      </motion.div >


      <Dialog open={showHighScores} onOpenChange={setShowHighScores}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
          <HighScoreBoard
            showThemeFilter={true}
            onClose={() => setShowHighScores(false)}
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
