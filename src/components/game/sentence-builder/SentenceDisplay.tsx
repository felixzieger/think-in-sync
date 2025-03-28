import { motion } from "framer-motion";

interface SentenceWord {
  word: string;
  provider: 'player' | 'ai';
}

interface SentenceDisplayProps {
  sentence: SentenceWord[];
}

export const SentenceDisplay = ({ sentence }: SentenceDisplayProps) => {
  if (!sentence.length) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-4 text-left p-3 rounded-lg bg-gray-50"
    >
      <p className="text-gray-700">
        {sentence.map(w => w.word).join(" ")}
      </p>
    </motion.div>
  );
};