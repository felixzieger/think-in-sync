export const pt = {
    game: {
        title: "Think in Sync",
        round: "Rodada",
        buildDescription: "Construam uma frase juntos",
        buildSubtitle: "Adicionem palavras alternadamente para criar uma frase",
        startSentence: "Comece a construir sua frase...",
        inputPlaceholder: "Insira UMA palavra...",
        addWord: "Adicionar palavra",
        makeGuess: "Adivinhar",
        aiThinking: "A IA está pensando...",
        aiDelayed: "A IA está ocupada no momento. Por favor, tente novamente mais tarde.",
        invalidWord: "Palavra inválida",
        cantUseTargetWord: "Não use a palavra secreta",
        shorterWord: "Use uma palavra mais curta",
        lettersOnly: "Por favor, use apenas letras",
        singleWordOnly: "Por favor, insira apenas uma palavra",
        leaveGameTitle: "Sair do jogo?",
        leaveGameDescription: "Seu progresso atual será perdido. Tem certeza de que deseja sair?",
        cancel: "Cancelar",
        confirm: "Confirmar",
        describeWord: "Seu objetivo é descrever a palavra",
        nextRound: "Próxima Rodada",
        playAgain: "Jogar Novamente",
        saveScore: "Salvar Pontuação",
        playNewWords: "Jogar novas palavras",
        skipWord: "Pular palavra",
        finishGame: "Terminar jogo",
        review: {
            title: "Resumo do Jogo",
            successfulRounds: "Rodadas Bem-sucedidas",
            description: "Aqui estão seus resultados:",
            playAgain: "Jogar as mesmas palavras novamente",
            playNewWords: "Jogar novas palavras",
            saveScore: "Salvar Pontuação",
            shareGame: "Compartilhar",
            urlCopied: "URL copiada!",
            urlCopiedDesc: "Compartilhe esta URL com amigos para que joguem com as mesmas palavras",
            urlCopyError: "Erro ao copiar a URL",
            urlCopyErrorDesc: "Por favor, tente copiar a URL manualmente",
            youWin: "Você ganhou!",
            youLost: "Você perdeu!",
            friendScore: (score: number, avgWords: string) =>
                `A pessoa que te desafiou completou ${score} rodadas com sucesso com uma média de ${avgWords} palavras.`,
            word: "Palavra",
            yourWords: "Você",
            friendWords: "Amigo",
            result: "Resultado",
            details: "Detalhes",
            yourDescription: "Sua Descrição",
            friendDescription: "Descrição do Amigo",
            aiGuessed: "A IA adivinhou",
            words: "Palavras"
        },
        invitation: {
            title: "Convite para o Jogo",
            description: "Ei, você foi convidado para jogar! Jogue agora para ver como se sai com as mesmas palavras!"
        },
        error: {
            title: "Não foi possível iniciar o jogo",
            description: "Por favor, tente novamente mais tarde."
        }
    },
    leaderboard: {
        title: "Maiores Pontuações",
        yourScore: "Sua Pontuação",
        roundCount: "rodadas",
        wordsPerRound: "palavras por rodada",
        enterName: "Insira seu nome",
        submitting: "Enviando...",
        submit: "Enviar Pontuação",
        rank: "Posição",
        player: "Jogador",
        roundsColumn: "Rodadas",
        avgWords: "Média de Palavras",
        noScores: "Ainda não há pontuações",
        previous: "Anterior",
        next: "Próximo",
        success: "Pontuação enviada com sucesso!",
        theme: "Tema",
        actions: "Ações",
        playSameWords: "Jogar com as mesmas palavras",
        scoreUpdated: "Pontuação atualizada!",
        scoreUpdatedDesc: "Sua pontuação anterior para este jogo foi atualizada",
        scoreSubmitted: "Pontuação enviada!",
        scoreSubmittedDesc: "Sua pontuação foi adicionada ao placar",
        modes: {
            daily: "Diário 10 de hoje",
            "all-time": "Histórico"
        },
        error: {
            invalidName: "Por favor, insira um nome válido",
            noRounds: "Você deve completar pelo menos uma rodada",
            alreadySubmitted: "Pontuação já enviada",
            newHighScore: "Nova Maior Pontuação!",
            beatRecord: "Você superou seu recorde anterior de {score}!",
            notHigher: "Pontuação de {current} não é superior à sua melhor pontuação de {best}",
            submitError: "Erro ao enviar a pontuação"
        }
    },
    guess: {
        title: "Suposição da IA",
        goalDescription: "Seu objetivo era descrever a palavra",
        providedDescription: "forneceram a descrição",
        aiGuessedDescription: {
            prefix: "Com base nesta descrição,",
            aiName: "a IA",
            suffix: "adivinhou"
        },
        correct: "Isso está correto!",
        incorrect: "Isso está incorreto.",
        nextRound: "Próxima Rodada",
        playAgain: "Jogar Novamente",
        viewLeaderboard: "Ver Placar",
        cheatingDetected: "Trapaça detectada!",
        you: "Você",
        and: "e",
        aiModel: "Modelo de IA"
    },
    themes: {
        title: "Escolha um Tema",
        subtitle: "Selecione um tema para a palavra que a IA tentará adivinhar",
        standard: "Padrão",
        technology: "Tecnologia",
        sports: "Esportes",
        food: "Comida",
        custom: "Tema Personalizado",
        customPlaceholder: "Insira seu tema personalizado...",
        continue: "Continuar",
        generating: "Gerando...",
        pressKey: "Pressione",
        playing: "Tema"
    },
    welcome: {
        title: "Think in Sync",
        subtitle: "Forme uma equipe com a IA para criar uma pista e deixe outra IA adivinhar sua palavra secreta!",
        startButton: "Iniciar jogo",
        startDailyButton: "Jogar Diário 10",
        startNewButton: "Novo Jogo",
        dailyLeaderboard: "Placar diário",
        howToPlay: "Como jogar",
        leaderboard: "Placar",
        credits: "Criado durante o",
        likeGameText: "Se você quiser apoiar este jogo",
        stats: {
            title: "Estatísticas",
            dailyGuesses: "Palavras adivinhadas hoje",
            totalGuesses: "Total de palavras adivinhadas",
            visitDashboard: "Visitar Dashboard"
        },
        contest: {
            prize: "Estamos preparando algo...",
            terms: "Descubra mais",
            howTo: "Para se antecipar ao que planejamos:",
            conditions: [
                "Jogue Pense em Sincronia usando a lista de palavras padrão",
                "Defina seu nome no placar igual ao seu nome de usuário no Hugging Face",
                "Curta nosso projeto no Hugging Face"
            ],
            deadline: "Em breve anunciaremos os detalhes aqui",
            prizes: {
                title: "Compita pelos 5 primeiros lugares e ganhe:",
                list: [
                    "🥇 1º: 50€",
                    "🥈 2º: 20€",
                    "🥉 3º: 10€",
                    "🎖️ 4º e 5º: 10€ cada"
                ]
            },
            fairPlay: "🚨 O jogo limpo está sendo monitorado. Qualquer trapaça resultará em desclassificação!"
        },
        likeOnHuggingface: "Curta no Hugging Face"
    },
    howToPlay: {
        setup: {
            title: "Preparação",
            description: "Escolha um tema e obtenha uma palavra secreta que a IA tentará adivinhar."
        },
        goal: {
            title: "Objetivo",
            description: "Construa frases junto com a IA que descrevam sua palavra sem usá-la diretamente."
        },
        rules: {
            title: "Regras",
            items: [
                "Adicione palavras alternadamente para construir frases descritivas",
                "Não use a palavra secreta ou suas variações",
                "Seja criativo e descritivo",
                "A IA tentará adivinhar sua palavra após cada frase"
            ]
        },
        gameModes: {
            title: "Modos de Jogo",
            daily: "Diário 10: A mesma lista de palavras para todos, atualizada a cada 24 horas",
            custom: "Novo Jogo: Escolha um tema e jogue seu jogo pessoal"
        }
    },
    models: {
        title: "Escolha um Modelo de IA",
        subtitle: "Selecione o modelo de IA que jogará com você",
        continue: "Continuar",
        generating: "Gerando...",
        custom: "Modelo Personalizado",
        searchPlaceholder: "Pesquisar um modelo...",
        loginRequired: "Por favor, faça login ou registre-se para usar modelos personalizados"
    },
    auth: {
        login: {
            linkText: "Entrar",
            title: "Entrar",
            subtitle: "Entre na sua conta",
            email: "Email",
            password: "Senha",
            submit: "Entrar",
            loggingIn: "Entrando...",
            noAccount: "Não tem uma conta?",
            register: "Registrar"
        },
        loginSuccess: {
            title: "Login bem-sucedido",
            description: "Você entrou com sucesso"
        },
        loginError: {
            title: "Falha no login",
            description: "Ocorreu um erro ao tentar fazer login"
        },
        register: {
            linkText: "Registrar",
            title: "Registrar",
            description: "Crie uma nova conta",
            email: "Email",
            password: "Senha",
            confirmPassword: "Confirmar senha",
            submit: "Registrar",
            registering: "Registrando...",
            haveAccount: "Já tem uma conta?",
            login: "Entrar"
        },
        registerSuccess: {
            title: "Registro bem-sucedido",
            description: "Sua conta foi criada com sucesso"
        },
        registerError: {
            title: "Falha no registro",
            description: "Ocorreu um erro ao tentar se registrar"
        },
        logoutSuccess: {
            title: "Desconectado",
            description: "Você foi desconectado com sucesso"
        },
        form: {
            email: "Email",
            password: "Senha",
            logout: "Sair"
        }
    }
};
