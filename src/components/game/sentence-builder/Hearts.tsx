
import { Heart } from "lucide-react";

interface HeartsProps {
  lives: number;
}

export const Hearts = ({ lives }: HeartsProps) => {
  return (
    <div className="flex gap-2 items-center justify-center mb-4">
      {Array.from({ length: 3 }).map((_, index) => (
        <Heart
          key={index}
          className={`w-6 h-6 ${
            index < lives ? "text-red-500 fill-red-500" : "text-gray-300"
          }`}
        />
      ))}
    </div>
  );
};
