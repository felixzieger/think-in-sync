import { Language } from "@/i18n/translations";

export const fr = {
  leaderboard: {
    title: "Meilleurs Scores",
    titleGame: "Meilleurs Scores du Jeu",
    yourScore: "Votre score",
    roundCount: "manches",
    wordsPerRound: "mots par manche",
    enterName: "Entrez votre nom",
    submitting: "Envoi en cours...",
    submit: "Soumettre le Score",
    rank: "Rang",
    player: "Joueur",
    roundsColumn: "Manches",
    avgWords: "Moy. Mots",
    themeColumn: "Thème",
    success: "Score soumis avec succès !",
    error: {
      invalidName: "Veuillez entrer un nom valide (lettres, chiffres et traits d'union uniquement)",
      noRounds: "Vous devez terminer au moins une manche pour soumettre un score",
      alreadySubmitted: "Vous avez déjà soumis un score pour cette session",
      submitError: "Erreur lors de la soumission du score. Veuillez réessayer.",
    },
  },
} as const;
