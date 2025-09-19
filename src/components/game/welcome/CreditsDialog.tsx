import { Dialog, DialogContent } from "@/components/ui/dialog";
import { CreditsContent } from "./CreditsContent";

interface CreditsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CreditsDialog = ({ open, onOpenChange }: CreditsDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <h2 className="text-2xl font-bold mb-4">Credits</h2>
        <CreditsContent />
      </DialogContent>
    </Dialog>
  );
};
