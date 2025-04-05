import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "@/hooks/useTranslation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy, Home } from "lucide-react";
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
  wrongGuesses: number;
  totalRounds: number;
  avgWordsPerRound: number;
  onPlayAgain: (game_id?: string, fromSession?: string) => void;
  onBack?: () => void;
  gameId?: string;
  sessionId: string;
  currentTheme: string;
  fromSession?: string | null;
  words: string[];
}

export const GameReview = ({
  currentScore,
  wrongGuesses,
  totalRounds,
  avgWordsPerRound,
  onPlayAgain,
  onBack,
  gameId,
  sessionId,
  currentTheme,
  fromSession,
  words,
}: GameReviewProps) => {
  const t = useTranslation();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [showHighScores, setShowHighScores] = useState(false);
  const [gameResults, setGameResults] = useState([]);
  const [friendData, setFriendData] = useState<{ score: number; avgWords: number } | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const shareUrl = `${window.location.origin}/?from_session=${sessionId}`;

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

  const handleHomeClick = () => {
    if (onBack) {
      onBack();
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
      <div className="relative flex items-center justify-center">
        <Button
          variant="ghost"
          size="icon"
          className="absolute left-0 text-gray-600 hover:text-primary"
          onClick={handleHomeClick}
        >
          <Home className="h-5 w-5" />
        </Button>
        <h2 className="text-2xl font-bold text-gray-900">
          {t.game.review.title}
        </h2>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <div className="rounded-lg bg-gray-50 p-6">
            <div className="flex justify-center items-center gap-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">{currentScore}</div>
                <div className="text-sm text-gray-600">{t.game.review.correct}</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-red-600">{wrongGuesses}</div>
                <div className="text-sm text-gray-600">{t.game.review.wrong}</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-600">{totalRounds}</div>
                <div className="text-sm text-gray-600">{t.game.review.total}</div>
              </div>
            </div>
            <div className="mt-4 space-y-1">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full"
                  style={{ width: `${(currentScore / totalRounds) * 100}%` }}
                />
                <div
                  className="bg-gradient-to-r from-red-500 to-red-600 h-2 rounded-full -mt-2"
                  style={{ 
                    width: `${(wrongGuesses / totalRounds) * 100}%`,
                    marginLeft: `${(currentScore / totalRounds) * 100}%`
                  }}
                />
              </div>
              <p className="text-sm text-gray-600 text-center">
                {t.game.review.avgWords}: {avgWordsPerRound.toFixed(1)}
              </p>
            </div>
          </div>
        </div>
        {renderComparisonResult()}

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
