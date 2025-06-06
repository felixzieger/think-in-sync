import { useTranslation } from "@/hooks/useTranslation";

interface LeaderboardHeaderProps {
  currentScore?: number;
  avgWordsPerRound?: number;
  showScoreInfo: boolean;
}

export const LeaderboardHeader = ({ currentScore, avgWordsPerRound, showScoreInfo }: LeaderboardHeaderProps) => {
  const t = useTranslation();

  return (
    <div className="text-center">
      <h2 className="text-2xl font-bold mb-2">{t.leaderboard.title}</h2>
      {showScoreInfo && currentScore !== undefined && (
        <p className="text-gray-600">
          {t.leaderboard.yourScore}: {currentScore} {t.leaderboard.roundCount}
          {currentScore > 0 &&
            avgWordsPerRound !== undefined &&
            ` (${avgWordsPerRound.toFixed(1)} ${t.leaderboard.wordsPerRound})`}
        </p>
      )}
    </div>
  );
};