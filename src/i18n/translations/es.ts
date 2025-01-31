import { Language } from "@/i18n/translations";

export const es = {
  leaderboard: {
    title: "Puntuaciones Más Altas",
    titleGame: "Puntuaciones del Juego",
    yourScore: "Tu puntuación",
    roundCount: "rondas",
    wordsPerRound: "palabras por ronda",
    enterName: "Ingresa tu nombre",
    submitting: "Enviando...",
    submit: "Enviar Puntuación",
    rank: "Posición",
    player: "Jugador",
    roundsColumn: "Rondas",
    avgWords: "Prom. Palabras",
    themeColumn: "Tema",
    success: "¡Puntuación enviada con éxito!",
    error: {
      invalidName: "Por favor ingresa un nombre válido (solo letras, números y guiones)",
      noRounds: "Debes completar al menos una ronda para enviar una puntuación",
      alreadySubmitted: "Ya has enviado una puntuación para esta sesión",
      submitError: "Error al enviar la puntuación. Por favor intenta de nuevo.",
    },
  },
} as const;
