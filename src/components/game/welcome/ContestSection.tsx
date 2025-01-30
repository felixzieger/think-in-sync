import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Info } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

export const ContestSection = () => {
  const t = useTranslation();

  return (
    <div className="flex flex-col items-center gap-2">
      <p className="text-lg font-semibold text-primary">🕹️ {t.welcome.contest.prize} 🤑</p>
      <Dialog>
        <DialogTrigger asChild>
          <button className="inline-flex items-center text-sm text-primary/80 hover:text-primary">
            {t.welcome.contest.terms} <Info className="h-4 w-4 ml-1" />
          </button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{t.welcome.contest.terms}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">{t.welcome.contest.howTo}</p>
            <ul className="text-sm text-gray-600 list-disc list-inside">
              {t.welcome.contest.conditions.map((condition, index) => (
                <li key={index}>{condition}</li>
              ))}
            </ul>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};