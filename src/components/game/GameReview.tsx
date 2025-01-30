import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "@/hooks/useTranslation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { HighScoreBoard } from "@/components/HighScoreBoard";
import { GameDetailsView } from "@/components/admin/GameDetailsView";
import { supabase } from "@/integrations/supabase/client";

interface GameReviewProps {
  currentScore: number;
  avgWordsPerRound: number;
  onPlayAgain: () => void;
  sessionId: string;
  currentTheme: string;
}

export const GameReview = ({
  currentScore,
  avgWordsPerRound,
  onPlayAgain,
  sessionId,
  currentTheme,
}: GameReviewProps) => {
  const t = useTranslation();
  const [showHighScores, setShowHighScores] = useState(false);
  const [gameResults, setGameResults] = useState([]);

  useEffect(() => {
    const fetchGameResults = async () => {
      const { data, error } = await supabase
        .from('game_results')
        .select('*')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: true });

      if (!error && data) {
        setGameResults(data);
      }
    };

    fetchGameResults();
  }, [sessionId]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="text-center space-y-6"
    >
      <h2 className="text-2xl font-bold mb-4">{t.game.review.title}</h2>

      <div className="space-y-4">
        <p>{t.game.review.description}</p>

        <div className="bg-gray-100 p-4 rounded-lg">
          <p className="text-lg">
            {t.game.review.roundsPlayed}: <span className="font-bold">{currentScore}</span>
          </p>
          <p className="text-sm text-gray-600">
            {t.leaderboard.wordsPerRound}: {avgWordsPerRound.toFixed(1)}
          </p>
        </div>

        <GameDetailsView gameResults={gameResults} />
      </div>

      <div className="flex justify-center gap-4 mt-6">
        <Button onClick={onPlayAgain} className="text-white">
          {t.game.review.playAgain} ⏎
        </Button>
        <Button onClick={() => setShowHighScores(true)} variant="secondary" className="text-white">
          {t.game.review.saveScore}
        </Button>
        <Button onClick={() => setShowHighScores(true)} variant="secondary" className="text-white">
          {t.game.review.shareGame}
        </Button>
      </div>

      <Dialog open={showHighScores} onOpenChange={setShowHighScores}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
          <HighScoreBoard
            currentScore={currentScore}
            avgWordsPerRound={avgWordsPerRound}
            onClose={() => setShowHighScores(false)}
            onPlayAgain={onPlayAgain}
            sessionId={sessionId}
            showThemeFilter={false}
            initialTheme={currentTheme}
          />
        </DialogContent>
      </Dialog>
    </motion.div >
  );
};
