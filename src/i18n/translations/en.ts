import { Language } from './types';

export const en = {
  leaderboard: {
    title: "High Scores",
    titleGame: "Game High Scores",
    yourScore: "Your score",
    roundCount: "rounds",
    wordsPerRound: "words per round",
    enterName: "Enter your name",
    submitting: "Submitting...",
    submit: "Submit Score",
    rank: "Rank",
    player: "Player",
    roundsColumn: "Rounds",
    avgWords: "Avg. Words",
    themeColumn: "Theme",
    success: "Score submitted successfully!",
    error: {
      invalidName: "Please enter a valid name (letters, numbers, and hyphens only)",
      noRounds: "You need to complete at least one round to submit a score",
      alreadySubmitted: "You have already submitted a score for this session",
      submitError: "Error submitting score. Please try again.",
    },
  },
} as const;
