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
import { useSearchParams, useNavigate } from "react-router-dom";
import { RoundHeader } from "./sentence-builder/RoundHeader";

interface GameReviewProps {
  currentScore: number;
  avgWordsPerRound: number;
  onPlayAgain: (game_id?: string, fromSession?: string) => void;
  onBack?: () => void;
  gameId?: string;
  sessionId: string;
  currentTheme: string;
  fromSession?: string | null;
}

export const GameReview = ({
  currentScore,
  avgWordsPerRound,
  onPlayAgain,
  onBack,
  gameId,
  sessionId,
  currentTheme,
  fromSession,
}: GameReviewProps) => {
  const t = useTranslation();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [showHighScores, setShowHighScores] = useState(false);
  const [gameResults, setGameResults] = useState([]);
  const [friendData, setFriendData] = useState<{ score: number; avgWords: number } | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
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

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Only handle Enter key if high scores dialog is not open
      if (e.key === 'Enter' && !showHighScores) {
        handlePlayAgain();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [showHighScores]); // Add showHighScores to dependencies

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

  const handlePlayAgain = async () => {
    try {
      const { data: session, error } = await supabase
        .from('sessions')
        .insert({
          game_id: gameId
        })
        .select()
        .single();

      if (error) throw error;

      onPlayAgain(gameId, fromSession);
    } catch (error) {
      console.error('Error creating new session:', error);
      toast({
        title: "Error",
        description: "Failed to restart the game. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handlePlayNewWords = async () => {
    onPlayAgain();
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
      <RoundHeader
        successfulRounds={currentScore}
        onBack={onBack}
        showConfirmDialog={showConfirmDialog}
        setShowConfirmDialog={setShowConfirmDialog}
      />

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

      <div className="grid grid-cols-1 gap-4">
        <Button onClick={() => setShowHighScores(true)} className="w-full bg-primary hover:bg-primary/90">
          {t.game.review.saveScore} 🏆
        </Button>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Button onClick={handlePlayAgain} variant="secondary" className="text-white w-full">
            {t.game.review.playAgain} ⏎
          </Button>
          <Button onClick={handlePlayNewWords} variant="secondary" className="text-white w-full">
            {t.game.review.playNewWords}
          </Button>
        </div>
      </div>

      <Dialog open={showHighScores} onOpenChange={setShowHighScores}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
          <HighScoreBoard
            currentScore={currentScore}
            avgWordsPerRound={avgWordsPerRound}
            onClose={() => setShowHighScores(false)}
            gameId={gameId}
            sessionId={sessionId}
            showThemeFilter={false}
            initialTheme={currentTheme}
          />
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};