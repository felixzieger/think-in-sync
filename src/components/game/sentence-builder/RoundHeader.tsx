import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
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
  totalRounds: number;
  wrongGuesses: number;
  guessSequence: Array<'success' | 'wrong'>;
  onBack?: () => void;
  showConfirmDialog: boolean;
  setShowConfirmDialog: (show: boolean) => void;
}

export const RoundHeader = ({
  successfulRounds,
  totalRounds,
  wrongGuesses,
  guessSequence,
  onBack,
  showConfirmDialog,
  setShowConfirmDialog,
}: RoundHeaderProps) => {
  const t = useTranslation();
  const currentRound = successfulRounds + wrongGuesses;
  const remainingRounds = totalRounds - currentRound;
  const isShortGame = totalRounds <= 10;

  const handleHomeClick = () => {
    console.log("RoundHeader: Home click", { successfulRounds, wrongGuesses });
    if (successfulRounds > 0 || wrongGuesses > 0) {
      setShowConfirmDialog(true);
    } else {
       console.log("RoundHeader: Navigating back without confirm");
      onBack?.();
    }
  };

  // Create an array of results in sequence for games with 10 or fewer words
  const results = Array(totalRounds).fill('pending').map((_, index) => {
    return guessSequence[index] || 'pending';
  });

  return (
    <div className="relative mb-2 min-h-[3rem]">
      <Button
        variant="ghost"
        size="icon"
        className="absolute left-0 top-0 z-10 text-gray-600 hover:text-white"
        onClick={handleHomeClick}
      >
        <Home className="h-5 w-5" />
      </Button>

      {isShortGame ? (
        <div className="flex justify-center items-center h-12">
          {results.map((result, index) => (
            <div
              key={index}
              className={`h-2.5 w-2.5 rounded-full transition-colors duration-300 mx-1 ${
                result === 'success' ? 'bg-green-500' :
                result === 'wrong' ? 'bg-red-500' :
                'bg-gray-300'
              }`}
            />
          ))}
        </div>
      ) : (
        <div className="absolute right-0 top-0 flex items-center gap-3 bg-primary/5 px-3 py-1.5 rounded-lg">
          <div className="flex items-center gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-green-500" />
            <span className="text-sm font-medium text-green-700">{successfulRounds}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-red-500" />
            <span className="text-sm font-medium text-red-700">{wrongGuesses}</span>
          </div>
        </div>
      )}

      {/* The dialog is controlled by parent (SentenceBuilder). Keep a lightweight copy here for screens that use RoundHeader standalone. */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t.game.leaveGameTitle}</AlertDialogTitle>
            <AlertDialogDescription>
              {t.game.leaveGameDescription}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowConfirmDialog(false)}>{t.game.cancel}</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                console.log("RoundHeader: Confirm back clicked");
                onBack?.();
              }}
            >
              {t.game.confirm}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
