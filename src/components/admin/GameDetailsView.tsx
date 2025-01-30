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
  const inCorrectResult = gameResults.find((result) => !result.is_correct);

  if (correctResults.length === 0) {
    return null;
  }

  return (
    <div className="space-y-8">
      <div className="mt-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Description</TableHead>
              <TableHead>Word</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {correctResults.map((result, index) => (
              <TableRow key={index}>
                <TableCell>{result.target_word}</TableCell>
                <TableCell className="max-w-md break-words">
                  {result.description}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="rounded-lg border p-4">
        <h3 className="font-semibold mb-2">You failed at</h3>
        <div className="space-y-2">
          <div><span className="font-medium">Target Word:</span> {inCorrectResult?.target_word}</div>
          <div><span className="font-medium">Description:</span> {inCorrectResult?.description}</div>
          <div><span className="font-medium">AI Guess:</span> {inCorrectResult?.ai_guess}</div>
        </div>
      </div>
    </div>
  );
};