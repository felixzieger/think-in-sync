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
  language?: string;
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

const getLanguageFlag = (language: string = 'en') => {
  const flags: { [key: string]: string } = {
    en: '🇬🇧',
    fr: '🇫🇷',
    de: '🇩🇪',
    it: '🇮🇹',
    es: '🇪🇸'
  };
  return flags[language] || flags.en;
};

export const ScoresTable = ({ scores, startIndex }: ScoresTableProps) => {
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
            <TableHead>{t.leaderboard.language}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {scores?.map((score, index) => {
            const absoluteRank = startIndex + index + 1;
            const medal = getRankMedal(absoluteRank);
            return (
              <TableRow key={score.id}>
                <TableCell>{medal}</TableCell>
                <TableCell>{score.player_nameI'll help modify the ScoresTable component to show language flags instead of the theme column. We'll use the Lucide React flag icon with different colors to represent different languages.

<lov-code>
Let's update the ScoresTable component to show language flags:

<lov-write file_path="src/components/game/leaderboard/ScoresTable.tsx">
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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface HighScore {
  id: string;
  player_name: string;
  score: number;
  avg_words_per_round: number;
  created_at: string;
  session_id: string;
  theme: string;
  language?: string;
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

const getLanguageColor = (language: string = 'en') => {
  switch (language) {
    case 'en':
      return 'text-blue-500';
    case 'de':
      return 'text-yellow-500';
    case 'fr':
      return 'text-red-500';
    case 'it':
      return 'text-green-500';
    case 'es':
      return 'text-orange-500';
    default:
      return 'text-gray-500';
  }
};

const getLanguageName = (language: string = 'en') => {
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

export const ScoresTable = ({ scores, startIndex }: ScoresTableProps) => {
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
            <TableHead className="w-8">Lang</TableHead>
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
                <TableCell>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Flag className={`h-4 w-4 ${getLanguageColor(score.language)}`} />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{getLanguageName(score.language)}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TableCell>
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