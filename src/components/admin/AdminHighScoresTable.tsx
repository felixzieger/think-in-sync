import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Eye } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { GameDetailsView } from "./GameDetailsView";

interface HighScoreWithGames {
  id: string;
  player_name: string;
  score: number;
  avg_words_per_round: number;
  created_at: string;
  session_id: string;
  theme: string;
  game_results: {
    target_word: string;
    description: string;
    ai_guess: string;
    is_correct: boolean;
  }[];
}

export const AdminHighScoresTable = () => {
  const { data: highScores, isLoading } = useQuery({
    queryKey: ["adminHighScores"],
    queryFn: async () => {
      console.log("Fetching high scores...");
      // First fetch high scores
      const { data: highScoresData, error: highScoresError } = await supabase
        .from("high_scores")
        .select("*")
        .order("score", { ascending: false });

      if (highScoresError) {
        console.error("Error fetching high scores:", highScoresError);
        throw highScoresError;
      }

      // Then fetch game results for each high score
      const highScoresWithGames = await Promise.all(
        highScoresData.map(async (score) => {
          const { data: gameResults, error: gameResultsError } = await supabase
            .from("game_results")
            .select("target_word, description, ai_guess, is_correct")
            .eq("session_id", score.session_id);

          if (gameResultsError) {
            console.error("Error fetching game results:", gameResultsError);
            return {
              ...score,
              game_results: [],
            };
          }

          return {
            ...score,
            game_results: gameResults || [],
          };
        })
      );

      console.log("Fetched high scores with game results:", highScoresWithGames);
      return highScoresWithGames as HighScoreWithGames[];
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Player</TableHead>
            <TableHead>Score</TableHead>
            <TableHead>Avg Words/Round</TableHead>
            <TableHead>Theme</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Details</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {highScores?.map((score) => (
            <TableRow key={score.id}>
              <TableCell>{score.player_name}</TableCell>
              <TableCell>{score.score}</TableCell>
              <TableCell>{score.avg_words_per_round.toFixed(1)}</TableCell>
              <TableCell>{score.theme}</TableCell>
              <TableCell>
                {new Date(score.created_at).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <Dialog>
                  <DialogTrigger>
                    <Eye className="h-4 w-4" />
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Game Details for {score.player_name}</DialogTitle>
                    </DialogHeader>
                    <GameDetailsView gameResults={score.game_results} />
                  </DialogContent>
                </Dialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};