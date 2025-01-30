import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useTranslation } from "@/hooks/useTranslation";
import { Copy } from "lucide-react";

interface GameReviewProps {
  currentScore: number;
  avgWordsPerRound: number;
  onPlayAgain: () => void;
  sessionId: string;
  currentTheme: string;
}

export const GameReview = ({
  currentScore,
  avgWordsPerRound,
  onPlayAgain,
  sessionId,
  currentTheme,
}: GameReviewProps) => {
  const t = useTranslation();
  const { toast } = useToast();

  const handleCopyUrl = async () => {
    try {
      const origin = window.location.origin;
      const shareUrl = `${origin}/start-game?from_session=${sessionId}`;
      
      await navigator.clipboard.writeText(shareUrl);
      toast({
        title: t.game.review.urlCopied,
        description: t.game.review.urlCopiedDesc,
        variant: "default",
      });
    } catch (error) {
      console.error('Error copying URL:', error);
      toast({
        title: t.game.review.urlCopyError,
        description: t.game.review.urlCopyErrorDesc,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">{t.game.review.title}</h2>
        <p className="text-gray-600 mb-2">
          {t.game.review.roundsPlayed}: {currentScore}
        </p>
        <p className="text-gray-600">
          {t.game.review.description}: {avgWordsPerRound.toFixed(1)}
        </p>
      </div>

      <div className="flex items-center gap-2">
        <Input
          readOnly
          value={`${window.location.origin}/start-game?from_session=${sessionId}`}
          className="flex-1"
        />
        <Button
          variant="outline"
          size="icon"
          onClick={handleCopyUrl}
          title={t.game.review.shareGame}
        >
          <Copy className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-2">
        <Button
          onClick={onPlayAgain}
          className="w-full"
          variant="default"
        >
          {t.game.review.playAgain}
        </Button>
      </div>
    </div>
  );
};