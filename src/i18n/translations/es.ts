export const es = {
  welcome: {
    title: "Pensar en Sintonía",
    subtitle: "¡En este juego te unes a la IA para adivinar palabras secretas!",
    startButton: "Comenzar Juego",
    howToPlay: "Cómo Jugar",
    leaderboard: "Tabla de Posiciones"
  },
  howToPlay: {
    setup: {
      title: "La Configuración",
      description: "Trabajarás con dos IAs: una como compañera dando pistas y otra intentando adivinar la palabra."
    },
    goal: {
      title: "Tu Objetivo",
      description: "Ayuda a la IA a adivinar la palabra secreta usando pistas de una sola palabra. ¡Cada adivinanza correcta te da un punto!"
    },
    rules: {
      title: "Las Reglas",
      items: [
        "Solo una palabra por pista",
        "No usar partes de la palabra secreta ni traducciones",
        "Las pistas deben relacionarse con la palabra (¡sé creativo!)",
        "No deletrear la respuesta"
      ]
    }
  },
  game: {
    buildDescription: "Construye una Descripción",
    buildSubtitle: "¡Alterna con la IA para describir tu palabra sin usar la palabra misma!",
    startSentence: "Comienza tu frase...",
    inputPlaceholder: "Ingresa tu palabra (solo letras)...",
    addWord: "Agregar Palabra",
    makeGuess: "Hacer que la IA Adivine",
    aiThinking: "La IA está pensando...",
    aiDelayed: "La IA está ocupada en este momento. Por favor, inténtalo de nuevo en un momento.",
    invalidWord: "Palabra Inválida",
    cantUseTargetWord: "No puedes usar palabras que contengan",
    lettersOnly: "Por favor usa solo letras (sin números ni caracteres especiales)"
  },
  guess: {
    title: "Intento de la IA",
    sentence: "Tu frase",
    aiGuessed: "La IA adivinó",
    correct: "¡Adivinanza correcta! 🎉 ¿Listo para la siguiente ronda? Presiona Enter",
    incorrect: "¡Juego terminado! Presiona Enter para jugar de nuevo",
    nextRound: "Siguiente Ronda",
    playAgain: "Jugar de Nuevo",
    viewLeaderboard: "Ver Tabla de Posiciones"
  },
  gameOver: {
    title: "¡Juego Terminado!",
    completedRounds: "¡Completaste {count} rondas exitosamente!",
    playAgain: "Jugar de Nuevo"
  },
  themes: {
    title: "Elegir un Tema",
    subtitle: "Selecciona un tema para tu aventura de adivinanzas",
    standard: "",
    technology: "Tecnología",
    sports: "Deportes",
    food: "Comida",
    custom: "Elige tu tema",
    customPlaceholder: "Ingresa un tema (ej: Animales, Películas)",
    continue: "Continuar",
    generating: "Generando palabras temáticas...",
    pressKey: "Presiona"
  },
  leaderboard: {
    title: "Tabla de Posiciones",
    yourScore: "Tu puntaje",
    roundCount: "rondas",
    wordsPerRound: "palabras/ronda",
    enterName: "Ingresa tu nombre (solo letras y números)",
    submit: "Enviar Puntaje",
    submitting: "Enviando...",
    rank: "Posición",
    player: "Jugador",
    roundsColumn: "Rondas",
    avgWords: "Prom. Palabras/Ronda",
    noScores: "Aún no hay puntajes altos. ¡Sé el primero!",
    previous: "Anterior",
    next: "Siguiente",
    error: {
      invalidName: "Por favor ingresa un nombre válido (solo letras y números)",
      noRounds: "Necesitas completar al menos una ronda para enviar un puntaje",
      alreadySubmitted: "Ya has enviado tu puntaje para este juego",
      newHighScore: "¡Nuevo Récord!",
      beatRecord: "¡Superaste tu récord anterior de {score} rondas!",
      notHigher: "Tu puntaje actual ({current}) no es mayor que tu mejor puntaje ({best})",
      submitError: "Error al enviar el puntaje. Por favor intenta de nuevo."
    }
  }
};