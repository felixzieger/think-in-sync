import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useTranslation } from "@/hooks/useTranslation";

interface HighScore {
  id: string;
  player_name: string;
  score: number;
  avg_words_per_round: number;
  created_at: string;
  session_id: string;
  theme: string;
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
              <TableHead>{t.leaderboard.themeColumn}</TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {scores?.map((score, index) => {
            const absoluteRank = startIndex + index + 1;
            const medal = getRankMedal(absoluteRank);
            return (
              <TableRow key={score.id}>
                <TableCell>{medal}</TableCell>
                <TableCell>{score.player_name}</TableCell>
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