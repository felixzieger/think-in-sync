import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { useTranslation } from "@/hooks/useTranslation";
import { ThemeFilter } from "./game/leaderboard/ThemeFilter";
import { ScoreSubmissionForm } from "./game/leaderboard/ScoreSubmissionForm";
import { ScoresTable } from "./game/leaderboard/ScoresTable";
import { LeaderboardHeader } from "./game/leaderboard/LeaderboardHeader";
import { LeaderboardPagination } from "./game/leaderboard/LeaderboardPagination";

interface HighScore {
  id: string;
  player_name: string;
  score: number;
  avg_words_per_round: number;
  created_at: string;
  session_id: string;
  theme: string;
}

interface HighScoreBoardProps {
  currentScore?: number;
  avgWordsPerRound?: number;
  onClose?: () => void;
  onPlayAgain?: () => void;
  sessionId?: string;
  onScoreSubmitted?: () => void;
  showThemeFilter?: boolean;
  initialTheme?: string;
}

const ITEMS_PER_PAGE = 5;
const STANDARD_THEMES = ['standard', 'sports', 'food'];

export const HighScoreBoard = ({
  currentScore = 0,
  avgWordsPerRound = 0,
  onClose,
  sessionId = "",
  onScoreSubmitted,
  showThemeFilter = true,
  initialTheme = "standard",
}: HighScoreBoardProps) => {
  const [playerName, setPlayerName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTheme, setSelectedTheme] = useState<'standard' | 'sports' | 'food' | 'custom'>(
    initialTheme as 'standard' | 'sports' | 'food' | 'custom'
  );
  const { toast } = useToast();
  const t = useTranslation();
  const queryClient = useQueryClient();

  const showScoreInfo = sessionId !== "" && currentScore > 0;

  const { data: highScores } = useQuery({
    queryKey: ["highScores", selectedTheme],
    queryFn: async () => {
      console.log("Fetching high scores for theme:", selectedTheme);
      let query = supabase
        .from("high_scores")
        .select("*")
        .order("score", { ascending: false })
        .order("avg_words_per_round", { ascending: true });

      if (selectedTheme === 'custom') {
        const filterValue = `(${STANDARD_THEMES.join(',')})`;
        query = query.filter('theme', 'not.in', filterValue);
      } else {
        query = query.eq('theme', selectedTheme);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching high scores:", error);
        throw error;
      }
      console.log("Fetched high scores:", data);
      return data as HighScore[];
    },
  });

  const handleSubmitScore = async () => {
    if (!playerName.trim() || !/^[a-zA-ZÀ-ÿ0-9-]+$/u.test(playerName.trim())) {
      toast({
        title: t.leaderboard.error.invalidName,
        description: t.leaderboard.error.invalidName,
        variant: "destructive",
      });
      return;
    }

    if (currentScore < 1) {
      toast({
        title: t.leaderboard.error.noRounds,
        description: t.leaderboard.error.noRounds,
        variant: "destructive",
      });
      return;
    }

    if (hasSubmitted) {
      toast({
        title: t.leaderboard.error.alreadySubmitted,
        description: t.leaderboard.error.alreadySubmitted,
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      console.log("Submitting score via Edge Function...");
      const { data, error } = await supabase.functions.invoke('submit-high-score', {
        body: {
          playerName: playerName.trim(),
          score: currentScore,
          avgWordsPerRound,
          sessionId,
          theme: selectedTheme
        }
      });

      if (error) {
        console.error("Error submitting score:", error);
        throw error;
      }

      console.log("Score submitted successfully:", data);
      
      if (data.success) {
        toast({
          title: t.leaderboard.success,
          description: t.leaderboard.success,
        });
        
        setHasSubmitted(true);
        onScoreSubmitted?.();
        setPlayerName("");
        await queryClient.invalidateQueries({ queryKey: ["highScores"] });
      }
    } catch (error) {
      console.error("Error submitting score:", error);
      toast({
        title: t.leaderboard.error.submitError,
        description: t.leaderboard.error.submitError,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      await handleSubmitScore();
    }
  };

  const totalPages = highScores ? Math.ceil(highScores.length / ITEMS_PER_PAGE) : 0;
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedScores = highScores?.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="space-y-6">
      <LeaderboardHeader
        currentScore={currentScore}
        avgWordsPerRound={avgWordsPerRound}
        showScoreInfo={showScoreInfo}
      />

      {showThemeFilter && (
        <ThemeFilter
          selectedTheme={selectedTheme}
          onThemeChange={setSelectedTheme}
        />
      )}

      {!hasSubmitted && currentScore > 0 && (
        <ScoreSubmissionForm
          playerName={playerName}
          setPlayerName={setPlayerName}
          isSubmitting={isSubmitting}
          hasSubmitted={hasSubmitted}
          onSubmit={handleSubmitScore}
          onKeyDown={handleKeyDown}
        />
      )}

      <ScoresTable
        scores={paginatedScores || []}
        startIndex={startIndex}
      />

      <LeaderboardPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPreviousPage={() => setCurrentPage(p => Math.max(1, p - 1))}
        onNextPage={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
      />
    </div>
  );
};
