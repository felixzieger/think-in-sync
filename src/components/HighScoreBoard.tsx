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
  const t = useTranslation();
  const queryClient = useQueryClient();

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
    // Updated regex to allow letters with diacritics and special characters
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
      console.log("Checking existing score for player:", playerName.trim());
      const { data: existingScores, error: fetchError } = await supabase
        .from("high_scores")
        .select("*")
        .eq("player_name", playerName.trim());

      if (fetchError) {
        console.error("Error fetching existing scores:", fetchError);
        throw fetchError;
      }

      const existingScore = existingScores?.[0];
      console.log("Existing score found:", existingScore);

      if (existingScore) {
        if (currentScore > existingScore.score) {
          console.log("Updating existing score...");
          const { error: updateError } = await supabase
            .from("high_scores")
            .update({
              score: currentScore,
              avg_words_per_round: avgWordsPerRound,
            })
            .eq("id", existingScore.id);

          if (updateError) {
            console.error("Error updating score:", updateError);
            throw updateError;
          }

          toast({
            title: t.leaderboard.error.newHighScore,
            description: t.leaderboard.error.beatRecord.replace(
              "{score}",
              String(existingScore.score)
            ),
          });
          
          console.log("Score updated successfully");
          await queryClient.invalidateQueries({ queryKey: ["highScores"] });
        } else {
          toast({
            title: t.leaderboard.error.notHigher
              .replace("{current}", String(currentScore))
              .replace("{best}", String(existingScore.score)),
            variant: "destructive",
          });
          setIsSubmitting(false);
          return;
        }
      } else {
        console.log("Inserting new score...");
        const { error: insertError } = await supabase.from("high_scores").insert({
          player_name: playerName.trim(),
          score: currentScore,
          avg_words_per_round: avgWordsPerRound,
        });

        if (insertError) {
          console.error("Error inserting score:", insertError);
          throw insertError;
        }
        
        console.log("New score inserted successfully");
        await queryClient.invalidateQueries({ queryKey: ["highScores"] });
      }

      setHasSubmitted(true);
      setPlayerName("");
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
        <h2 className="text-2xl font-bold mb-2">{t.leaderboard.title}</h2>
        <p className="text-gray-600">
          {t.leaderboard.yourScore}: {currentScore} {t.leaderboard.roundCount}
          {currentScore > 0 &&
            ` (${avgWordsPerRound.toFixed(1)} ${t.leaderboard.wordsPerRound})`}
        </p>
      </div>

      {!hasSubmitted && currentScore > 0 && (
        <div className="flex gap-4 mb-6">
          <Input
            placeholder={t.leaderboard.enterName}
            value={playerName}
            onChange={(e) => {
              // Allow letters with diacritics and numbers
              const value = e.target.value.replace(/[^a-zA-ZÀ-ÿ0-9]/g, "");
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
                <span className="hidden sm:inline">{t.leaderboard.previous}</span>
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
                className={
                  currentPage === totalPages ? "pointer-events-none opacity-50" : ""
                }
              >
                <span className="hidden sm:inline">{t.leaderboard.next}</span>
                <span className="text-xs text-muted-foreground ml-1">→</span>
              </PaginationNext>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};
