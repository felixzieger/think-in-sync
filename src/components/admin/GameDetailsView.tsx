import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Eye } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useTranslation } from "@/hooks/useTranslation";

interface GameResult {
  id: string;
  target_word: string;
  description: string;
  ai_guess: string;
  is_correct: boolean;
}

interface ComparisonDialogProps {
  isOpen: boolean;
  onClose: () => void;
  currentResult: GameResult | null;
  friendResult: GameResult | null;
}

const ComparisonDialog = ({ isOpen, onClose, currentResult, friendResult }: ComparisonDialogProps) => {
  const t = useTranslation();
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {currentResult?.target_word}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          <div>
            <h3 className="font-semibold mb-2">{t.game.review.yourDescription}</h3>
            <p className="text-sm text-gray-600">{currentResult?.description}</p>
            <p className="text-sm mt-1">
              {t.game.review.aiGuessed}: <span className="font-medium">{currentResult?.ai_guess}</span>
            </p>
          </div>
          {friendResult && (
            <div>
              <h3 className="font-semibold mb-2">{t.game.review.friendDescription}</h3>
              <p className="text-sm text-gray-600">{friendResult.description}</p>
              <p className="text-sm mt-1">
                {t.game.review.aiGuessed}: <span className="font-medium">{friendResult.ai_guess}</span>
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export const GameDetailsView = ({ gameResults = [], fromSession }: { gameResults: GameResult[], fromSession?: string | null }) => {
  const [friendResults, setFriendResults] = useState<GameResult[]>([]);
  const [selectedResult, setSelectedResult] = useState<GameResult | null>(null);
  const t = useTranslation();

  useEffect(() => {
    const fetchFriendResults = async () => {
      if (!fromSession) return;

      const { data, error } = await supabase
        .from('game_results')
        .select('*')
        .eq('session_id', fromSession)
        .order('created_at', { ascending: true });

      if (!error && data) {
        setFriendResults(data);
      }
    };

    fetchFriendResults();
  }, [fromSession]);

  const getFriendResult = (targetWord: string) => {
    return friendResults.find(r => r.target_word === targetWord) || null;
  };

  const getWordCount = (description?: string) => {
    return description?.split(' ').length || 0;
  };

  return (
    <div className="relative overflow-x-auto rounded-lg border">
      <table className="w-full text-sm text-left">
        <thead className="text-xs uppercase bg-gray-50">
          <tr>
            <th className="px-6 py-3">
              {t.game.review.word}
            </th>
            <th className="px-6 py-3">
              {t.game.review.yourWords}
            </th>
            {fromSession && (
              <th className="px-6 py-3">
                {t.game.review.friendWords}
              </th>
            )}
            <th className="px-6 py-3">
              {t.game.review.result}
            </th>
            <th className="px-6 py-3">
              <span className="sr-only">{t.game.review.details}</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {gameResults.map((result) => {
            const friendResult = getFriendResult(result.target_word);
            return (
              <tr
                key={result.id}
                className="bg-white border-b hover:bg-gray-50 cursor-pointer"
                onClick={() => setSelectedResult(result)}
              >
                <td className="px-6 py-4 font-medium">
                  {result.target_word}
                </td>
                <td className="px-6 py-4">
                  {getWordCount(result.description)}
                </td>
                {fromSession && (
                  <td className="px-6 py-4">
                    {friendResult ? getWordCount(friendResult.description) : '-'}
                  </td>
                )}
                <td className="px-6 py-4">
                  {result.is_correct ? '✅' : '❌'}
                </td>
                <td className="px-6 py-4">
                  <Eye className="h-4 w-4 text-gray-500" />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <ComparisonDialog
        isOpen={!!selectedResult}
        onClose={() => setSelectedResult(null)}
        currentResult={selectedResult}
        friendResult={selectedResult ? getFriendResult(selectedResult.target_word) : null}
      />
    </div>
  );
};