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
  return (
    <div className="mt-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Target Word</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>AI Guess</TableHead>
            <TableHead>Result</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {gameResults?.map((result, index) => (
            <TableRow key={index}>
              <TableCell>{result.target_word}</TableCell>
              <TableCell className="max-w-md break-words">
                {result.description}
              </TableCell>
              <TableCell>{result.ai_guess}</TableCell>
              <TableCell>
                {result.is_correct ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <X className="h-4 w-4 text-red-500" />
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};