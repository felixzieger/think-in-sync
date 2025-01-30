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
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};