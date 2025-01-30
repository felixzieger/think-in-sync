import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "@/hooks/useTranslation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { HighScoreBoard } from "@/components/HighScoreBoard";
import { GameDetailsView } from "@/components/admin/GameDetailsView";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

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
  const { toast } = useToast();
  const [showHighScores, setShowHighScores] = useState(false);
  const [gameResults, setGameResults] = useState([]);
  const shareUrl = `${window.location.origin}/game?from_session=${sessionId}`;

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

    const saveGameResults = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('save-game-results', {
          body: { sessionId }
        });

        if (error) {
          console.error('Error saving game results:', error);
          return;
        }

        console.log('Game results saved successfully:', data);
      } catch (err) {
        console.error('Failed to save game results:', err);
      }
    };

    fetchGameResults();
    saveGameResults();
  }, [sessionId]);

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast({
        title: t.game.review.urlCopied,
        description: t.game.review.urlCopiedDesc,
      });
    } catch (err) {
      console.error('Failed to copy URL:', err);
      toast({
        title: t.game.review.urlCopyError,
        description: t.game.review.urlCopyErrorDesc,
        variant: "destructive",
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="text-center space-y-6"
    >
      <h2 className="text-2xl font-bold mb-4">{t.game.review.title}</h2>

      <div className="space-y-4">
        <div className="bg-gray-100 p-4 rounded-lg">
          <p className="text-lg">
            {t.game.review.roundsPlayed}: <span className="font-bold">{gameResults.length}</span>
          </p>
          <p className="text-sm text-gray-600">
            {t.leaderboard.wordsPerRound}: {(gameResults.length > 0 ? avgWordsPerRound : 0).toFixed(1)}
          </p>
        </div>

        <div className="relative items-center bg-gray-100 p-4 rounded-lg">
          <p className="text-sm">{t.game.review.urlCopiedDesc}</p>
          <div className="relative flex items-center p-4 rounded-lg">
            <Input
              value={shareUrl}
              readOnly
              className="pr-10"
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={handleCopyUrl}
              className="absolute right-6"
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
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
    </motion.div>
  );
};