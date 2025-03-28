export const it = {
  game: {
    title: "Think in Sync",
    round: "Turno",
    buildDescription: "Costruite una frase insieme",
    buildSubtitle: "Aggiungete parole a turno per creare una frase",
    startSentence: "Inizia a costruire la tua frase...",
    inputPlaceholder: "Inserisci UNA parola...",
    addWord: "Aggiungi parola",
    makeGuess: "Indovina",
    aiThinking: "L'IA sta pensando...",
    aiDelayed: "L'IA è attualmente occupata. Riprova tra un momento.",
    invalidWord: "Parola non valida",
    cantUseTargetWord: "Non usare la parola segreta",
    shorterWord: "Usa una parola più corta",
    lettersOnly: "Usa solo lettere",
    singleWordOnly: "Inserisci una sola parola",
    leaveGameTitle: "Lasciare il gioco?",
    leaveGameDescription: "I tuoi progressi attuali andranno persi. Sei sicuro di voler uscire?",
    cancel: "Annulla",
    confirm: "Conferma",
    describeWord: "Il tuo obiettivo è descrivere la parola",
    nextRound: "Prossimo Turno",
    playAgain: "Gioca Ancora",
    saveScore: "Salva Punteggio",
    review: {
      title: "Riepilogo Partita",
      successfulRounds: "Turni Riusciti",
      description: "Ecco i tuoi risultati:",
      playAgain: "Gioca di nuovo le stesse parole",
      playNewWords: "Gioca nuove parole",
      saveScore: "Salva Punteggio",
      shareGame: "Condividi",
      urlCopied: "URL copiato!",
      urlCopiedDesc: "Condividi questo URL con gli amici per farli giocare con le stesse parole",
      urlCopyError: "Impossibile copiare l'URL",
      urlCopyErrorDesc: "Prova a copiare l'URL manualmente",
      youWin: "Hai vinto!",
      youLost: "Hai perso!",
      friendScore: (score: number, avgWords: string) =>
        `La persona che ti ha sfidato ha completato ${score} turni con una media di ${avgWords} parole.`,
      word: "Parola",
      yourWords: "Tu",
      friendWords: "Amico",
      result: "Risultato",
      details: "Dettagli",
      yourDescription: "La Tua Descrizione",
      friendDescription: "Descrizione dell'Amico",
      aiGuessed: "L'IA ha indovinato",
      words: "Parole"
    },
    invitation: {
      title: "Invito al Gioco",
      description: "Ehi, sei stato invitato a giocare. Gioca ora per scoprire come te la cavi con le stesse parole!"
    },
    error: {
      title: "Impossibile avviare il gioco",
      description: "Per favore riprova tra un momento."
    }
  },
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
    theme: "Tema",
    actions: "Azioni",
    playSameWords: "Gioca le stesse parole",
    scoreUpdated: "Punteggio aggiornato!",
    scoreUpdatedDesc: "Il tuo punteggio precedente per questo gioco è stato aggiornato",
    scoreSubmitted: "Punteggio inviato!",
    scoreSubmittedDesc: "Il tuo punteggio è stato aggiunto alla classifica",
    modes: {
      daily: "Sfida Giornaliera",
      "all-time": "Classifica Generale"
    },
    error: {
      invalidName: "Inserisci un nome valido",
      noRounds: "Devi completare almeno un turno",
      alreadySubmitted: "Punteggio già inviato",
      newHighScore: "Nuovo Record!",
      beatRecord: "Hai battuto il tuo record precedente di {score}!",
      notHigher: "Punteggio di {current} non superiore al tuo migliore di {best}",
      submitError: "Errore nell'invio del punteggio"
    }
  },
  guess: {
    title: "Ipotesi dell'IA",
    sentence: "La tua frase",
    aiGuessed: "L'IA ha indovinato",
    goalDescription: "Il tuo obiettivo era descrivere la parola",
    providedDescription: "hanno fornito la descrizione",
    aiGuessedDescription: "Basandosi su questa descrizione, l'IA ha indovinato",
    correct: "Corretto! L'IA ha indovinato la parola!",
    incorrect: "Sbagliato. Riprova!",
    nextRound: "Prossimo Turno",
    playAgain: "Gioca Ancora",
    viewLeaderboard: "Vedi Classifica",
    cheatingDetected: "Tentativo di imbroglio rilevato!",
    you: "Tu",
    and: "e",
    aiModel: "Modello IA"
  },
  themes: {
    title: "Scegli un Tema",
    subtitle: "Seleziona un tema per la parola che l'IA cercherà di indovinare",
    standard: "Standard",
    technology: "Tecnologia",
    sports: "Sport",
    food: "Cibo",
    custom: "Tema Personalizzato",
    customPlaceholder: "Inserisci il tuo tema personalizzato...",
    continue: "Continua",
    generating: "Generazione...",
    pressKey: "Premi",
    playing: "Tema"
  },
  welcome: {
    title: "Think in Sync",
    subtitle: "Fai squadra con l'IA per creare un indizio e lascia che un'altra IA indovini la tua parola segreta!",
    startButton: "Inizia gioco",
    startDailyButton: "Sfida Giornaliera",
    startNewButton: "Nuova Partita",
    dailyLeaderboard: "Classifica di oggi",
    howToPlay: "Come giocare",
    leaderboard: "Classifica",
    credits: "Creato durante il",
    likeGameText: "Se vuoi supportare questo gioco",
    stats: {
      title: "Statistiche",
      dailyGuesses: "Parole indovinate oggi",
      totalGuesses: "Totale parole indovinate",
      visitDashboard: "Visita il Dashboard"
    },
    contest: {
      prize: "Stiamo preparando qualcosa...",
      terms: "Scopri di più",
      howTo: "Per anticipare i nostri piani:",
      conditions: [
        "Gioca a Think in Sync usando la lista di parole standard",
        "Imposta il tuo nome in classifica uguale al tuo nome utente Hugging Face",
        "Metti mi piace al nostro progetto su Hugging Face"
      ],
      deadline: "Annunceremo presto i dettagli qui",
      prizes: {
        title: "Competi per i primi 5 posti e vinci:",
        list: [
          "🥇 1°: 50€",
          "🥈 2°: 20€",
          "🥉 3°: 10€",
          "🎖️ 4° e 5°: 10€ ciascuno"
        ]
      },
      fairPlay: "🚨 Il fair play è monitorato. Qualsiasi imbroglio porterà alla squalifica!"
    },
    likeOnHuggingface: "Mi piace su Hugging Face"
  },
  howToPlay: {
    setup: {
      title: "Preparazione",
      description: "Scegli un tema e ottieni una parola segreta che l'IA cercherà di indovinare."
    },
    goal: {
      title: "Obiettivo",
      description: "Costruisci frasi insieme all'IA che descrivono la tua parola senza usarla direttamente."
    },
    rules: {
      title: "Regole",
      items: [
        "Aggiungi parole a turno per costruire frasi descrittive",
        "Non usare la parola segreta o le sue variazioni",
        "Sii creativo e descrittivo",
        "L'IA cercherà di indovinare la tua parola dopo ogni frase"
      ]
    }
  },
  models: {
    title: "Scegli un Modello IA",
    subtitle: "Seleziona il modello IA che giocherà contro di te",
    continue: "Continua",
    generating: "Generazione in corso..."
  }
};
