import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useTranslation } from "@/hooks/useTranslation";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";

interface HighScore {
  id: string;
  player_name: string;
  score: number;
  avg_words_per_round: number;
  created_at: string;
  session_id: string;
  game?: {
    language: string;
  };
  game_id?: string;
}

interface ScoresTableProps {
  scores: HighScore[];
  startIndex: number;
  showThemeColumn?: boolean;
  onPlayGame?: (gameId: string) => void;
  selectedMode?: 'daily' | 'all-time';
}

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

const getLanguageEmoji = (language: string) => {
  switch (language) {
    case 'en':
      return '🇬🇧';
    case 'de':
      return '🇩🇪';
    case 'fr':
      return '🇫🇷';
    case 'it':
      return '🇮🇹';
    case 'es':
      return '🇪🇸';
    default:
      return '🌐';
  }
};

export const ScoresTable = ({ 
  scores, 
  startIndex, 
  showThemeColumn = false,
  onPlayGame,
  selectedMode = 'daily'
}: ScoresTableProps) => {
  const t = useTranslation();

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t.leaderboard.rank}</TableHead>
            <TableHead>{t.leaderboard.player}</TableHead>
            <TableHead>{t.leaderboard.roundsColumn}</TableHead>
            <TableHead>{t.leaderboard.avgWords}</TableHead>
            {selectedMode === 'all-time' && (
              <TableHead className="text-right">{t.leaderboard.actions}</TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {scores?.map((score, index) => {
            const absoluteRank = startIndex + index + 1;
            const medal = getRankMedal(absoluteRank);
            const language = score.game?.language || 'en';
            return (
              <TableRow key={score.id}>
                <TableCell>{medal}</TableCell>
                <TableCell className="flex items-center gap-2">
                  {score.player_name}
                  <span className="ml-2">{getLanguageEmoji(language)}</span>
                </TableCell>
                <TableCell>{score.score}</TableCell>
                <TableCell>{score.avg_words_per_round.toFixed(1)}</TableCell>
                {selectedMode === 'all-time' && (
                  <TableCell className="text-right">
                    {score.game_id && onPlayGame && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onPlayGame(score.game_id!)}
                        className="gap-2"
                      >
                        <Play className="h-4 w-4" />
                        {t.leaderboard.playSameWords}
                      </Button>
                    )}
                  </TableCell>
                )}
              </TableRow>
            );
          })}
          {!scores?.length && (
            <TableRow>
              <TableCell colSpan={5} className="text-center">
                {t.leaderboard.noScores}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};