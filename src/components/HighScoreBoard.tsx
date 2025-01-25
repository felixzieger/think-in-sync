import { useState } from "react";
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

export const HighScoreBoard = ({
  currentScore,
  avgWordsPerRound,
  onClose,
  onPlayAgain,
}: HighScoreBoardProps) => {
  const [playerName, setPlayerName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
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
    if (!playerName.trim()) {
      toast({
        title: "Error",
        description: "Please enter your name",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
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

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">High Scores</h2>
        <p className="text-gray-600">
          Your score: {currentScore} rounds
          {currentScore > 0 && ` (${avgWordsPerRound.toFixed(1)} words/round)`}
        </p>
      </div>

      <div className="flex gap-4 mb-6">
        <Input
          placeholder="Enter your name"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
          className="flex-1"
        />
        <Button
          onClick={handleSubmitScore}
          disabled={isSubmitting || !playerName.trim()}
        >
          {isSubmitting ? "Submitting..." : "Submit Score"}
        </Button>
      </div>

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
            {highScores?.map((score, index) => (
              <TableRow key={score.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{score.player_name}</TableCell>
                <TableCell>{score.score}</TableCell>
                <TableCell>{score.avg_words_per_round.toFixed(1)}</TableCell>
              </TableRow>
            ))}
            {!highScores?.length && (
              <TableRow>
                <TableCell colSpan={4} className="text-center">
                  No high scores yet. Be the first!
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-end gap-4">
        <Button variant="outline" onClick={onClose}>
          Close
        </Button>
        <Button onClick={onPlayAgain}>Play Again</Button>
      </div>
    </div>
  );
};