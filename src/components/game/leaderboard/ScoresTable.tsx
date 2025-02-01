import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useTranslation } from "@/hooks/useTranslation";
import { Flag } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface HighScore {
  id: string;
  player_name: string;
  score: number;
  avg_words_per_round: number;
  created_at: string;
  session_id: string;
  theme: string;
  game?: {
    language: string;
  };
}

interface ScoresTableProps {
  scores: HighScore[];
  startIndex: number;
  showThemeColumn?: boolean;
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

const getLanguageColor = (language: string) => {
  switch (language) {
    case 'en':
      return '#ff0000'; // Red for English
    case 'de':
      return '#000000'; // Black for German
    case 'fr':
      return '#0000ff'; // Blue for French
    case 'it':
      return '#00ff00'; // Green for Italian
    case 'es':
      return '#ffff00'; // Yellow for Spanish
    default:
      return '#808080'; // Gray for unknown
  }
};

const getLanguageName = (language: string) => {
  switch (language) {
    case 'en':
      return 'English';
    case 'de':
      return 'German';
    case 'fr':
      return 'French';
    case 'it':
      return 'Italian';
    case 'es':
      return 'Spanish';
    default:
      return 'Unknown';
  }
};

export const ScoresTable = ({ scores, startIndex, showThemeColumn = false }: ScoresTableProps) => {
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
            {showThemeColumn && (
              <TableHead>{t.leaderboard.theme}</TableHead>
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
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Flag 
                          size={16} 
                          color={getLanguageColor(language)}
                          className="inline-block ml-2"
                        />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{getLanguageName(language)}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TableCell>
                <TableCell>{score.score}</TableCell>
                <TableCell>{score.avg_words_per_round.toFixed(1)}</TableCell>
                {showThemeColumn && (
                  <TableCell className="capitalize">{score.theme}</TableCell>
                )}
              </TableRow>
            );
          })}
          {!scores?.length && (
            <TableRow>
              <TableCell colSpan={showThemeColumn ? 5 : 4} className="text-center">
                {t.leaderboard.noScores}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};