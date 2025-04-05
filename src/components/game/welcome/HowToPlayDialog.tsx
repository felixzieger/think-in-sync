import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useTranslation } from "@/hooks/useTranslation";

interface HowToPlayDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const HowToPlayDialog = ({ open, onOpenChange }: HowToPlayDialogProps) => {
  const t = useTranslation();
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-primary">{t.welcome.howToPlay}</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div className="grid gap-4 text-gray-600">
            <div>
              <h3 className="font-medium text-gray-800">{t.howToPlay.setup.title}</h3>
              <p>{t.howToPlay.setup.description}</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-800">{t.howToPlay.goal.title}</h3>
              <p>{t.howToPlay.goal.description}</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-800">{t.howToPlay.rules.title}</h3>
              <ul className="list-disc list-inside space-y-1">
                {t.howToPlay.rules.items.map((rule, index) => (
                  <li key={index}>{rule}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-gray-800">{t.howToPlay.gameModes.title}</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>{t.howToPlay.gameModes.daily}</li>
                <li>{t.howToPlay.gameModes.custom}</li>
              </ul>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};