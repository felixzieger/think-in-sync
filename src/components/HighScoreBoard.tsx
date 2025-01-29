import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useTranslation } from "@/hooks/useTranslation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ThemeFilter } from "./game/leaderboard/ThemeFilter";
import { ScoreSubmissionForm } from "./game/leaderboard/ScoreSubmissionForm";
import { ScoresTable } from "./game/leaderboard/ScoresTable";

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
  currentScore: number;
  avgWordsPerRound: number;
  onClose: () => void;
  onPlayAgain: () => void;
  sessionId: string;
  onScoreSubmitted?: () => void;
}

const ITEMS_PER_PAGE = 5;

export const HighScoreBoard = ({
  currentScore,
  avgWordsPerRound,
  onClose,
  sessionId,
  onScoreSubmitted,
}: HighScoreBoardProps) => {
  const [playerName, setPlayerName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTheme, setSelectedTheme] = useState<'standard' | 'sports' | 'food' | 'custom'>('standard');
  const { toast } = useToast();
  const t = useTranslation();
  const queryClient = useQueryClient();

  const showScoreInfo = sessionId !== "" && currentScore >= 0;

  const { data: highScores } = useQuery({
    queryKey: ["highScores", selectedTheme],
    queryFn: async () => {
      console.log("Fetching high scores for theme:", selectedTheme);
      const { data, error } = await supabase
        .from("high_scores")
        .select("*")
        .eq('theme', selectedTheme)
        .order("score", { ascending: false })
        .order("avg_words_per_round", { ascending: true });

      if (error) {
        console.error("Error fetching high scores:", error);
        throw error;
      }
      console.log("Fetched high scores:", data);
      return data as HighScore[];
    },
  });

  const handleSubmitScore = async () => {
    if (!playerName.trim() || !/^[\p{L}0-9]+$/u.test(playerName.trim())) {
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

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(p => p - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(p => p + 1);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">{t.leaderboard.title}</h2>
        {showScoreInfo && (
          <p className="text-gray-600">
            {t.leaderboard.yourScore}: {currentScore} {t.leaderboard.roundCount}
            {currentScore > 0 &&
              ` (${avgWordsPerRound.toFixed(1)} ${t.leaderboard.wordsPerRound})`}
          </p>
        )}
      </div>

      <ThemeFilter
        selectedTheme={selectedTheme}
        onThemeChange={setSelectedTheme}
      />

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

      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={handlePreviousPage}
                className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only">{t.leaderboard.previous}</span>
              </PaginationPrevious>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink isActive={true}>
                {currentPage}
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext
                onClick={handleNextPage}
                className={
                  currentPage === totalPages ? "pointer-events-none opacity-50" : ""
                }
              >
                <span className="sr-only">{t.leaderboard.next}</span>
                <ChevronRight className="h-4 w-4" />
              </PaginationNext>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};