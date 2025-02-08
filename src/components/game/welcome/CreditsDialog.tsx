
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface CreditsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CreditsDialog = ({ open, onOpenChange }: CreditsDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <h2 className="text-2xl font-bold mb-4">Credits</h2>
        <div className="space-y-2 text-gray-600">
          <p>
            Made by M1X. We are{" "}
            <a href="https://www.linkedin.com/in/sandro-mikautadze/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Sandro</a>,{" "}
            <a href="https://www.linkedin.com/in/alessandro-pranzo/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Alessandro</a>,{" "}
            <a href="https://www.linkedin.com/in/mattia-martino-528363225/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Mattia</a>,{" "}
            <a href="https://www.linkedin.com/in/michael-sheroubi/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Michael</a>,{" "}
            <a href="https://www.linkedin.com/in/michael-sheroubi/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Emiliano</a>,{" "}
            and <a href="https://felixzieger.de/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Felix</a>.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};
