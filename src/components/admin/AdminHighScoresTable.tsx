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
      console.log("Fetching high scores with game results...");
      const { data, error } = await supabase
        .from("high_scores")
        .select(`
          *,
          game_results (
            target_word,
            description,
            ai_guess,
            is_correct
          )
        `)
        .order("score", { ascending: false });

      if (error) {
        console.error("Error fetching high scores:", error);
        throw error;
      }

      console.log("Fetched high scores with game results:", data);
      return data as HighScoreWithGames[];
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