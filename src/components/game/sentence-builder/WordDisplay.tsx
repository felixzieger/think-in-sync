import { useEffect, useState } from "react";
import { useTranslation } from "@/hooks/useTranslation";

interface WordDisplayProps {
  currentWord: string;
}

export const WordDisplay = ({ currentWord }: WordDisplayProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const imagePath = `/think_in_sync_assets/${currentWord.toLowerCase()}.jpg`;
  const t = useTranslation();

  useEffect(() => {
    const img = new Image();
    img.onload = () => setImageLoaded(true);
    img.src = imagePath;
    console.log("Attempting to load image:", imagePath);
  }, [imagePath]);

  return (
    <div>
      <p className="mb-1 text-sm text-gray-600">
        {t.game.describeWord}
      </p>
      <div className="mb-6 overflow-hidden rounded-lg bg-secondary/10">
        {imageLoaded && (
          <img
            src={imagePath}
            alt={currentWord}
            className="mx-auto h-48 w-full object-cover"
          />
        )}
        <p className="p-4 text-2xl font-bold tracking-wider text-secondary">
          {currentWord}
        </p>
      </div>
    </div>
  );
};