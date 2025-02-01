import { House } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/hooks/useTranslation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface RoundHeaderProps {
  successfulRounds: number;
  onBack?: () => void;
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
    console.log("RoundHeader - Home button clicked, successful rounds:", successfulRounds);
    if (successfulRounds > 0) {
      console.log("RoundHeader - Setting showConfirmDialog to true");
      setShowConfirmDialog(true);
    } else {
      console.log("RoundHeader - No successful rounds, navigating directly");
      onBack?.();
    }
  };

  const handleDialogChange = (open: boolean) => {
    console.log("RoundHeader - Dialog state changing to:", open);
    setShowConfirmDialog(open);
    if (!open) {  // Dialog is closing
      console.log("RoundHeader - Dialog closing, triggering navigation");
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
        className="absolute left-0 top-0 text-gray-600 hover:text-white"
        onClick={handleHomeClick}
      >
        <House className="h-5 w-5" />
      </Button>

      <h2 className="mb-4 text-2xl font-semibold text-gray-900">
        {t.game.title}
      </h2>

      <AlertDialog open={showConfirmDialog} onOpenChange={handleDialogChange}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t.game.leaveGameTitle}</AlertDialogTitle>
            <AlertDialogDescription>
              {t.game.leaveGameDescription}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowConfirmDialog(false)}>{t.game.cancel}</AlertDialogCancel>
            <AlertDialogAction>{t.game.confirm}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
