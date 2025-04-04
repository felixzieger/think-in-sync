import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Github } from "lucide-react";

interface CreditsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CreditsDialog = ({ open, onOpenChange }: CreditsDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <h2 className="text-2xl font-bold mb-4">Credits</h2>
        <div className="space-y-4 text-gray-600">
          <p>
            Made by M1X. We are{" "}
            <a href="https://www.linkedin.com/in/sandro-mikautadze/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Sandro</a>,{" "}
            <a href="https://www.linkedin.com/in/alessandro-pranzo/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Alessandro</a>,{" "}
            <a href="https://www.linkedin.com/in/mattia-martino-528363225/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Mattia</a>,{" "}
            <a href="https://www.linkedin.com/in/michael-sheroubi/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Michael</a>,{" "}
            <a href="https://www.linkedin.com/in/michael-sheroubi/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Emiliano</a>,{" "}
            and <a href="https://felixzieger.de/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Felix</a>.
          </p>
          <div className="flex items-center justify-center pt-2">
            <a
              href="https://github.com/felixzieger/think-in-sync/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
            >
              <Github className="w-5 h-5" />
              <span>View source on GitHub</span>
            </a>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
