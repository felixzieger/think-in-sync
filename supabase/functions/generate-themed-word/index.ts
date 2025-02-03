import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Mistral } from 'npm:@mistralai/mistralai';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const languagePrompts = {
  en: {
    systemPrompt: "You are helping generate words for a word-guessing game. Generate a single word in English related to the theme",
    requirements: "The word should be:\n- A single word (no spaces or hyphens)\n- Common enough that people would know it\n- Specific enough to be interesting\n- Related to the theme\n- Between 4 and 12 letters\n- A noun\n- NOT be any of these previously used words:"
  },
  fr: {
    systemPrompt: "Vous aidez à générer des mots pour un jeu de devinettes. Générez un seul mot en français lié au thème",
    requirements: "Le mot doit être :\n- Un seul mot (pas d'espaces ni de traits d'union)\n- Assez courant pour que les gens le connaissent\n- Suffisamment spécifique pour être intéressant\n- En rapport avec le thème\n- Entre 4 et 12 lettres\n- Un nom\n- NE PAS être l'un de ces mots déjà utilisés :"
  },
  de: {
    systemPrompt: "Sie helfen bei der Generierung von Wörtern für ein Worträtselspiel. Generieren Sie ein einzelnes Wort auf Deutsch zum Thema",
    requirements: "Das Wort sollte:\n- Ein einzelnes Wort sein (keine Leerzeichen oder Bindestriche)\n- Häufig genug, dass Menschen es kennen\n- Spezifisch genug, um interessant zu sein\n- Zum Thema passen\n- Zwischen 4 und 12 Buchstaben lang sein\n- Ein Substantiv sein\n- NICHT eines dieser bereits verwendeten Wörter sein:"
  },
  it: {
    systemPrompt: "Stai aiutando a generare parole per un gioco di indovinelli. Genera una singola parola in italiano legata al tema",
    requirements: "La parola deve essere:\n- Una singola parola (senza spazi o trattini)\n- Abbastanza comune da essere conosciuta\n- Sufficientemente specifica da essere interessante\n- Correlata al tema\n- Tra 4 e 12 lettere\n- Un sostantivo\n- NON essere una di queste parole già utilizzate:"
  },
  es: {
    systemPrompt: "Estás ayudando a generar palabras para un juego de adivinanzas. Genera una sola palabra en español relacionada con el tema",
    requirements: "La palabra debe ser:\n- Una sola palabra (sin espacios ni guiones)\n- Lo suficientemente común para que la gente la conozca\n- Lo suficientemente específica para ser interesante\n- Relacionada con el tema\n- Entre 4 y 12 letras\n- Un sustantivo\n- NO ser ninguna de estas palabras ya utilizadas:"
  },
  pt: {
    systemPrompt: "Estás ajudando a gerar palavras para um jogo de adivinhação. Gere uma única palavra em português relacionada ao tema",
    requirements: "A palavra deve ser:\n- Uma única palavra (sem espaços ou hífens)\n- Comum o suficiente para que as pessoas a conheçam\n- Específica o suficiente para ser interessante\n- Relacionada ao tema\n- Entre 4 e 12 letras\n- Um substantivo\n- NÃO ser nenhuma destas palavras já utilizadas:"
  }
};

const openRouterModels = [
  'sophosympatheia/rogue-rose-103b-v0.2:free',
  'google/gemini-2.0-flash-exp:free',
  'meta-llama/llama-3.1-70b-instruct:free',
  'microsoft/phi-3-medium-128k-instruct:free'
];

async function tryMistral(theme: string, usedWords: string[], language: string) {
  const mistralKey = Deno.env.get('MISTRAL_API_KEY');
  if (!mistralKey) {
    throw new Error('Mistral API key not configured');
  }

  const client = new Mistral({
    apiKey: mistralKey,
  });

  const prompts = languagePrompts[language as keyof typeof languagePrompts] || languagePrompts.en;

  const response = await client.chat.complete({
    model: "mistral-large-latest",
    messages: [
      {
        role: "system",
        content: `${prompts.systemPrompt} "${theme}".\n${prompts.requirements} ${usedWords.join(', ')}\n\nRespond with just the word in UPPERCASE, nothing else.`
      }
    ],
    maxTokens: 50,
    temperature: 0.99
  });

  if (!response?.choices?.[0]?.message?.content) {
    throw new Error('Invalid response from Mistral API');
  }

  return response.choices[0].message.content.trim();
}

async function tryOpenRouter(theme: string, usedWords: string[], language: string) {
  const openRouterKey = Deno.env.get('OPENROUTER_API_KEY');
  if (!openRouterKey) {
    throw new Error('OpenRouter API key not configured');
  }

  const prompts = languagePrompts[language as keyof typeof languagePrompts] || languagePrompts.en;
  const randomModel = openRouterModels[Math.floor(Math.random() * openRouterModels.length)];

  console.log('Trying OpenRouter with model:', randomModel);

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${openRouterKey}`,
      "HTTP-Referer": "https://think-in-sync.com",
      "X-Title": "Think in Sync",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: randomModel,
      messages: [
        {
          role: "system",
          content: `${prompts.systemPrompt} "${theme}".\n${prompts.requirements} ${usedWords.join(', ')}\n\nRespond with just the word in UPPERCASE, nothing else.`
        }
      ]
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenRouter API error: ${response.status} - ${errorText}`);
  }

  const data = await response.json();

  if (!data?.choices?.[0]?.message?.content) {
    throw new Error('Invalid response from OpenRouter API');
  }

  return data.choices[0].message.content.trim();
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { theme, usedWords = [], language = 'en' } = await req.json();
    console.log('Generating word for theme:', theme, 'language:', language, 'excluding:', usedWords);

    let word;
    let error;

    try {
      console.log('Attempting with Mistral...');
      word = await tryMistral(theme, usedWords, language);
      console.log('Successfully generated word with Mistral:', word);
    } catch (mistralError) {
      console.error('Mistral error:', mistralError);
      console.log('Falling back to OpenRouter...');

      try {
        word = await tryOpenRouter(theme, usedWords, language);
        console.log('Successfully generated word with OpenRouter:', word);
      } catch (openRouterError) {
        console.error('OpenRouter error:', openRouterError);
        error = openRouterError;
      }
    }

    if (!word) {
      return new Response(
        JSON.stringify({
          error: 'Failed to generate word with both Mistral and OpenRouter',
          details: error?.message || 'Unknown error'
        }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    return new Response(
      JSON.stringify({ word }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error generating themed word:', error);
    return new Response(
      JSON.stringify({
        error: 'Error generating themed word',
        details: error.message
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});