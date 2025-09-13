import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Eye } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useTranslation } from "@/hooks/useTranslation";
import { GuessDescription } from "@/components/game/guess-display/GuessDescription";

interface GameResult {
  id: string;
  target_word: string;
  description: string;
  ai_guess: string;
  is_correct: boolean;
}

interface SentenceWord {
  word: string;
  provider: 'player' | 'ai';
}

interface ComparisonDialogProps {
  isOpen: boolean;
  onClose: () => void;
  currentResult: GameResult | null;
  friendResult: GameResult | null;
}

const ComparisonDialog = ({ isOpen, onClose, currentResult, friendResult }: ComparisonDialogProps) => {
  const t = useTranslation();

  const convertToSentenceWords = (description: string): SentenceWord[] => {
    return description.split(' ').map((word, index) => ({
      word,
      provider: index % 2 === 0 ? 'player' as const : 'ai' as const
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {currentResult?.target_word}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6 mt-4">
          <div>
            {friendResult && (
              <h3 className="font-semibold mb-2">{t.game.review.yourDescription}</h3>
            )}
            <GuessDescription
              sentence={currentResult?.description ? convertToSentenceWords(currentResult.description) : []}
            />
            <p className="text-sm text-gray-600 mt-2">
              {typeof t.guess.aiGuessedDescription === 'object' ? (
                <>
                  {t.guess.aiGuessedDescription.prefix} {t.guess.aiGuessedDescription.aiName} {t.guess.aiGuessedDescription.suffix}
                </>
              ) : (
                t.guess.aiGuessedDescription
              )}: <span className="font-medium">{currentResult?.ai_guess}</span>
            </p>
          </div>
          {friendResult && (
            <div>
              <h3 className="font-semibold mb-2">{t.game.review.friendDescription}</h3>
              <GuessDescription
                sentence={friendResult.description ? convertToSentenceWords(friendResult.description) : []}
              />
              <p className="text-sm text-gray-600 mt-2">
                {typeof t.guess.aiGuessedDescription === 'object' ? (
                  <>
                    {t.guess.aiGuessedDescription.prefix} {t.guess.aiGuessedDescription.aiName} {t.guess.aiGuessedDescription.suffix}
                  </>
                ) : (
                  t.guess.aiGuessedDescription
                )}: <span className="font-medium">{friendResult.ai_guess}</span>
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
        console.log('Friend results:', data);
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
    <div className="relative overflow-x-auto rounded-lg border border-border/50">
      <Table>
        <TableHeader className="bg-muted/50">
          <TableRow>
            <TableHead className="uppercase text-xs">{t.game.round}</TableHead>
            <TableHead className="uppercase text-xs">
              {friendResults.length > 0 ? t.game.review.yourWords : t.game.review.words}
            </TableHead>
            {friendResults.length > 0 && (
              <TableHead className="uppercase text-xs">{t.game.review.friendWords}</TableHead>
            )}
            <TableHead className="uppercase text-xs">
              <span className="sr-only">{t.game.review.details}</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {gameResults.map((result) => {
            const friendResult = getFriendResult(result.target_word);
            return (
              <TableRow
                key={result.id}
                className="cursor-pointer"
                onClick={() => setSelectedResult(result)}
              >
                <TableCell className="font-medium">{result.target_word}</TableCell>
                <TableCell>
                  {result.is_correct ? '✅' : '❌'} {getWordCount(result.description)}
                </TableCell>
                {friendResults.length > 0 && (
                  <TableCell>
                    {friendResult ? `${friendResult.is_correct ? '✅' : '❌'} ${getWordCount(friendResult.description)}` : '-'}
                  </TableCell>
                )}
                <TableCell>
                  <Eye className="h-4 w-4 text-muted-foreground" />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      <ComparisonDialog
        isOpen={!!selectedResult}
        onClose={() => setSelectedResult(null)}
        currentResult={selectedResult}
        friendResult={selectedResult ? getFriendResult(selectedResult.target_word) : null}
      />
    </div>
  );
};
