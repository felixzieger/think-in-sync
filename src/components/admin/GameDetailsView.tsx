import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Check, X } from "lucide-react";

interface GameResult {
  target_word: string;
  description: string;
  ai_guess: string;
  is_correct: boolean;
}

interface GameDetailsViewProps {
  gameResults: GameResult[];
}

export const GameDetailsView = ({ gameResults }: GameDetailsViewProps) => {
  const correctResults = gameResults.filter((result) => result.is_correct);
  const correctResult = gameResults.find((result) => result.is_correct);

  if (correctResults.length === 0) {
    return null;
  }

  return (
    <div className="space-y-8">
      <div className="mt-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Target Word</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>AI Guess</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {gameResults.map((result, index) => (
              <TableRow key={index}>
                <TableCell>{result.target_word}</TableCell>
                <TableCell className="max-w-md break-words">
                  {result.description}
                </TableCell>
                <TableCell>{result.ai_guess}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="rounded-lg border p-4">
        <h3 className="font-semibold mb-2">Correct Answer</h3>
        <div className="space-y-2">
          <div><span className="font-medium">Target Word:</span> {correctResult?.target_word}</div>
          <div><span className="font-medium">Description:</span> {correctResult?.description}</div>
          <div><span className="font-medium">AI Guess:</span> {correctResult?.ai_guess}</div>
        </div>
      </div>
    </div>
  );
};