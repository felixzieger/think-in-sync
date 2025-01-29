export const es = {
  leaderboard: {
    title: "Puntuaciones Altas",
    yourScore: "Tu Puntuación",
    roundCount: "rondas",
    wordsPerRound: "palabras por ronda",
    enterName: "Ingresa tu nombre",
    submitting: "Enviando...",
    submit: "Enviar Puntuación",
    rank: "Rango",
    player: "Jugador",
    roundsColumn: "Rondas",
    avgWords: "Promedio Palabras",
    noScores: "Aún no hay puntuaciones altas",
    previous: "Anterior",
    next: "Siguiente",
    success: "¡Puntuación enviada con éxito!",
    error: {
      invalidName: "Por favor ingresa un nombre válido (solo letras y números)",
      noRounds: "Debes completar al menos una ronda",
      alreadySubmitted: "Ya has enviado tu puntuación",
      submitError: "Error al enviar la puntuación"
    }
  },
  welcome: {
    title: "Improvisación Descriptiva",
    subtitle: "Un juego de adivinanzas donde colaboras con la IA",
    startButton: "Comenzar Juego",
    howToPlay: "Cómo Jugar",
    leaderboard: "Tabla de Posiciones",
    likeOnHuggingface: "Me gusta en Huggingface",
    contest: {
      prize: "¡Gana hasta $3,000 en premios!",
      terms: "Términos del Concurso",
      howTo: "Cómo participar en el concurso:",
      conditions: [
        "Juega y envía tus puntuaciones altas",
        "Dale me gusta al proyecto en Huggingface",
        "Los ganadores serán seleccionados según las puntuaciones más altas"
      ],
      termsDetails: "El concurso dura hasta el 31 de marzo de 2024. Los ganadores serán notificados por correo electrónico."
    }
  },
  game: {
    title: "Improvisación Descriptiva",
    round: "Ronda",
    describeWord: "Describe esta palabra sin usarla:",
    inputPlaceholder: "Ingresa una palabra...",
    addWord: "Agregar Palabra",
    makeGuess: "Hacer Adivinanza",
    aiThinking: "La IA está pensando...",
    aiDelayed: "La IA está tardando más de lo usual. Por favor espera...",
    singleWordOnly: "Por favor ingresa solo una palabra",
    cantUseTargetWord: "No puedes usar la palabra objetivo",
    lettersOnly: "Por favor usa solo letras",
    leaveGameTitle: "¿Salir del Juego?",
    leaveGameDescription: "Tu progreso se perderá si sales ahora.",
    cancel: "Cancelar",
    confirm: "Confirmar"
  },
  guess: {
    nextRound: "Siguiente Ronda",
    viewLeaderboard: "Ver Tabla de Posiciones",
    playAgain: "Jugar de Nuevo",
    providedDescription: "Tu descripción:",
    aiGuessedDescription: "La IA adivinó:"
  },
  themes: {
    title: "Elige un Tema",
    subtitle: "Selecciona un tema para tus palabras:",
    standard: "Palabras Estándar",
    sports: "Deportes",
    food: "Comida y Bebidas",
    custom: "Tema Personalizado",
    customPlaceholder: "Ingresa tu tema...",
    pressKey: "Presiona",
    continue: "Continuar",
    generating: "Generando..."
  },
  howToPlay: {
    setup: {
      title: "Configuración",
      description: "Elige un tema y obtén una palabra secreta."
    },
    goal: {
      title: "Objetivo",
      description: "Ayuda a la IA a adivinar tu palabra proporcionando palabras descriptivas."
    },
    rules: {
      title: "Reglas",
      items: [
        "Agrega una palabra a la vez",
        "No uses la palabra secreta",
        "Sé creativo con tus descripciones",
        "Intenta usar la menor cantidad de palabras posible"
      ]
    }
  }
} as const;