import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/hooks/useTranslation";
import { ArrowLeft, Home } from "lucide-react";

interface RoundHeaderProps {
  successfulRounds: number;
  onBack?: () => void;
  showConfirmDialog: boolean;
  setShowConfirmDialog: (show: boolean) => void;
  onCancel: () => void;
}

export const RoundHeader = ({
  successfulRounds,
  onBack,
  showConfirmDialog,
  setShowConfirmDialog,
  onCancel
}: RoundHeaderProps) => {
  const t = useTranslation();

  return (
    <div className="flex items-center justify-between mb-4">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setShowConfirmDialog(true)}
        className="absolute left-0 top-0"
      >
        <ArrowLeft className="h-4 w-4" />
      </Button>

      <div className="flex items-center gap-2 absolute right-0 top-0">
        <span className="text-sm font-medium">
          {t.game.round} {successfulRounds + 1}
        </span>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setShowConfirmDialog(true)}
        >
          <Home className="h-4 w-4" />
        </Button>
      </div>

      <div className="w-full text-center">
        <h2 className="text-xl font-semibold">
          Think in Sync
        </h2>
      </div>

      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t.game.leaveGameTitle}</AlertDialogTitle>
            <AlertDialogDescription>
              {t.game.leaveGameDescription}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={onCancel}>
              {t.game.cancel}
            </AlertDialogCancel>
            <AlertDialogAction onClick={onBack}>
              {t.game.confirm}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};