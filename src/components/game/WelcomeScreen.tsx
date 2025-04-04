
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { HighScoreBoard } from "../HighScoreBoard";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { LanguageSelector } from "./LanguageSelector";
import { useTranslation } from "@/hooks/useTranslation";
import { ContestSection } from "./welcome/ContestSection";
import { HuggingFaceLink } from "./welcome/HuggingFaceLink";
import { MainActions } from "./welcome/MainActions";
import { HowToPlayDialog } from "./welcome/HowToPlayDialog";
import { CreditsDialog } from "./welcome/CreditsDialog";
import { Mail } from "lucide-react";
import { StatsDialog } from "./welcome/StatsDialog";
import { UserMenu } from "../auth/UserMenu";

interface WelcomeScreenProps {
  onStartDaily: () => void;
  onStartNew: () => void;
}

export const WelcomeScreen = ({ onStartDaily, onStartNew }: WelcomeScreenProps) => {
  const [showHighScores, setShowHighScores] = useState(false);
  const [showHowToPlay, setShowHowToPlay] = useState(false);
  const [showCredits, setShowCredits] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const t = useTranslation();

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        onStartDaily();
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
          <div className="absolute top-0 right-0 flex items-center gap-4">
            <UserMenu />
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
          <div className="flex justify-center items-center gap-4">
            <button
              onClick={() => setShowCredits(true)}
              className="text-primary hover:text-primary/80 transition-colors"
            >
              Made by M1X
            </button>
            <span>•</span>
            <a
              href="mailto:hello@think-in-sync.com"
              className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
              title="Send us feedback"
            >
              <Mail className="w-4 h-4" />
              <span>Feedback</span>
            </a>
            <span>•</span>
            <button
              onClick={() => setShowStats(true)}
              className="text-primary hover:text-primary/80 transition-colors"
            >
              {t.welcome.stats.title}
            </button>
          </div>
        </div>
      </motion.div>

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

      <CreditsDialog
        open={showCredits}
        onOpenChange={setShowCredits}
      />

      <StatsDialog
        open={showStats}
        onOpenChange={setShowStats}
      />
    </>
  );
};
