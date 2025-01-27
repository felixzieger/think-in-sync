import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useState } from "react";
import { HighScoreBoard } from "../HighScoreBoard";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { LanguageSelector } from "./LanguageSelector";
import { useTranslation } from "@/hooks/useTranslation";
import { useContext } from "react";
import { LanguageContext } from "@/contexts/LanguageContext";
import { Heart } from "lucide-react";

interface WelcomeScreenProps {
  onStart: () => void;
}

export const WelcomeScreen = ({ onStart }: WelcomeScreenProps) => {
  const [showHighScores, setShowHighScores] = useState(false);
  const [showHowToPlay, setShowHowToPlay] = useState(false);
  const t = useTranslation();
  const { language } = useContext(LanguageContext);

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

        <div className="space-y-4">
          <Button
            onClick={onStart}
            className="w-full bg-primary text-lg hover:bg-primary/90"
          >
            {t.welcome.startButton} ⏎
          </Button>
          <div className="grid grid-cols-2 gap-4">
            <Button
              onClick={() => setShowHowToPlay(true)}
              variant="outline"
              className="text-lg"
            >
              {t.welcome.howToPlay} 📖
            </Button>
            <Button
              onClick={() => setShowHighScores(true)}
              variant="outline"
              className="text-lg"
            >
              {t.welcome.leaderboard} 🏆
            </Button>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="max-w-2xl mx-auto text-center mt-12 space-y-4"
      >
        <p className="text-sm text-gray-500">
          {t.welcome.credits}{" "}
          <a 
            href="https://blog.felixzieger.de/gaming-hackathon-paris/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            AI Gaming Hackathon
          </a>
        </p>
        <div className="flex flex-col items-center gap-2">
          <p className="text-sm text-gray-600">{t.welcome.helpWin}</p>
          <a 
            href="https://huggingface.co/spaces/Mistral-AI-Game-Jam/description-improv/tree/main" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex flex-col items-center gap-2 px-4 py-2 text-sm font-bold text-primary hover:text-primary/90 transition-colors border border-primary/20 rounded-md hover:border-primary/40"
          >
            <span className="inline-flex items-center gap-2">
              <Heart className="w-4 h-4" /> {t.welcome.onHuggingface}
            </span>
          </a>
        </div>
      </motion.div>

      <Dialog open={showHighScores} onOpenChange={setShowHighScores}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
          <HighScoreBoard
            currentScore={0}
            avgWordsPerRound={0}
            onClose={() => setShowHighScores(false)}
            onPlayAgain={onStart}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={showHowToPlay} onOpenChange={setShowHowToPlay}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-primary">{t.welcome.howToPlay}</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div className="grid gap-4 text-gray-600">
              <div>
                <h3 className="font-medium text-gray-800">{t.howToPlay.setup.title}</h3>
                <p>{t.howToPlay.setup.description}</p>
              </div>
              <div>
                <h3 className="font-medium text-gray-800">{t.howToPlay.goal.title}</h3>
                <p>{t.howToPlay.goal.description}</p>
              </div>
              <div>
                <h3 className="font-medium text-gray-800">{t.howToPlay.rules.title}</h3>
                <ul className="list-disc list-inside space-y-1">
                  {t.howToPlay.rules.items.map((rule, index) => (
                    <li key={index}>{rule}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};