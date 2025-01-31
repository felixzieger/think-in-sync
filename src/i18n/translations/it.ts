import { Language } from "@/i18n/translations";

export const it = {
  leaderboard: {
    title: "Punteggi Migliori",
    titleGame: "Punteggi Migliori del Gioco",
    yourScore: "Il tuo punteggio",
    roundCount: "round",
    wordsPerRound: "parole per round",
    enterName: "Inserisci il tuo nome",
    submitting: "Invio in corso...",
    submit: "Invia Punteggio",
    rank: "Posizione",
    player: "Giocatore",
    roundsColumn: "Round",
    avgWords: "Media Parole",
    themeColumn: "Tema",
    success: "Punteggio inviato con successo!",
    error: {
      invalidName: "Inserisci un nome valido (solo lettere, numeri e trattini)",
      noRounds: "Devi completare almeno un round per inviare un punteggio",
      alreadySubmitted: "Hai già inviato un punteggio per questa sessione",
      submitError: "Errore durante l'invio del punteggio. Riprova.",
    },
  },
} as const;
