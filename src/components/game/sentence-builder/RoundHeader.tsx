import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/hooks/useTranslation";
import { ArrowLeft } from "lucide-react";

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
      <div className="w-full text-center">
        <h2 className="text-xl font-semibold">
          {t.game.round} {successfulRounds + 1}
        </h2>
      </div>

      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t.game.confirmExit}</AlertDialogTitle>
            <AlertDialogDescription>
              {t.game.confirmExitDescription}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={onCancel}>
              {t.common.cancel}
            </AlertDialogCancel>
            <AlertDialogAction onClick={onBack}>
              {t.common.confirm}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};