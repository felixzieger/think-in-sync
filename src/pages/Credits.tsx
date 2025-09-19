import { useEffect } from "react";
import { Link } from "react-router-dom";
import { CreditsContent } from "@/components/game/welcome/CreditsContent";

const Credits = () => {
  useEffect(() => {
    document.title = "Think in Sync – Credits";
  }, []);

  return (
    <main className="min-h-screen bg-slate-50 py-16 px-4">
      <div className="mx-auto flex w-full max-w-2xl flex-col items-center text-center">
        <h1 className="mb-6 text-4xl font-bold text-gray-900">Credits</h1>
        <CreditsContent />
        <div className="mt-10 text-sm text-gray-500">
          <Link to="/" className="text-primary hover:text-primary/80">Return to the game</Link>
        </div>
      </div>
    </main>
  );
};

export default Credits;
