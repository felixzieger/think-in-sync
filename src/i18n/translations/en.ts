export const en = {
  game: {
    title: "Think in Sync",
    round: "Round",
    buildDescription: "Build a sentence together",
    buildSubtitle: "Take turns adding words to create a sentence",
    startSentence: "Start building your sentence...",
    inputPlaceholder: "Enter a SINGLE word...",
    addWord: "Add Word",
    makeGuess: "Make Guess",
    aiThinking: "AI is thinking...",
    aiDelayed: "The AI is currently busy. Please try again in a moment.",
    invalidWord: "Invalid Word",
    cantUseTargetWord: "Do not use the secret word",
    shorterWord: "Use a shorter word",
    lettersOnly: "Please use letters only",
    singleWordOnly: "Please enter only one word",
    leaveGameTitle: "Leave Game?",
    leaveGameDescription: "Your current progress will be lost. Are you sure you want to leave?",
    cancel: "Cancel",
    confirm: "Confirm",
    describeWord: "Your goal is to describe the word",
    nextRound: "Next Round",
    playAgain: "Play Again",
    saveScore: "Save Score",
    review: {
      title: "Game Review",
      successfulRounds: "Successful Rounds",
      description: "Here's how you did:",
      playAgain: "Play Again",
      saveScore: "Save Score",
      shareGame: "Share",
      urlCopied: "URL Copied!",
      urlCopiedDesc: "Share this URL with friends to let them play with the same words",
      urlCopyError: "Failed to copy URL",
      urlCopyErrorDesc: "Please try copying the URL manually",
      youWin: "You Won!",
      youLost: "You Lost!",
      friendScore: (score: number, avgWords: string) =>
        `The person that challenged you completed ${score} rounds successfully with an average of ${avgWords} words.`,
      word: "Word",
      yourWords: "You",
      friendWords: "Friend",
      result: "Result",
      details: "Details",
      yourDescription: "Your Description",
      friendDescription: "Friend's Description",
      aiGuessed: "AI guessed",
      words: "Words"
    },
    invitation: {
      title: "Game Invitation",
      description: "Hey, you got invited to play a game. Play now to find out how well you do on the same set of words!"
    }
  },
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
    noScores: "No scores yet",
    previous: "Previous",
    next: "Next",
    success: "Score submitted successfully!",
    theme: "Theme",
    error: {
      invalidName: "Please enter a valid name",
      noRounds: "You need to complete at least one round",
      alreadySubmitted: "Score already submitted",
      newHighScore: "New High Score!",
      beatRecord: "You beat your previous record of {score}!",
      notHigher: "Score of {current} not higher than your best of {best}",
      submitError: "Error submitting score"
    }
  },
  guess: {
    title: "AI's Guess",
    goalDescription: "Your goal was to describe the word",
    providedDescription: "You provided the description",
    aiGuessedDescription: "Based on this description, the AI guessed",
    correct: "This is right!",
    incorrect: "This is wrong.",
    nextRound: "Next Round",
    playAgain: "Play Again",
    viewLeaderboard: "Save your score",
    cheatingDetected: "Cheating detected!",
  },
  themes: {
    title: "Choose a Theme",
    subtitle: "Select a theme for the word that the AI will try to guess",
    standard: "Standard",
    technology: "Technology",
    sports: "Sports",
    food: "Food",
    custom: "Custom Theme",
    customPlaceholder: "Enter your custom theme...",
    continue: "Continue",
    generating: "Generating...",
    pressKey: "Press",
    playing: "Theme"
  },
  welcome: {
    title: "Think in Sync",
    subtitle: "Team up with AI to craft a clue and have a different AI guess your secret word!",
    startButton: "Start Game",
    startDailyButton: "Daily Challenge",
    startNewButton: "New Game",
    dailyLeaderboard: "Today's Ranking",
    howToPlay: "How to Play",
    leaderboard: "Leaderboard",
    credits: "Created during the",
    likeGameText: "If you want to support this game",
    contest: {
      prize: "We are cooking something...",
      terms: "Find out more",
      howTo: "To get a head start:",
      conditions: [
        "Play Think in Sync using the Standard wordlist",
        "Set your leaderboard name to match your Hugging Face username",
        "Like our project on Hugging Face"
      ],
      deadline: "We're gonna announce the details soon here",
      prizes: {
        title: "Compete for the top 5 spots and win:",
        list: [
          "🥇 1st: 50€",
          "🥈 2nd: 20€",
          "🥉 3rd: 10€",
          "🎖️ 4th & 5th: 10€ each"
        ]
      },
      fairPlay: "🚨 Fair play is monitored. Any cheating will result in disqualification!"
    },
    likeOnHuggingface: "Like on Hugging Face"
  },
  howToPlay: {
    setup: {
      title: "Setup",
      description: "Choose a theme and get a secret word that the AI will try to guess."
    },
    goal: {
      title: "Goal",
      description: "Build sentences together with the AI that describe your word without using it directly."
    },
    rules: {
      title: "Rules",
      items: [
        "Take turns adding words to build descriptive sentences",
        "Don't use the secret word or its variations",
        "Try to be creative and descriptive",
        "The AI will try to guess your word after each sentence"
      ]
    }
  }
};