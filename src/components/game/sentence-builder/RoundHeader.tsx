import { House } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/hooks/useTranslation";

interface RoundHeaderProps {
  successfulRounds: number;
  onBack?: () => void;  // Changed from goToWelcomeScreen to onBack for consistency
  showConfirmDialog: boolean;
  setShowConfirmDialog: (show: boolean) => void;
}

export const RoundHeader = ({ 
  successfulRounds, 
  onBack,
  showConfirmDialog,
  setShowConfirmDialog
}: RoundHeaderProps) => {
  const t = useTranslation();

  const handleHomeClick = () => {
    console.log("Home button clicked, successful rounds:", successfulRounds);
    if (successfulRounds > 0) {
      setShowConfirmDialog(true);
    } else {
      console.log("No successful rounds, navigating directly");
      onBack?.();
    }
  };

  return (
    <div className="relative">
      <div className="absolute right-0 top-0 bg-primary/10 px-3 py-1 rounded-lg">
        <span className="text-sm font-medium text-primary">
          {t.game.round} {successfulRounds + 1}
        </span>
      </div>

      <Button
        variant="ghost"
        size="icon"
        className="absolute left-0 top-0 text-gray-600 hover:text-primary"
        onClick={handleHomeClick}
      >
        <House className="h-5 w-5" />
      </Button>

      <h2 className="mb-4 text-2xl font-semibold text-gray-900">
        Think in Sync
      </h2>
    </div>
  );
};