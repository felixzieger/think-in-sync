import { motion } from "framer-motion";

interface SentenceDisplayProps {
  sentence: string[];
}

export const SentenceDisplay = ({ sentence }: SentenceDisplayProps) => {
  if (!sentence.length) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-4 text-left p-3 rounded-lg bg-gray-50"
    >
      <p className="text-gray-700 flex flex-wrap gap-1">
        {sentence.map((word, index) => (
          <span
            key={index}
            className={`inline-block ${
              index % 2 === 0
                ? "border-b-2 border-blue-500" // Player words (even indices)
                : "border-b-2 border-green-500" // AI words (odd indices)
            }`}
          >
            {word}
          </span>
        ))}
      </p>
    </motion.div>
  );
};