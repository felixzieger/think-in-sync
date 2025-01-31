export const es = {
  game: {
    title: "Think in Sync",
    round: "Ronda",
    buildDescription: "Construyan una frase juntos",
    buildSubtitle: "Añadan palabras por turnos para crear una frase",
    startSentence: "Empieza a construir tu frase...",
    inputPlaceholder: "Ingresa UNA palabra...",
    addWord: "Añadir palabra",
    makeGuess: "Adivinar",
    aiThinking: "La IA está pensando...",
    aiDelayed: "La IA está ocupada en este momento. Por favor, inténtalo de nuevo en un momento.",
    invalidWord: "Palabra inválida",
    cantUseTargetWord: "No uses la palabra secreta",
    shorterWord: "Usa una palabra más corta",
    lettersOnly: "Por favor, usa solo letras",
    singleWordOnly: "Por favor, ingresa solo una palabra",
    leaveGameTitle: "¿Salir del juego?",
    leaveGameDescription: "Tu progreso actual se perderá. ¿Estás seguro de que quieres salir?",
    cancel: "Cancelar",
    confirm: "Confirmar",
    describeWord: "Tu objetivo es describir la palabra",
    nextRound: "Siguiente Ronda",
    playAgain: "Jugar de Nuevo",
    saveScore: "Guardar Puntuación",
    review: {
      title: "Resumen del Juego",
      successfulRounds: "Rondas Exitosas",
      description: "Aquí están tus resultados:",
      playAgain: "Jugar de Nuevo",
      saveScore: "Guardar Puntuación",
      shareGame: "Compartir",
      urlCopied: "¡URL copiada!",
      urlCopiedDesc: "Comparte esta URL con amigos para que jueguen con las mismas palabras",
      urlCopyError: "Error al copiar la URL",
      urlCopyErrorDesc: "Por favor, intenta copiar la URL manualmente",
      youWin: "¡Has ganado!",
      youLost: "¡Has perdido!",
      friendScore: (score: number, avgWords: string) =>
        `La persona que te desafió completó ${score} rondas exitosamente con un promedio de ${avgWords} palabras.`
    },
    invitation: {
      title: "Invitación al Juego",
      description: "¡Hey, has sido invitado a jugar! ¡Juega ahora para descubrir qué tan bien lo haces con las mismas palabras!"
    }
  },
  leaderboard: {
    title: "Puntuaciones Más Altas",
    yourScore: "Tu Puntuación",
    roundCount: "rondas",
    wordsPerRound: "palabras por ronda",
    enterName: "Ingresa tu nombre",
    submitting: "Enviando...",
    submit: "Enviar Puntuación",
    rank: "Posición",
    player: "Jugador",
    roundsColumn: "Rondas",
    avgWords: "Prom. Palabras",
    noScores: "Aún no hay puntuaciones",
    previous: "Anterior",
    next: "Siguiente",
    success: "¡Puntuación enviada con éxito!",
    theme: "Tema",
    error: {
      invalidName: "Por favor, ingresa un nombre válido",
      noRounds: "Debes completar al menos una ronda",
      alreadySubmitted: "Puntuación ya enviada",
      newHighScore: "¡Nueva Puntuación Más Alta!",
      beatRecord: "¡Has superado tu récord anterior de {score}!",
      notHigher: "Puntuación de {current} no superior a tu mejor de {best}",
      submitError: "Error al enviar la puntuación"
    }
  },
  guess: {
    title: "Suposición de la IA",
    goalDescription: "Tu objetivo era describir la palabra",
    providedDescription: "Proporcionaste la descripción",
    aiGuessedDescription: "Basado en tu descripción, la IA adivinó",
    correct: "¡Esto es correcto!",
    incorrect: "Esto es incorrecto.",
    nextRound: "Siguiente Ronda",
    playAgain: "Jugar de Nuevo",
    viewLeaderboard: "Ver Clasificación",
    cheatingDetected: "¡Trampa detectada!"
  },
  themes: {
    title: "Elige un Tema",
    subtitle: "Selecciona un tema para la palabra que la IA intentará adivinar",
    standard: "Estándar",
    technology: "Tecnología",
    sports: "Deportes",
    food: "Comida",
    custom: "Tema Personalizado",
    customPlaceholder: "Ingresa tu tema personalizado...",
    continue: "Continuar",
    generating: "Generando...",
    pressKey: "Presiona",
    playing: "Tema"
  },
  welcome: {
    title: "Think in Sync",
    subtitle: "¡Forma equipo con la IA para crear una pista y deja que otra IA adivine tu palabra secreta!",
    startButton: "Comenzar juego",
    howToPlay: "Cómo jugar",
    leaderboard: "Clasificación",
    credits: "Creado durante el",
    likeGameText: "Si quieres apoyar este juego",
    contest: {
      prize: "Estamos cocinando algo...",
      terms: "Descubre más",
      howTo: "Para adelantarte a lo que planeamos:",
      conditions: [
        "Juega Think in Sync usando la lista de palabras estándar",
        "Establece tu nombre en la tabla de clasificación igual a tu nombre de usuario de Hugging Face",
        "Dale me gusta a nuestro proyecto en Hugging Face"
      ],
      deadline: "Pronto anunciaremos los detalles aquí",
      prizes: {
        title: "Compite por los 5 primeros puestos y gana:",
        list: [
          "🥇 1º: 50€",
          "🥈 2º: 20€",
          "🥉 3º: 10€",
          "🎖️ 4º y 5º: 10€ cada uno"
        ]
      },
      fairPlay: "🚨 El juego limpio está monitoreado. ¡Cualquier trampa resultará en descalificación!"
    },
    likeOnHuggingface: "Me gusta en Hugging Face"
  },
  howToPlay: {
    setup: {
      title: "Preparación",
      description: "Elige un tema y obtén una palabra secreta que la IA intentará adivinar."
    },
    goal: {
      title: "Objetivo",
      description: "Construye frases junto con la IA que describan tu palabra sin usarla directamente."
    },
    rules: {
      title: "Reglas",
      items: [
        "Añade palabras por turnos para construir frases descriptivas",
        "No uses la palabra secreta o sus variaciones",
        "Sé creativo y descriptivo",
        "La IA intentará adivinar tu palabra después de cada frase"
      ]
    }
  }
};
