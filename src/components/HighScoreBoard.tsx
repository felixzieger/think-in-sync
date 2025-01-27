import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
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

interface HighScore {
  id: string;
  player_name: string;
  score: number;
  avg_words_per_round: number;
  created_at: string;
}

interface HighScoreBoardProps {
  currentScore: number;
  avgWordsPerRound: number;
  onClose: () => void;
  onPlayAgain: () => void;
}

const ITEMS_PER_PAGE = 5;
const MAX_PAGES = 4;

const getRankMedal = (rank: number) => {
  switch (rank) {
    case 1:
      return "🥇";
    case 2:
      return "🥈";
    case 3:
      return "🥉";
    default:
      return null;
  }
};

export const HighScoreBoard = ({
  currentScore,
  avgWordsPerRound,
  onClose,
}: HighScoreBoardProps) => {
  const [playerName, setPlayerName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const { toast } = useToast();

  const { data: highScores, refetch } = useQuery({
    queryKey: ["highScores"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("high_scores")
        .select("*")
        .order("score", { ascending: false })
        .order("avg_words_per_round", { ascending: true });

      if (error) throw error;
      return data as HighScore[];
    },
  });

  const handleSubmitScore = async () => {
    // Validate player name (only alphanumeric characters allowed)
    if (!playerName.trim() || !/^[a-zA-Z0-9]+$/.test(playerName.trim())) {
      toast({
        title: "Error",
        description: "Please enter a valid name (only letters and numbers allowed)",
        variant: "destructive",
      });
      return;
    }

    if (currentScore < 1) {
      toast({
        title: "Error",
        description: "You need to complete at least one round to submit a score",
        variant: "destructive",
      });
      return;
    }

    if (hasSubmitted) {
      toast({
        title: "Error",
        description: "You have already submitted your score for this game",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Check if player already exists
      const { data: existingScores } = await supabase
        .from("high_scores")
        .select("*")
        .eq("player_name", playerName.trim());

      const existingScore = existingScores?.[0];

      if (existingScore) {
        // Only update if the new score is better
        if (currentScore > existingScore.score) {
          const { error } = await supabase
            .from("high_scores")
            .update({
              score: currentScore,
              avg_words_per_round: avgWordsPerRound,
            })
            .eq("id", existingScore.id);

          if (error) throw error;

          toast({
            title: "New High Score!",
            description: `You beat your previous record of ${existingScore.score} rounds!`,
          });
        } else {
          toast({
            title: "Score Not Updated",
            description: `Your current score (${currentScore}) is not higher than your best score (${existingScore.score})`,
            variant: "destructive",
          });
          setIsSubmitting(false);
          return;
        }
      } else {
        // Insert new score
        const { error } = await supabase.from("high_scores").insert({
          player_name: playerName.trim(),
          score: currentScore,
          avg_words_per_round: avgWordsPerRound,
        });

        if (error) throw error;

        toast({
          title: "Success!",
          description: "Your score has been recorded",
        });
      }
      
      setHasSubmitted(true);
      await refetch();
      setPlayerName("");
    } catch (error) {
      console.error("Error submitting score:", error);
      toast({
        title: "Error",
        description: "Failed to submit score. Please try again.",
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

  const totalPages = highScores ? Math.min(Math.ceil(highScores.length / ITEMS_PER_PAGE), MAX_PAGES) : 0;
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
        <h2 className="text-2xl font-bold mb-2">Leaderboard</h2>
        <p className="text-gray-600">
          Your score: {currentScore} rounds
          {currentScore > 0 && ` (${avgWordsPerRound.toFixed(1)} words/round)`}
        </p>
      </div>

      {!hasSubmitted && currentScore > 0 && (
        <div className="flex gap-4 mb-6">
          <Input
            placeholder="Enter your name (letters and numbers only)"
            value={playerName}
            onChange={(e) => {
              // Only allow alphanumeric input
              const value = e.target.value.replace(/[^a-zA-Z0-9]/g, '');
              setPlayerName(value);
            }}
            onKeyDown={handleKeyDown}
            className="flex-1"
            maxLength={20}
          />
          <Button
            onClick={handleSubmitScore}
            disabled={isSubmitting || !playerName.trim() || hasSubmitted}
          >
            {isSubmitting ? "Submitting..." : "Submit Score"}
          </Button>
        </div>
      )}

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Rank</TableHead>
              <TableHead>Player</TableHead>
              <TableHead>Rounds</TableHead>
              <TableHead>Avg Words/Round</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedScores?.map((score, index) => {
              const absoluteRank = startIndex + index + 1;
              const medal = getRankMedal(absoluteRank);
              return (
                <TableRow key={score.id}>
                  <TableCell>
                    {absoluteRank}
                    {medal && <span className="ml-2">{medal}</span>}
                  </TableCell>
                  <TableCell>{score.player_name}</TableCell>
                  <TableCell>{score.score}</TableCell>
                  <TableCell>{score.avg_words_per_round.toFixed(1)}</TableCell>
                </TableRow>
              );
            })}
            {!paginatedScores?.length && (
              <TableRow>
                <TableCell colSpan={4} className="text-center">
                  No high scores yet. Be the first!
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
                <span className="hidden sm:inline">Previous</span>
                <span className="text-xs text-muted-foreground ml-1">←</span>
              </PaginationPrevious>
            </PaginationItem>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <PaginationItem key={page}>
                <PaginationLink
                  onClick={() => setCurrentPage(page)}
                  isActive={currentPage === page}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                onClick={handleNextPage}
                className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
              >
                <span className="hidden sm:inline">Next</span>
                <span className="text-xs text-muted-foreground ml-1">→</span>
              </PaginationNext>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};
