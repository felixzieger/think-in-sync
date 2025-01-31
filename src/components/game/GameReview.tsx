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
import { useSearchParams } from "react-router-dom";

interface GameReviewProps {
  currentScore: number;
  avgWordsPerRound: number;
  onPlayAgain: () => void;
  sessionId: string;
  currentTheme: string;
}

interface ComparisonData {
  score: number;
  avgWords: number;
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
  const [searchParams] = useSearchParams();
  const fromSession = searchParams.get('from_session');
  const [showHighScores, setShowHighScores] = useState(false);
  const [gameResults, setGameResults] = useState([]);
  const [friendData, setFriendData] = useState<ComparisonData | null>(null);
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

    const fetchFriendResults = async () => {
      if (!fromSession) return;

      const { data: friendResults, error } = await supabase
        .from('game_results')
        .select('target_word, is_correct, description, ai_guess')
        .eq('session_id', fromSession);

      if (error) {
        console.error('Error fetching friend results:', error);
        return;
      }

      if (friendResults) {
        const successfulRounds = friendResults.filter(r => r.is_correct).length;
        const totalWords = friendResults.reduce((acc, r) => acc + (r.description?.split(' ').length || 0), 0);
        const avgWords = successfulRounds > 0 ? totalWords / successfulRounds : 0;

        setFriendData({
          score: successfulRounds,
          avgWords: avgWords
        });
      }
    };

    fetchGameResults();
    if (fromSession) {
      fetchFriendResults();
    }
  }, [sessionId, fromSession]);

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

  const renderComparisonResult = () => {
    if (!friendData) return null;

    const didWin = currentScore > friendData.score ||
      (currentScore === friendData.score && avgWordsPerRound < friendData.avgWords);

    return (
      <div className="space-y-4 mt-4">
        <p className="text-xl font-bold">
          {didWin ? `${t.game.review.youWin} 🎉` : `${t.game.review.youLost} 🧘`}
        </p>
        <p className="text-sm text-gray-600">
          {t.game.review.friendScore(friendData.score, friendData.avgWords.toFixed(1))}
        </p>
      </div>
    );
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
            {t.game.review.successfulRounds}: <span className="font-bold">{currentScore}</span>
          </p>
          <p className="text-sm text-gray-600">
            {t.leaderboard.wordsPerRound}: {avgWordsPerRound.toFixed(1)}
          </p>
          {renderComparisonResult()}
        </div>

        <GameDetailsView gameResults={gameResults} fromSession={fromSession} />

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