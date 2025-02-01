export const fr = {
  game: {
    title: "Think in Sync",
    round: "Tour",
    buildDescription: "Construisez une phrase ensemble",
    buildSubtitle: "Ajoutez des mots à tour de rôle pour créer une phrase",
    startSentence: "Commencez à construire votre phrase...",
    inputPlaceholder: "Entrez UN mot...",
    addWord: "Ajouter un mot",
    makeGuess: "Deviner",
    aiThinking: "L'IA réfléchit...",
    aiDelayed: "L'IA est actuellement occupée. Veuillez réessayer dans un moment.",
    invalidWord: "Mot invalide",
    cantUseTargetWord: "N'utilisez pas le mot secret",
    shorterWord: "Utilisez un mot plus court",
    lettersOnly: "Veuillez utiliser uniquement des lettres",
    singleWordOnly: "Veuillez entrer un seul mot",
    leaveGameTitle: "Quitter le jeu ?",
    leaveGameDescription: "Votre progression actuelle sera perdue. Êtes-vous sûr de vouloir quitter ?",
    cancel: "Annuler",
    confirm: "Confirmer",
    describeWord: "Votre objectif est de décrire le mot",
    nextRound: "Tour Suivant",
    playAgain: "Rejouer",
    saveScore: "Sauvegarder le Score",
    review: {
      title: "Résumé de la Partie",
      successfulRounds: "Manches Réussies",
      description: "Voici vos résultats :",
      playAgain: "Rejouer",
      saveScore: "Sauvegarder le Score",
      shareGame: "Partager",
      urlCopied: "URL copiée !",
      urlCopiedDesc: "Partagez cette URL avec vos amis pour qu'ils jouent avec les mêmes mots",
      urlCopyError: "Échec de la copie de l'URL",
      urlCopyErrorDesc: "Veuillez essayer de copier l'URL manuellement",
      youWin: "Vous avez gagné !",
      youLost: "Vous avez perdu !",
      friendScore: (score: number, avgWords: string) =>
        `La personne qui vous a défié a complété ${score} manches avec une moyenne de ${avgWords} mots.`,
      word: "Mot",
      yourWords: "Vous",
      friendWords: "Ami",
      result: "Résultat",
      details: "Détails",
      yourDescription: "Votre Description",
      friendDescription: "Description de l'Ami",
      aiGuessed: "L'IA a deviné",
      words: "Mots"
    },
    invitation: {
      title: "Invitation au Jeu",
      description: "Hey, tu as été invité à jouer. Joue maintenant pour découvrir comment tu te débrouilles avec les mêmes mots !"
    },
    error: {
      title: "Le jeu n'a pas pu être démarré",
      description: "Veuillez réessayer dans un moment."
    }
  },
  leaderboard: {
    title: "Meilleurs Scores",
    yourScore: "Votre Score",
    roundCount: "tours",
    wordsPerRound: "mots par tour",
    enterName: "Entrez votre nom",
    submitting: "Envoi en cours...",
    submit: "Soumettre le Score",
    rank: "Rang",
    player: "Joueur",
    roundsColumn: "Tours",
    avgWords: "Moy. Mots",
    noScores: "Pas encore de scores",
    previous: "Précédent",
    next: "Suivant",
    success: "Score soumis avec succès !",
    theme: "Thème",
    actions: "Actions",
    playSameWords: "Jouer avec les mêmes mots",
    modes: {
      daily: "Défi du Jour",
      "all-time": "Historique"
    },
    error: {
      invalidName: "Veuillez entrer un nom valide",
      noRounds: "Vous devez compléter au moins un tour",
      alreadySubmitted: "Score déjà soumis",
      newHighScore: "Nouveau Record !",
      beatRecord: "Vous avez battu votre record précédent de {score} !",
      notHigher: "Score de {current} pas plus élevé que votre meilleur de {best}",
      submitError: "Erreur lors de la soumission du score"
    }
  },
  guess: {
    title: "Devinette de l'IA",
    goalDescription: "Votre objectif était de décrire le mot",
    providedDescription: "Vous avez fourni la description",
    aiGuessedDescription: "Sur la base de cette description, l'IA a deviné",
    correct: "C'est correct !",
    incorrect: "C'est incorrect.",
    nextRound: "Tour Suivant",
    playAgain: "Rejouer",
    viewLeaderboard: "Voir les Scores",
    cheatingDetected: "Tentative de triche détectée !"
  },
  themes: {
    title: "Choisissez un Thème",
    subtitle: "Sélectionnez un thème pour le mot que l'IA essaiera de deviner",
    standard: "Standard",
    technology: "Technologie",
    sports: "Sports",
    food: "Nourriture",
    custom: "Thème Personnalisé",
    customPlaceholder: "Entrez votre thème personnalisé...",
    continue: "Continuer",
    generating: "Génération...",
    pressKey: "Appuyez sur",
    playing: "Thème"
  },
  welcome: {
    title: "Think in Sync",
    subtitle: "Collaborez avec une IA pour créer un indice, puis laissez-en une autre deviner votre mot secret !",
    startButton: "Commencer",
    startDailyButton: "Défi du Jour",
    startNewButton: "Nouvelle Partie",
    dailyLeaderboard: "Classement du jour",
    howToPlay: "Comment Jouer",
    leaderboard: "Classement",
    credits: "Créé pendant le",
    likeGameText: "Si vous voulez soutenir ce jeu,",
    contest: {
      prize: "Nous préparons quelque chose...",
      terms: "En savoir plus",
      howTo: "Pour prendre de l'avance sur nos plans :",
      conditions: [
        "Jouez à Think in Sync avec la liste de mots standard",
        "Utilisez votre nom d'utilisateur Hugging Face dans le classement",
        "Aimez notre projet sur Hugging Face"
      ],
      deadline: "Nous annoncerons bientôt les détails ici",
      prizes: {
        title: "Participez pour les 5 premières places et gagnez :",
        list: [
          "🥇 1er : 50€",
          "🥈 2ème : 20€",
          "🥉 3ème : 10€",
          "🎖️ 4ème & 5ème : 10€ chacun"
        ]
      },
      fairPlay: "🚨 Le fair-play est surveillé. Toute triche entraînera une disqualification !"
    },
    likeOnHuggingface: "Aimer sur Hugging Face"
  },
  howToPlay: {
    setup: {
      title: "Mise en place",
      description: "Choisissez un thème et obtenez un mot secret que l'IA essaiera de deviner."
    },
    goal: {
      title: "Objectif",
      description: "Construisez des phrases avec l'IA qui décrivent votre mot sans l'utiliser directement."
    },
    rules: {
      title: "Règles",
      items: [
        "Ajoutez des mots à tour de rôle pour construire des phrases descriptives",
        "N'utilisez pas le mot secret ou ses variations",
        "Soyez créatif et descriptif",
        "L'IA essaiera de deviner votre mot après chaque phrase"
      ]
    }
  }
};
