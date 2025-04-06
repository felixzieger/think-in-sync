import { useEffect, useState } from "react";
import { useTranslation } from "@/hooks/useTranslation";

interface WordDisplayProps {
  currentWord: string;
}

export const WordDisplay = ({ currentWord }: WordDisplayProps) => {
  const t = useTranslation();

  return (
    <div>
      <p className="mb-1 text-sm text-gray-600">
        {t.game.describeWord}
      </p>
      <div className="mb-6 overflow-hidden rounded-lg bg-secondary/10">
        <p className="p-4 text-2xl font-bold tracking-wider text-secondary">
          {currentWord}
        </p>
      </div>
    </div>
  );
};