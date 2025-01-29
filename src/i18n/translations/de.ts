export const de = {
  leaderboard: {
    title: "Bestenliste",
    yourScore: "Deine Punktzahl",
    roundCount: "Runden",
    wordsPerRound: "Wörter pro Runde",
    enterName: "Gib deinen Namen ein",
    submitting: "Wird übermittelt...",
    submit: "Punktzahl einreichen",
    rank: "Rang",
    player: "Spieler",
    roundsColumn: "Runden",
    avgWords: "Durchschn. Wörter",
    noScores: "Noch keine Highscores",
    previous: "Vorherige",
    next: "Nächste",
    success: "Punktzahl erfolgreich übermittelt!",
    error: {
      invalidName: "Bitte gib einen gültigen Namen ein (nur Buchstaben und Zahlen)",
      noRounds: "Du musst mindestens eine Runde abschließen",
      alreadySubmitted: "Du hast deine Punktzahl bereits eingereicht",
      submitError: "Fehler beim Einreichen der Punktzahl"
    }
  },
  welcome: {
    title: "Beschreibungs-Impro",
    subtitle: "Ein Wortraten-Spiel, bei dem du mit KI zusammenarbeitest",
    startButton: "Spiel Starten",
    howToPlay: "Spielanleitung",
    leaderboard: "Bestenliste",
    likeOnHuggingface: "Auf Huggingface liken",
    contest: {
      prize: "Gewinne bis zu 3.000 $ an Preisen!",
      terms: "Wettbewerbsbedingungen",
      howTo: "So nimmst du am Wettbewerb teil:",
      conditions: [
        "Spiele und reiche deine Highscores ein",
        "Like das Projekt auf Huggingface",
        "Gewinner werden basierend auf den höchsten Punktzahlen ausgewählt"
      ],
      termsDetails: "Der Wettbewerb läuft bis zum 31. März 2024. Gewinner werden per E-Mail benachrichtigt."
    }
  },
  game: {
    title: "Beschreibungs-Impro",
    round: "Runde",
    describeWord: "Beschreibe dieses Wort, ohne es zu verwenden:",
    inputPlaceholder: "Gib ein Wort ein...",
    addWord: "Wort Hinzufügen",
    makeGuess: "Raten",
    aiThinking: "KI denkt nach...",
    aiDelayed: "Die KI braucht länger als gewöhnlich. Bitte warte...",
    singleWordOnly: "Bitte gib nur ein Wort ein",
    cantUseTargetWord: "Du kannst das Zielwort nicht verwenden",
    lettersOnly: "Bitte verwende nur Buchstaben",
    leaveGameTitle: "Spiel Verlassen?",
    leaveGameDescription: "Dein Fortschritt geht verloren, wenn du jetzt gehst.",
    cancel: "Abbrechen",
    confirm: "Bestätigen"
  },
  guess: {
    nextRound: "Nächste Runde",
    viewLeaderboard: "Bestenliste Anzeigen",
    playAgain: "Erneut Spielen",
    providedDescription: "Deine Beschreibung:",
    aiGuessedDescription: "Die KI hat geraten:"
  },
  themes: {
    title: "Wähle ein Thema",
    subtitle: "Wähle ein Thema für deine Wörter:",
    standard: "Standard Wörter",
    sports: "Sport",
    food: "Essen & Trinken",
    custom: "Eigenes Thema",
    customPlaceholder: "Gib dein Thema ein...",
    pressKey: "Drücke",
    continue: "Weiter",
    generating: "Generiere..."
  },
  howToPlay: {
    setup: {
      title: "Vorbereitung",
      description: "Wähle ein Thema und erhalte ein geheimes Wort."
    },
    goal: {
      title: "Ziel",
      description: "Hilf der KI, dein Wort zu erraten, indem du beschreibende Wörter verwendest."
    },
    rules: {
      title: "Regeln",
      items: [
        "Füge ein Wort nach dem anderen hinzu",
        "Verwende nicht das geheime Wort",
        "Sei kreativ mit deinen Beschreibungen",
        "Versuche, so wenige Wörter wie möglich zu verwenden"
      ]
    }
  }
} as const;