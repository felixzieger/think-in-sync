
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import * as Sentry from "https://deno.land/x/sentry/index.mjs";

Sentry.init({
  dsn: "https://ca41c3f96489cc1b3e69c9a44704f7ee@o4508722276007936.ingest.de.sentry.io/4508772265558096",
  defaultIntegrations: false,
  tracesSampleRate: 1.0,
  profilesSampleRate: 1.0,
});

Sentry.setTag('region', Deno.env.get('SB_REGION'));
Sentry.setTag('execution_id', Deno.env.get('SB_EXECUTION_ID'));

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const languagePrompts = {
  en: {
    systemPrompt: "You are helping in a word guessing game. Given a description, guess what single word is being described. The word must be a singular noun. The described word itself was not allowed in the description, so do not expect it to appear.",
    instruction: "Based on this description",
    responseInstruction: "Respond with ONLY the word you think is being described, in uppercase letters. Do not add any explanation or punctuation. ONLY respond with ONE word, nothing else."
  },
  fr: {
    systemPrompt: "Vous aidez dans un jeu de devinettes. À partir d'une description, devinez le mot unique qui est décrit. Le mot doit être un nom commun au singulier. Le mot décrit n'était pas autorisé dans la description, ne vous attendez donc pas à le voir apparaître.",
    instruction: "D'après cette description",
    responseInstruction: "Répondez uniquement par le mot que vous pensez être décrit, en lettres majuscules. N'ajoutez aucune explication ni ponctuation. Répondez uniquement com um palavra, nada mais."
  },
  de: {
    systemPrompt: "Sie helfen bei einem Worträtsel. Erraten Sie anhand einer Beschreibung, welches einzelne Wort beschrieben wird. Das Wort muss ein Substantiv im Singular sein. Das beschriebene Wort durfte nicht in der Beschreibung verwendet werden, also erwarten Sie es nicht.",
    instruction: "Basierend auf dieser Beschreibung",
    responseInstruction: "Antworten Sie nur mit dem Wort, das Sie für beschrieben halten, in Großbuchstaben. Fügen Sie keine Erklärungen oder Satzzeichen hinzu. Antworten Sie nur mit einem Wort, nichts anderes."
  },
  it: {
    systemPrompt: "Stai aiutando in un gioco di indovinelli. Data una descrizione, indovina quale singola parola viene descritta. La parola deve essere un sostantivo singolare. La parola descritta non era permessa nella descrizione, quindi non aspettarti di trovarla.",
    instruction: "Basandoti su questa descrizione",
    responseInstruction: "Rispondi solo con la parola che pensi venga descritta, in lettere maiuscole. Non aggiungere spiegazioni o punteggiatura. Rispondi solo con una parola, nient'altro."
  },
  es: {
    systemPrompt: "Estás ayudando en un juego de adivinanzas. Dada una descripción, adivina qué palabra única se está describiendo. La palabra debe ser un sustantivo singular. La palabra descrita no estaba permitida en la descripción, así que no esperes verla.",
    instruction: "Basándote en esta descripción",
    responseInstruction: "Responde únicamente con la palabra que crees que se está describiendo, en letras mayúsculas. No añadas ninguna explicación ni puntuación. Responde únicamente con una palabra, nada más."
  },
  pt: {
    systemPrompt: "Estás ajudando em um jogo de adivinhação. Dada uma descrição, adivinha qual palavra única está sendo descrita. A palavra deve ser um substantivo singular. A palavra descrita não foi permitida na descrição, então não espere vê-la.",
    instruction: "Com base nesta descrição",
    responseInstruction: "Responda apenas com a palavra que você acredita estar sendo descrita, em letras maiúsculas. Não adicione nenhuma explicação nem pontuação. Responda apenas com uma palavra, nada mais."
  }
};

const openRouterModels = [
  'google/gemini-2.0-flash-exp:free',
  'meta-llama/llama-3.1-70b-instruct:free',
  'microsoft/phi-3-medium-128k-instruct:free',
  'deepseek/deepseek-chat:free',
];

async function generateGuess(sentence: string, language: string) {
  const prompts = languagePrompts[language as keyof typeof languagePrompts] || languagePrompts.en;
  const randomModel = openRouterModels[Math.floor(Math.random() * openRouterModels.length)];

  console.log('Using OpenRouter with model:', randomModel);

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${Deno.env.get('OPENROUTER_API_KEY')}`,
        "HTTP-Referer": "https://think-in-sync.com",
        "X-Title": "Think in Sync",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: randomModel,
        messages: [
          {
            role: "system",
            content: `${prompts.systemPrompt} ${prompts.responseInstruction}`
          },
          {
            role: "user",
            content: `${prompts.instruction} "${sentence}"`
          }
        ]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenRouter API error:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText
      });

      if (response.status === 402) {
        throw new Error('The AI service has reached its rate limit. Please try again in a few moments.');
      }

      throw new Error(`OpenRouter API error (${response.status}): ${errorText}`);
    }

    const data = await response.json();
    return {
      guess: data.choices[0].message.content.trim().toUpperCase(),
      model: randomModel
    };
  } catch (error) {
    console.error('Error in generateGuess:', error);
    // Re-throw with more user-friendly message if it's not already a custom error
    if (!error.message.includes('rate limit')) {
      throw new Error('Failed to generate guess. Please try again.');
    }
    throw error;
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { sentence, language = 'en' } = await req.json();
    console.log('Trying to guess word from sentence:', sentence, 'language:', language);

    const { guess, model } = await generateGuess(sentence, language);
    console.log('Successfully generated guess:', guess, 'using model:', model);

    return new Response(
      JSON.stringify({ guess, model }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    Sentry.captureException(error);
    console.error('Error generating guess:', error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message || 'An unexpected error occurred',
      }),
      {
        status: error.message.includes('rate limit') ? 429 : 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
