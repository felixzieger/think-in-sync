export const de = {
  app: {
    update: {
      title: "Update verfügbar",
      description: "Eine neue Version von Think in Sync ist bereit.",
      refresh: "Aktualisieren"
    }
  },
  game: {
    title: "Think in Sync",
    round: "Runde",
    buildDescription: "Baut gemeinsam einen Satz",
    buildSubtitle: "Fügt abwechselnd Wörter hinzu, um einen Satz zu bilden",
    startSentence: "Beginne deinen Satz...",
    inputPlaceholder: "Gib EIN Wort ein...",
    addWord: "Hinzufügen",
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
    nextWord: "Nächstes Wort",
    playAgain: "Erneut spielen",
    saveScore: "Punktzahl speichern",
    playNewWords: "Neue Wörter spielen",
    skipWord: "Wort überspringen",
    finishGame: "Spiel beenden",
    review: {
      title: "Spielübersicht",
      successfulRounds: "Erfolgreiche Runden",
      description: "Hier ist dein Ergebnis:",
      playAgain: "Gleiche Wörter erneut spielen",
      playNewWords: "Neue Wörter spielen",
      saveScore: "Punktzahl speichern",
      shareGame: "Teilen",
      urlCopied: "URL kopiert!",
      urlCopiedDesc: "Teile diese URL mit Freunden, damit sie mit den gleichen Wörtern spielen können",
      urlCopyError: "URL konnte nicht kopiert werden",
      urlCopyErrorDesc: "Bitte versuche die URL manuell zu kopieren",
      youWin: "Du hast gewonnen!",
      youLost: "Du hast verloren!",
      correct: "Richtig",
      wrong: "Falsch",
      total: "Gesamt",
      friendScore: (score: number, avgWords: string) =>
        `Die Person, die dich herausgefordert hat, hat ${score} Runden erfolgreich mit durchschnittlich ${avgWords} Wörtern abgeschlossen.`,
      word: "Wort",
      yourWords: "Du",
      friendWords: "Freund",
      result: "Ergebnis",
      details: "Details",
      yourDescription: "Deine Beschreibung",
      friendDescription: "Beschreibung des Freundes",
      aiGuessed: "KI hat geraten",
      words: "Wörter",
      avgWords: "Durchschnittliche Wörter pro Runde"
    },
    invitation: {
      title: "Spieleinladung",
      description: "Hey, du wurdest zu einem Spiel eingeladen. Spiele jetzt und finde heraus, wie gut du mit denselben Wörtern abschneidest!"
    },
    error: {
      title: "Spiel konnte nicht gestartet werden",
      description: "Bitte versuche es in einem Moment erneut."
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
    actions: "Aktionen",
    playSameWords: "Gleiche Wörter spielen",
    scoreUpdated: "Punktzahl aktualisiert!",
    scoreUpdatedDesc: "Deine vorherige Punktzahl für dieses Spiel wurde aktualisiert",
    scoreSubmitted: "Punktzahl eingereicht!",
    scoreSubmittedDesc: "Deine Punktzahl wurde zur Bestenliste hinzugefügt",
    modes: {
      daily: "Die heutigen Täglichen 10",
      "all-time": "Bestenliste"
    },
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
    providedDescription: "beschriebt das Wort mit",
    aiGuessedDescription: {
      prefix: "Basierend auf dieser Beschreibung",
      aiName: "die KI",
      suffix: "hat geraten"
    },
    correct: "Das ist richtig!",
    incorrect: "Das ist falsch.",
    nextRound: "Nächste Runde",
    playAgain: "Erneut spielen",
    viewLeaderboard: "In Bestenliste eintragen",
    cheatingDetected: "Betrugsversuch erkannt!",
    you: "Du",
    and: "und",
    aiModel: "KI-Modell"
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
    startDailyButton: "Spiele die Täglichen 10",
    startNewButton: "Freestyle spielen",
    dailyLeaderboard: "Tagesranking",
    howToPlay: "Spielanleitung",
    leaderboard: "Bestenliste",
    credits: "Erstellt während des",
    likeGameText: "Wenn du dieses Spiel unterstützen möchtest",
    stats: {
      title: "Statistiken",
      dailyGuesses: "Heute erratene Wörter",
      totalGuesses: "Insgesamt erratene Wörter",
      visitDashboard: "Dashboard besuchen"
    },
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
    },
    gameModes: {
      title: "Spielmodi",
      daily: "Tägliche 10: Alle Spieler erhalten die gleiche Wortliste, die sich alle 24 Stunden erneuert",
      custom: "Freestyle: Wähle dein eigenes Thema und spiele dein persönliches Spiel"
    }
  },
  models: {
    title: "KI-Modell wählen",
    subtitle: "Wähle das KI-Modell, das mit dir zusammen spielen wird",
    continue: "Weiter",
    generating: "Wird generiert...",
    custom: "Benutzerdefiniertes Modell",
    searchPlaceholder: "Nach einem Modell suchen...",
    loginRequired: "Bitte melde dich an oder registriere dich, um benutzerdefinierte Modelle zu verwenden"
  },
  auth: {
    login: {
      linkText: "Anmelden",
      title: "Anmelden",
      subtitle: "Melde dich bei deinem Konto an",
      email: "E-Mail",
      password: "Passwort",
      submit: "Anmelden",
      loggingIn: "Wird angemeldet...",
      noAccount: "Noch kein Konto?",
      register: "Registrieren"
    },
    loginSuccess: {
      title: "Anmeldung erfolgreich",
      description: "Du wurdest erfolgreich angemeldet"
    },
    loginError: {
      title: "Anmeldung fehlgeschlagen",
      description: "Bei der Anmeldung ist ein Fehler aufgetreten"
    },
    register: {
      linkText: "Registrieren",
      title: "Registrieren",
      description: "Erstelle ein neues Konto",
      email: "E-Mail",
      password: "Passwort",
      confirmPassword: "Passwort bestätigen",
      submit: "Registrieren",
      registering: "Registrieren...",
      haveAccount: "Bereits ein Konto?",
      login: "Anmelden"
    },
    registerSuccess: {
      title: "Registrierung erfolgreich",
      description: "Dein Konto wurde erfolgreich erstellt"
    },
    registerError: {
      title: "Registrierung fehlgeschlagen",
      description: "Bei der Registrierung ist ein Fehler aufgetreten"
    },
    logoutSuccess: {
      title: "Abgemeldet",
      description: "Du wurdest erfolgreich abgemeldet"
    },
    form: {
      email: "E-Mail",
      password: "Passwort",
      logout: "Abmelden"
    }
  }
};
