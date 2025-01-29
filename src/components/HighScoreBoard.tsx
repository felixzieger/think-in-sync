import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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

interface HighScore {
  id: string;
  player_name: string;
  score: number;
  avg_words_per_round: number;
  created_at: string;
  session_id: string;
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

const getRankMedal = (rank: number) => {
  switch (rank) {
    case 1:
      return "🥇";
    case 2:
      return "🥈";
    case 3:
      return "🥉";
    default:
      return rank;
  }
};

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
  const { toast } = useToast();
  const t = useTranslation();
  const queryClient = useQueryClient();

  const showScoreInfo = sessionId !== "" && currentScore >= 0;

  const { data: highScores, refetch } = useQuery({
    queryKey: ["highScores"],
    queryFn: async () => {
      console.log("Fetching high scores...");
      const { data, error } = await supabase
        .from("high_scores")
        .select("*")
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
          sessionId
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

  const renderPaginationItems = () => {
    return [
      <PaginationItem key="current">
        <PaginationLink isActive={true}>
          {currentPage}
        </PaginationLink>
      </PaginationItem>
    ];
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        handlePreviousPage();
      } else if (e.key === 'ArrowRight') {
        handleNextPage();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentPage, totalPages]);

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

      {!hasSubmitted && currentScore > 0 && (
        <div className="flex gap-4 mb-6">
          <Input
            placeholder={t.leaderboard.enterName}
            value={playerName}
            onChange={(e) => {
              const value = e.target.value.replace(/[^a-zA-ZÀ-ÿ0-9]/g, "");
              setPlayerName(value);
            }}
            onKeyDown={handleKeyDown}
            className="flex-1"
            maxLength={20}
            autoComplete="words"
          />
          <Button
            onClick={handleSubmitScore}
            disabled={isSubmitting || !playerName.trim() || hasSubmitted}
          >
            {isSubmitting ? t.leaderboard.submitting : t.leaderboard.submit}
          </Button>
        </div>
      )}

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t.leaderboard.rank}</TableHead>
              <TableHead>{t.leaderboard.player}</TableHead>
              <TableHead>{t.leaderboard.roundsColumn}</TableHead>
              <TableHead>{t.leaderboard.avgWords}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedScores?.map((score, index) => {
              const absoluteRank = startIndex + index + 1;
              const medal = getRankMedal(absoluteRank);
              return (
                <TableRow key={score.id}>
                  <TableCell>{medal}</TableCell>
                  <TableCell>{score.player_name}</TableCell>
                  <TableCell>{score.score}</TableCell>
                  <TableCell>{score.avg_words_per_round.toFixed(1)}</TableCell>
                </TableRow>
              );
            })}
            {!paginatedScores?.length && (
              <TableRow>
                <TableCell colSpan={4} className="text-center">
                  {t.leaderboard.noScores}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

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
            {renderPaginationItems()}
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
