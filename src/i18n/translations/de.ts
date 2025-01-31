export const de = {
  game: {
    title: "Think in Sync",
    round: "Runde",
    buildDescription: "Baut gemeinsam einen Satz",
    buildSubtitle: "Fügt abwechselnd Wörter hinzu, um einen Satz zu bilden",
    startSentence: "Beginne deinen Satz...",
    inputPlaceholder: "Gib EIN Wort ein...",
    addWord: "Wort hinzufügen",
    makeGuess: "Raten",
    aiThinking: "KI denkt nach...",
    aiDelayed: "Die KI ist derzeit beschäftigt. Bitte versuche es gleich noch einmal.",
    invalidWord: "Ungültiges Wort",
    cantUseTargetWord: "Verwende nicht das geheime Wort",
    shorterWord: "Verwende ein kürzeres Wort",
    lettersOnly: "Bitte nur Buchstaben verwenden",
    singleWordOnly: "Bitte nur ein Wort eingeben",
    leaveGameTitle: "Spiel verlassen?",
    leaveGameDescription: "Dein aktueller Fortschritt geht verloren. Bist du sicher, dass du das Spiel verlassen möchtest?",
    cancel: "Abbrechen",
    confirm: "Bestätigen",
    describeWord: "Dein Ziel ist es folgendes Wort zu beschreiben",
    nextRound: "Nächste Runde",
    playAgain: "Erneut spielen",
    saveScore: "Punktzahl speichern",
    review: {
      title: "Spielübersicht",
      successfulRounds: "Erfolgreiche Runden",
      description: "Hier ist dein Ergebnis:",
      playAgain: "Erneut spielen",
      saveScore: "Punktzahl speichern",
      shareGame: "Teilen",
      urlCopied: "URL kopiert!",
      urlCopiedDesc: "Teile diese URL mit Freunden, damit sie mit den gleichen Wörtern spielen können",
      urlCopyError: "URL konnte nicht kopiert werden",
      urlCopyErrorDesc: "Bitte versuche die URL manuell zu kopieren",
      youWin: "Du hast gewonnen!",
      youLost: "Du hast verloren!",
      friendScore: (score: number, avgWords: string) =>
        `Die Person, die dich herausgefordert hat, hat ${score} Runden erfolgreich mit durchschnittlich ${avgWords} Wörtern abgeschlossen.`,
      word: "Wort",
      yourWords: "Deine Wörter",
      friendWords: "Freund's Wörter",
      result: "Ergebnis",
      details: "Details",
      yourDescription: "Deine Beschreibung",
      friendDescription: "Beschreibung des Freundes",
      aiGuessed: "KI hat geraten"
    },
    invitation: {
      title: "Spieleinladung",
      description: "Hey, du wurdest zu einem Spiel eingeladen. Spiele jetzt und finde heraus, wie gut du mit denselben Wörtern abschneidest!"
    }
  },
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
    noScores: "Noch keine Punktzahlen",
    previous: "Vorherige",
    next: "Nächste",
    success: "Punktzahl erfolgreich übermittelt!",
    theme: "Thema",
    error: {
      invalidName: "Bitte gib einen gültigen Namen ein",
      noRounds: "Du musst mindestens eine Runde abschließen",
      alreadySubmitted: "Punktzahl bereits eingereicht",
      newHighScore: "Neuer Highscore!",
      beatRecord: "Du hast deinen bisherigen Rekord von {score} geschlagen!",
      notHigher: "Punktzahl von {current} nicht höher als dein Bester von {best}",
      submitError: "Fehler beim Einreichen der Punktzahl"
    }
  },
  guess: {
    title: "KI-Vermutung",
    goalDescription: "Dein Ziel war es folgendes Wort zu beschreiben",
    providedDescription: "Du hast folgende Beschreibung gegeben",
    aiGuessedDescription: "Basierend auf deiner Beschreibung hat die KI geraten",
    correct: "Das ist richtig!",
    incorrect: "Das ist falsch.",
    nextRound: "Nächste Runde",
    playAgain: "Erneut spielen",
    viewLeaderboard: "In Bestenliste eintragen",
    cheatingDetected: "Betrugsversuch erkannt!"
  },
  themes: {
    title: "Wähle ein Thema",
    subtitle: "Wähle ein Thema für das Wort, das die KI erraten soll",
    standard: "Standard",
    technology: "Technologie",
    sports: "Sport",
    food: "Essen",
    custom: "Eigenes Thema",
    customPlaceholder: "Gib dein eigenes Thema ein...",
    continue: "Weiter",
    generating: "Wird generiert...",
    pressKey: "Drücke",
    playing: "Thema"
  },
  welcome: {
    title: "Think in Sync",
    subtitle: "Arbeite mit KI zusammen, um einen Hinweis zu erstellen und lass eine andere KI dein geheimes Wort erraten!",
    startButton: "Spiel starten",
    howToPlay: "Spielanleitung",
    leaderboard: "Bestenliste",
    credits: "Erstellt während des",
    likeGameText: "Wenn du dieses Spiel unterstützen möchtest",
    contest: {
      prize: "Wir kochen etwas...",
      terms: "Erfahre mehr",
      howTo: "So bereitest du dich vor:",
      conditions: [
        "Spiele Think in Sync mit der Standard-Wortliste",
        "Setze deinen Bestenlisten-Namen gleich deinem Hugging Face Benutzernamen",
        "Like unser Projekt auf Hugging Face"
      ],
      deadline: "Wir werden die Details bald hier bekannt geben",
      prizes: {
        title: "Kämpfe um die Top 5 Plätze und gewinne:",
        list: [
          "🥇 1. Platz: 50€",
          "🥈 2. Platz: 20€",
          "🥉 3. Platz: 10€",
          "🎖️ 4. & 5. Platz: je 10€"
        ]
      },
      fairPlay: "🚨 Faires Spielen wird überwacht. Betrug führt zur Disqualifikation!"
    },
    likeOnHuggingface: "Auf Hugging Face liken"
  },
  howToPlay: {
    setup: {
      title: "Vorbereitung",
      description: "Wähle ein Thema und erhalte ein geheimes Wort, das die KI erraten soll."
    },
    goal: {
      title: "Ziel",
      description: "Baue gemeinsam mit der KI Sätze, die dein Wort beschreiben, ohne es direkt zu verwenden."
    },
    rules: {
      title: "Regeln",
      items: [
        "Füge abwechselnd Wörter hinzu, um beschreibende Sätze zu bilden",
        "Verwende nicht das geheime Wort oder seine Variationen",
        "Sei kreativ und beschreibend",
        "Die KI wird nach jedem Satz versuchen, dein Wort zu erraten"
      ]
    }
  }
};
