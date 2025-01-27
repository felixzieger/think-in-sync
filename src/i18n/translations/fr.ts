export const fr = {
  welcome: {
    title: "Penser en Sync",
    subtitle: "Dans ce jeu, vous faites équipe avec l'IA pour deviner des mots secrets !",
    startButton: "Commencer",
    howToPlay: "Comment Jouer",
    leaderboard: "Classement",
    credits: "Créé par Sandro, Alessandro, Mattia, Michael, Emiliano et Felix lors du",
    helpWin: "Aidez-nous à gagner un prix en",
    onHuggingface: "notre projet sur huggingface"
  },
  howToPlay: {
    setup: {
      title: "La Configuration",
      description: "Vous travaillerez avec deux IA : une comme partenaire donnant des indices, et une autre essayant de deviner le mot."
    },
    goal: {
      title: "Votre Objectif",
      description: "Aidez l'IA à deviner le mot secret en utilisant des indices d'un seul mot. Chaque devinette correcte vous rapporte un point !"
    },
    rules: {
      title: "Les Règles",
      items: [
        "Un seul mot par indice",
        "Pas de parties du mot secret ni de traductions",
        "Les indices doivent être liés au mot (soyez créatif !)",
        "Ne pas épeler la réponse"
      ]
    }
  },
  game: {
    buildDescription: "Construire une Description",
    buildSubtitle: "Alternez avec l'IA pour décrire votre mot sans utiliser le mot lui-même !",
    startSentence: "Commencez votre phrase...",
    inputPlaceholder: "Entrez votre mot (lettres uniquement)...",
    addWord: "Ajouter un Mot",
    makeGuess: "Faire Deviner l'IA",
    aiThinking: "L'IA réfléchit...",
    aiDelayed: "L'IA est actuellement occupée. Veuillez réessayer dans un moment.",
    invalidWord: "Mot Invalide",
    cantUseTargetWord: "Vous ne pouvez pas utiliser des mots qui contiennent",
    lettersOnly: "Veuillez utiliser uniquement des lettres (pas de chiffres ni de caractères spéciaux)"
  },
  guess: {
    title: "Devinette de l'IA",
    sentence: "Votre phrase",
    aiGuessed: "L'IA a deviné",
    correct: "Devinette correcte ! 🎉 Prêt pour le prochain tour ? Appuyez sur Entrée",
    incorrect: "Partie terminée ! Appuyez sur Entrée pour rejouer",
    nextRound: "Tour Suivant",
    playAgain: "Rejouer",
    viewLeaderboard: "Voir le Classement"
  },
  gameOver: {
    title: "Partie Terminée !",
    completedRounds: "Vous avez complété {count} tours avec succès !",
    playAgain: "Rejouer"
  },
  themes: {
    title: "Choisir un Thème",
    subtitle: "Sélectionnez un thème pour votre aventure de devinettes",
    standard: "",
    technology: "Technologie",
    sports: "Sports",
    food: "Nourriture",
    custom: "Choisissez votre thème",
    customPlaceholder: "Entrez un thème (ex: Animaux, Films)",
    continue: "Continuer",
    generating: "Génération des mots thématiques...",
    pressKey: "Appuyez sur"
  },
  leaderboard: {
    title: "Classement",
    yourScore: "Votre score",
    roundCount: "tours",
    wordsPerRound: "mots/tour",
    enterName: "Entrez votre nom (lettres et chiffres uniquement)",
    submit: "Soumettre le Score",
    submitting: "Soumission...",
    rank: "Rang",
    player: "Joueur",
    roundsColumn: "Tours",
    avgWords: "Moy. Mots/Tour",
    noScores: "Pas encore de scores. Soyez le premier !",
    previous: "Précédent",
    next: "Suivant",
    error: {
      invalidName: "Veuillez entrer un nom valide (uniquement lettres et chiffres)",
      noRounds: "Vous devez compléter au moins un tour pour soumettre un score",
      alreadySubmitted: "Vous avez déjà soumis votre score pour cette partie",
      newHighScore: "Nouveau Record !",
      beatRecord: "Vous avez battu votre record précédent de {score} tours !",
      notHigher: "Votre score actuel ({current}) n'est pas supérieur à votre meilleur score ({best})",
      submitError: "Échec de la soumission du score. Veuillez réessayer."
    }
  }
};
