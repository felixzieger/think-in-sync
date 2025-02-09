
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useTranslation } from "@/hooks/useTranslation";
import { ExternalLink } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const StatsDialog = ({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) => {
  const t = useTranslation();

  const { data: todayResults } = useQuery({
    queryKey: ["game-results-today"],
    queryFn: async () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const { count } = await supabase
        .from("game_results")
        .select("*", { count: "exact" })
        .gte("created_at", today.toISOString());

      return count || 0;
    },
  });

  const { data: totalResults } = useQuery({
    queryKey: ["game-results-total"],
    queryFn: async () => {
      const { count } = await supabase
        .from("game_results")
        .select("*", { count: "exact" });

      return count || 0;
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-lg">{t.welcome.stats.title}</h3>
          </div>
          <div className="space-y-2">
            <p>
              {t.welcome.stats.dailyGuesses}: {todayResults || 0}
            </p>
            <p>
              {t.welcome.stats.totalGuesses}: {totalResults || 0}
            </p>
          </div>
          <div>
            <a
              href="https://plausible.sonnenhof-zieger.de/think-in-sync.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
            >
              {t.welcome.stats.visitDashboard}
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
