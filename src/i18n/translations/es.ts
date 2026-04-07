export const es = {
  app: {
    update: {
      title: "Actualización disponible",
      description: "Una nueva versión de Think in Sync está lista.",
      refresh: "Actualizar"
    }
  },
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
    nextRound: "Siguiente ronda",
    nextWord: "Siguiente palabra",
    playAgain: "Jugar de nuevo",
    saveScore: "Guardar Puntuación",
    playNewWords: "Jugar nuevas palabras",
    skipWord: "Saltar palabra",
    finishGame: "Terminar juego",
    review: {
      title: "Resumen del Juego",
      successfulRounds: "Rondas Exitosas",
      description: "Aquí están tus resultados:",
      playAgain: "Jugar las mismas palabras de nuevo",
      playNewWords: "Jugar nuevas palabras",
      saveScore: "Guardar Puntuación",
      shareGame: "Compartir",
      urlCopied: "¡URL copiada!",
      urlCopiedDesc: "Comparte esta URL con amigos para que jueguen con las mismas palabras",
      urlCopyError: "Error al copiar la URL",
      urlCopyErrorDesc: "Por favor, intenta copiar la URL manualmente",
      youWin: "¡Has ganado!",
      youLost: "¡Has perdido!",
      correct: "Correcto",
      wrong: "Incorrecto",
      total: "Total",
      friendScore: (score: number, avgWords: string) =>
        `La persona que te desafió completó ${score} rondas exitosamente con un promedio de ${avgWords} palabras.`,
      word: "Palabra",
      yourWords: "Tú",
      friendWords: "Amigo",
      result: "Resultado",
      details: "Detalles",
      yourDescription: "Tu descripción",
      friendDescription: "Descripción del amigo",
      aiGuessed: "IA adivinó",
      words: "Palabras",
      avgWords: "Promedio de palabras por ronda"
    },
    invitation: {
      title: "Invitación al Juego",
      description: "¡Hey, has sido invitado a jugar! ¡Juega ahora para descubrir qué tan bien lo haces con las mismas palabras!"
    },
    error: {
      title: "No se pudo iniciar el juego",
      description: "Por favor, inténtalo de nuevo en un momento."
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
    actions: "Acciones",
    playSameWords: "Jugar con las mismas palabras",
    scoreUpdated: "¡Puntuación actualizada!",
    scoreUpdatedDesc: "Tu puntuación anterior para este juego ha sido actualizada",
    scoreSubmitted: "¡Puntuación enviada!",
    scoreSubmittedDesc: "Tu puntuación ha sido añadida a la tabla de clasificación",
    modes: {
      daily: "Diario 10 de hoy",
      "all-time": "Histórico"
    },
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
    providedDescription: "proporcionaron la descripción",
    aiGuessedDescription: {
      prefix: "Basándose en esta descripción,",
      aiName: "la IA",
      suffix: "adivinó"
    },
    correct: "¡Esto es correcto!",
    incorrect: "Esto es incorrecto.",
    nextRound: "Siguiente Ronda",
    playAgain: "Jugar de Nuevo",
    viewLeaderboard: "Ver Clasificación",
    cheatingDetected: "¡Trampa detectada!",
    you: "Tú",
    and: "y",
    aiModel: "Modelo de IA"
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
    startDailyButton: "Jugar Diario 10",
    startNewButton: "Jugar Freestyle",
    dailyLeaderboard: "Ranking diario",
    howToPlay: "Cómo jugar",
    leaderboard: "Clasificación",
    credits: "Creado durante el",
    likeGameText: "Si quieres apoyar este juego",
    stats: {
      title: "Estadísticas",
      dailyGuesses: "Palabras adivinadas hoy",
      totalGuesses: "Total de palabras adivinadas",
      visitDashboard: "Visitar Dashboard"
    },
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
    },
    gameModes: {
      title: "Modos de Juego",
      daily: "Diario 10: La misma lista de palabras para todos, renovada cada 24 horas",
      custom: "Freestyle: Elige un tema y juega tu partida personal"
    }
  },
  models: {
    title: "Elige un Modelo de IA",
    subtitle: "Selecciona el modelo de IA que jugará contigo",
    continue: "Continuar",
    generating: "Generando...",
    custom: "Modelo Personalizado",
    searchPlaceholder: "Buscar un modelo...",
    loginRequired: "Por favor inicia sesión o regístrate para usar modelos personalizados"
  },
  auth: {
    login: {
      linkText: "Iniciar sesión",
      title: "Iniciar sesión",
      subtitle: "Inicia sesión en tu cuenta",
      email: "Correo electrónico",
      password: "Contraseña",
      submit: "Iniciar sesión",
      loggingIn: "Iniciando sesión...",
      noAccount: "¿No tienes una cuenta?",
      register: "Registrarse"
    },
    loginSuccess: {
      title: "Inicio de sesión exitoso",
      description: "Has iniciado sesión correctamente"
    },
    loginError: {
      title: "Error de inicio de sesión",
      description: "Ocurrió un error al intentar iniciar sesión"
    },
    register: {
      linkText: "Registrarse",
      title: "Registrarse",
      description: "Crea una nueva cuenta",
      email: "Correo electrónico",
      password: "Contraseña",
      confirmPassword: "Confirmar contraseña",
      submit: "Registrarse",
      registering: "Registrando...",
      haveAccount: "¿Ya tienes una cuenta?",
      login: "Iniciar sesión"
    },
    registerSuccess: {
      title: "Registro exitoso",
      description: "Tu cuenta ha sido creada exitosamente"
    },
    registerError: {
      title: "Error de registro",
      description: "Ocurrió un error al intentar registrarse"
    },
    logoutSuccess: {
      title: "Sesión cerrada",
      description: "Has cerrado la sesión correctamente"
    },
    form: {
      email: "Correo electrónico",
      password: "Contraseña",
      logout: "Cerrar sesión"
    }
  }
};
