export const it = {
  leaderboard: {
    title: "Punteggi Migliori",
    yourScore: "Il Tuo Punteggio",
    roundCount: "turni",
    wordsPerRound: "parole per turno",
    enterName: "Inserisci il tuo nome",
    submitting: "Invio in corso...",
    submit: "Invia Punteggio",
    rank: "Posizione",
    player: "Giocatore",
    roundsColumn: "Turni",
    avgWords: "Media Parole",
    noScores: "Ancora nessun punteggio",
    previous: "Precedente",
    next: "Successivo",
    success: "Punteggio inviato con successo!",
    error: {
      invalidName: "Inserisci un nome valido (solo lettere e numeri)",
      noRounds: "Devi completare almeno un turno",
      alreadySubmitted: "Hai già inviato il tuo punteggio",
      submitError: "Errore durante l'invio del punteggio"
    }
  },
  welcome: {
    title: "Improvvisazione Descrittiva",
    subtitle: "Un gioco di indovinelli dove collabori con l'IA",
    startButton: "Inizia Gioco",
    howToPlay: "Come Giocare",
    leaderboard: "Classifica",
    likeOnHuggingface: "Mi piace su Huggingface",
    contest: {
      prize: "Vinci fino a $3.000 in premi!",
      terms: "Termini del Concorso",
      howTo: "Come partecipare al concorso:",
      conditions: [
        "Gioca e invia i tuoi punteggi migliori",
        "Metti mi piace al progetto su Huggingface",
        "I vincitori saranno selezionati in base ai punteggi più alti"
      ],
      termsDetails: "Il concorso dura fino al 31 marzo 2024. I vincitori saranno notificati via email."
    }
  },
  game: {
    title: "Improvvisazione Descrittiva",
    round: "Turno",
    describeWord: "Descrivi questa parola senza usarla:",
    inputPlaceholder: "Inserisci una parola...",
    addWord: "Aggiungi Parola",
    makeGuess: "Fai un Tentativo",
    aiThinking: "L'IA sta pensando...",
    aiDelayed: "L'IA sta impiegando più tempo del solito. Attendi...",
    singleWordOnly: "Inserisci solo una parola",
    cantUseTargetWord: "Non puoi usare la parola obiettivo",
    lettersOnly: "Usa solo lettere",
    leaveGameTitle: "Lasciare il Gioco?",
    leaveGameDescription: "Il tuo progresso andrà perso se esci ora.",
    cancel: "Annulla",
    confirm: "Conferma"
  },
  guess: {
    nextRound: "Prossimo Turno",
    viewLeaderboard: "Vedi Classifica",
    playAgain: "Gioca Ancora",
    providedDescription: "La tua descrizione:",
    aiGuessedDescription: "L'IA ha indovinato:"
  },
  themes: {
    title: "Scegli un Tema",
    subtitle: "Seleziona un tema per le tue parole:",
    standard: "Parole Standard",
    sports: "Sport",
    food: "Cibo e Bevande",
    custom: "Tema Personalizzato",
    customPlaceholder: "Inserisci il tuo tema...",
    pressKey: "Premi",
    continue: "Continua",
    generating: "Generazione..."
  },
  howToPlay: {
    setup: {
      title: "Preparazione",
      description: "Scegli un tema e ottieni una parola segreta."
    },
    goal: {
      title: "Obiettivo",
      description: "Aiuta l'IA a indovinare la tua parola fornendo parole descrittive."
    },
    rules: {
      title: "Regole",
      items: [
        "Aggiungi una parola alla volta",
        "Non usare la parola segreta",
        "Sii creativo con le tue descrizioni",
        "Cerca di usare il minor numero di parole possibile"
      ]
    }
  }
} as const;