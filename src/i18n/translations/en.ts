export const en = {
  leaderboard: {
    title: "High Scores",
    yourScore: "Your Score",
    roundCount: "rounds",
    wordsPerRound: "words per round",
    enterName: "Enter your name",
    submitting: "Submitting...",
    submit: "Submit Score",
    rank: "Rank",
    player: "Player",
    roundsColumn: "Rounds",
    avgWords: "Avg. Words",
    noScores: "No high scores yet",
    previous: "Previous",
    next: "Next",
    success: "Score submitted successfully!",
    error: {
      invalidName: "Please enter a valid name (letters and numbers only)",
      noRounds: "You need to complete at least one round",
      alreadySubmitted: "You have already submitted your score",
      submitError: "Error submitting score"
    }
  },
  welcome: {
    title: "Description Improv",
    subtitle: "A word-guessing game where you collaborate with AI",
    startButton: "Start Game",
    howToPlay: "How to Play",
    leaderboard: "Leaderboard",
    likeOnHuggingface: "Like on Huggingface",
    contest: {
      prize: "Win up to $3,000 in prizes!",
      terms: "Contest Terms",
      howTo: "How to participate in the contest:",
      conditions: [
        "Play the game and submit your high scores",
        "Like the project on Huggingface",
        "Winners will be selected based on highest scores"
      ],
      termsDetails: "Contest runs until March 31st, 2024. Winners will be notified via email."
    }
  },
  game: {
    title: "Description Improv",
    round: "Round",
    describeWord: "Describe this word without using it:",
    inputPlaceholder: "Enter a word...",
    addWord: "Add Word",
    makeGuess: "Make Guess",
    aiThinking: "AI is thinking...",
    aiDelayed: "The AI is taking longer than usual to respond. Please wait...",
    singleWordOnly: "Please enter only one word",
    cantUseTargetWord: "You can't use the target word",
    lettersOnly: "Please use only letters",
    leaveGameTitle: "Leave Game?",
    leaveGameDescription: "Your progress will be lost if you leave now.",
    cancel: "Cancel",
    confirm: "Confirm"
  },
  guess: {
    nextRound: "Next Round",
    viewLeaderboard: "View Leaderboard",
    playAgain: "Play Again",
    providedDescription: "Your description:",
    aiGuessedDescription: "The AI guessed:"
  },
  themes: {
    title: "Choose a Theme",
    subtitle: "Select a theme for your words:",
    standard: "Standard Words",
    sports: "Sports",
    food: "Food & Drinks",
    custom: "Custom Theme",
    customPlaceholder: "Enter your theme...",
    pressKey: "Press",
    continue: "Continue",
    generating: "Generating..."
  },
  howToPlay: {
    setup: {
      title: "Setup",
      description: "Choose a theme and get a secret word."
    },
    goal: {
      title: "Goal",
      description: "Help the AI guess your word by providing descriptive words."
    },
    rules: {
      title: "Rules",
      items: [
        "Add one word at a time",
        "Don't use the secret word",
        "Be creative with your descriptions",
        "Try to use as few words as possible"
      ]
    }
  }
} as const;