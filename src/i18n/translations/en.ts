export const en = {
  app: {
    update: {
      title: "Update available",
      description: "A new version of Think in Sync is ready.",
      refresh: "Refresh"
    }
  },
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
    nextWord: "Next Word",
    playAgain: "Play Again",
    saveScore: "Save Score",
    skipWord: "Skip word",
    finishGame: "Finish game",
    review: {
      title: "Game Review",
      successfulRounds: "Successful Rounds",
      description: "Here's how you did:",
      playAgain: "Play same words again",
      playNewWords: "Play new words",
      saveScore: "Save Score",
      shareGame: "Share",
      urlCopied: "URL Copied!",
      urlCopiedDesc: "Share this URL with friends to let them play with the same words",
      urlCopyError: "Failed to copy URL",
      urlCopyErrorDesc: "Please try copying the URL manually",
      youWin: "You Won!",
      youLost: "You Lost!",
      correct: "Correct",
      wrong: "Wrong",
      total: "Total",
      avgWords: "Average Words per Round",
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
    },
    error: {
      title: "Game could not be started",
      description: "Please try again in a moment."
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
    actions: "Actions",
    playSameWords: "Play same words",
    scoreUpdated: "Score Updated!",
    scoreUpdatedDesc: "Your previous score for this game has been updated",
    scoreSubmitted: "Score Submitted!",
    scoreSubmittedDesc: "Your score has been added to the leaderboard",
    modes: {
      daily: "Daily 10",
      "all-time": "All Time"
    },
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
    providedDescription: "provided the description",
    aiGuessedDescription: {
      prefix: "Based on this description,",
      aiName: "the AI",
      suffix: "guessed"
    },
    correct: "This is right!",
    incorrect: "This is wrong.",
    nextRound: "Next Round",
    playAgain: "Play Again",
    viewLeaderboard: "Save your score",
    cheatingDetected: "Cheating detected!",
    you: "You",
    and: "and",
    aiModel: "AI Model"
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
    startDailyButton: "Play Daily 10",
    startNewButton: "Play Freestyle",
    dailyLeaderboard: "Today's Ranking",
    howToPlay: "How to Play",
    leaderboard: "Leaderboard",
    credits: "Created during the",
    likeGameText: "If you want to support this game",
    stats: {
      title: "Statistics",
      dailyGuesses: "Words guessed today",
      totalGuesses: "Total words guessed",
      visitDashboard: "Visit Dashboard"
    },
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
    },
    gameModes: {
      title: "Game Modes",
      daily: "Daily 10: Everyone gets the same wordlist, refreshed every 24 hours",
      custom: "Freestyle: Choose your own theme and play a personal game"
    }
  },
  models: {
    title: "Choose an AI Model",
    subtitle: "Select the AI model that will play together with you",
    continue: "Continue",
    generating: "Generating...",
    custom: "Custom Model",
    searchPlaceholder: "Search for a model...",
    loginRequired: "Please log in or register to use custom models"
  },
  auth: {
    login: {
      linkText: "Login",
      title: "Login",
      subtitle: "Sign in to your account",
      email: "Email",
      password: "Password",
      submit: "Login",
      loggingIn: "Logging in...",
      noAccount: "Don't have an account?",
      register: "Register"
    },
    loginSuccess: {
      title: "Login successful",
      description: "You have been successfully logged in"
    },
    loginError: {
      title: "Login failed",
      description: "An error occurred while trying to log in"
    },
    register: {
      linkText: "Register",
      title: "Register",
      description: "Create a new account",
      email: "Email",
      password: "Password",
      confirmPassword: "Confirm Password",
      submit: "Register",
      registering: "Registering...",
      haveAccount: "Already have an account?",
      login: "Login"
    },
    registerSuccess: {
      title: "Registration successful",
      description: "Your account has been created successfully"
    },
    registerError: {
      title: "Registration failed",
      description: "An error occurred while trying to register"
    },
    logoutSuccess: {
      title: "Logged out",
      description: "You have been successfully logged out"
    },
    form: {
      email: "Email",
      password: "Password",
      logout: "Logout"
    }
  }
};
