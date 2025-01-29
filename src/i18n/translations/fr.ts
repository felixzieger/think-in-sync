export const fr = {
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
    noScores: "Pas encore de meilleurs scores",
    previous: "Précédent",
    next: "Suivant",
    success: "Score soumis avec succès !",
    error: {
      invalidName: "Veuillez entrer un nom valide (lettres et chiffres uniquement)",
      noRounds: "Vous devez compléter au moins un tour",
      alreadySubmitted: "Vous avez déjà soumis votre score",
      submitError: "Erreur lors de la soumission du score"
    }
  },
  welcome: {
    title: "Impro Description",
    subtitle: "Un jeu de devinettes où vous collaborez avec l'IA",
    startButton: "Commencer le Jeu",
    howToPlay: "Comment Jouer",
    leaderboard: "Classement",
    likeOnHuggingface: "Aimer sur Huggingface",
    contest: {
      prize: "Gagnez jusqu'à 3 000 $ de prix !",
      terms: "Conditions du Concours",
      howTo: "Comment participer au concours :",
      conditions: [
        "Jouez et soumettez vos meilleurs scores",
        "Aimez le projet sur Huggingface",
        "Les gagnants seront sélectionnés selon les meilleurs scores"
      ],
      termsDetails: "Le concours se termine le 31 mars 2024. Les gagnants seront notifiés par email."
    }
  },
  game: {
    title: "Impro Description",
    round: "Tour",
    describeWord: "Décrivez ce mot sans l'utiliser :",
    inputPlaceholder: "Entrez un mot...",
    addWord: "Ajouter un Mot",
    makeGuess: "Faire une Supposition",
    aiThinking: "L'IA réfléchit...",
    aiDelayed: "L'IA prend plus de temps que d'habitude. Veuillez patienter...",
    singleWordOnly: "Veuillez entrer un seul mot",
    cantUseTargetWord: "Vous ne pouvez pas utiliser le mot cible",
    lettersOnly: "Veuillez utiliser uniquement des lettres",
    leaveGameTitle: "Quitter le Jeu ?",
    leaveGameDescription: "Votre progression sera perdue si vous quittez maintenant.",
    cancel: "Annuler",
    confirm: "Confirmer"
  },
  guess: {
    nextRound: "Tour Suivant",
    viewLeaderboard: "Voir le Classement",
    playAgain: "Rejouer",
    providedDescription: "Votre description :",
    aiGuessedDescription: "L'IA a deviné :"
  },
  themes: {
    title: "Choisissez un Thème",
    subtitle: "Sélectionnez un thème pour vos mots :",
    standard: "Mots Standard",
    sports: "Sports",
    food: "Nourriture et Boissons",
    custom: "Thème Personnalisé",
    customPlaceholder: "Entrez votre thème...",
    pressKey: "Appuyez",
    continue: "Continuer",
    generating: "Génération..."
  },
  howToPlay: {
    setup: {
      title: "Configuration",
      description: "Choisissez un thème et obtenez un mot secret."
    },
    goal: {
      title: "Objectif",
      description: "Aidez l'IA à deviner votre mot en fournissant des mots descriptifs."
    },
    rules: {
      title: "Règles",
      items: [
        "Ajoutez un mot à la fois",
        "N'utilisez pas le mot secret",
        "Soyez créatif avec vos descriptions",
        "Essayez d'utiliser le moins de mots possible"
      ]
    }
  }
} as const;