
import { House, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/hooks/useTranslation";

interface RoundHeaderProps {
  successfulRounds: number;
  onBack?: () => void;
  showConfirmDialog: boolean;
  setShowConfirmDialog: (show: boolean) => void;
  onCancel?: () => void;
  lives: number;
}

export const RoundHeader = ({
  successfulRounds,
  onBack,
  showConfirmDialog,
  setShowConfirmDialog,
  onCancel,
  lives
}: RoundHeaderProps) => {
  const t = useTranslation();

  const handleHomeClick = () => {
    console.log("RoundHeader - Home button clicked, successful rounds:", successfulRounds);
    if (successfulRounds > 0) {
      console.log("RoundHeader - Setting showConfirmDialog to true");
      setShowConfirmDialog(true);
    } else {
      console.log("RoundHeader - No successful rounds, navigating directly");
      onBack?.();
    }
  };

  return (
    <div className="relative">
      {lives > 0 && (
        <div className="absolute right-0 top-0 bg-primary/10 px-3 py-1 rounded-lg flex items-center gap-2">
          <span className="text-sm font-medium text-primary">
            {t.game.round} {successfulRounds + 1}
          </span>
          <span className="text-sm font-medium text-primary">|</span>
          <div className="flex items-center gap-1">
            <span className="text-sm font-medium text-primary">{lives}x</span>
            <Heart className="h-4 w-4 text-primary" />
          </div>
        </div>
      )}

      <Button
        variant="ghost"
        size="icon"
        className="absolute left-0 top-0 text-gray-600 hover:text-white"
        onClick={handleHomeClick}
      >
        <House className="h-5 w-5" />
      </Button>

      <h2 className="mb-4 text-2xl font-semibold text-gray-900">
        {t.game.title}
      </h2>
    </div>
  );
};
