import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Mistral } from "npm:@mistralai/mistralai";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const languagePrompts = {
  en: {
    systemPrompt: "You are helping in a word guessing game. Given a description, guess what single word is being described. The described word itself was not allowed in the description, so do not expect it to appear.",
    instruction: "Based on this description"
  },
  fr: {
    systemPrompt: "Vous aidez dans un jeu de devinettes. À partir d'une description, devinez le mot unique qui est décrit. Le mot décrit n'était pas autorisé dans la description, ne vous attendez donc pas à le voir apparaître.",
    instruction: "D'après cette description"
  },
  de: {
    systemPrompt: "Sie helfen bei einem Worträtsel. Erraten Sie anhand einer Beschreibung, welches einzelne Wort beschrieben wird. Das beschriebene Wort durfte nicht in der Beschreibung verwendet werden, also erwarten Sie es nicht.",
    instruction: "Basierend auf dieser Beschreibung"
  },
  it: {
    systemPrompt: "Stai aiutando in un gioco di indovinelli. Data una descrizione, indovina quale singola parola viene descritta. La parola descritta non era permessa nella descrizione, quindi non aspettarti di trovarla.",
    instruction: "Basandoti su questa descrizione"
  },
  es: {
    systemPrompt: "Estás ayudando en un juego de adivinanzas. Dada una descripción, adivina qué palabra única se está describiendo. La palabra descrita no estaba permitida en la descripción, así que no esperes verla.",
    instruction: "Basándote en esta descripción"
  }
};

const openRouterModels = [
  'sophosympatheia/rogue-rose-103b-v0.2:free',
  'google/gemini-2.0-flash-exp:free',
  'meta-llama/llama-3.1-70b-instruct:free',
  'microsoft/phi-3-medium-128k-instruct:free'
];

async function tryMistral(sentence: string, language: string) {
  const client = new Mistral({
    apiKey: Deno.env.get('MISTRAL_API_KEY'),
  });

  const prompts = languagePrompts[language as keyof typeof languagePrompts] || languagePrompts.en;

  const response = await client.chat.complete({
    model: "mistral-large-latest",
    messages: [
      {
        role: "system",
        content: `${prompts.systemPrompt} Respond with ONLY the word you think is being described, in uppercase letters. Do not add any explanation or punctuation.`
      },
      {
        role: "user",
        content: `${prompts.instruction} "${sentence}"`
      }
    ],
    maxTokens: 50,
    temperature: 0.1
  });

  return response.choices[0].message.content.trim().toUpperCase();
}

async function tryOpenRouter(sentence: string, language: string) {
  const prompts = languagePrompts[language as keyof typeof languagePrompts] || languagePrompts.en;
  const randomModel = openRouterModels[Math.floor(Math.random() * openRouterModels.length)];

  console.log('Trying OpenRouter with model:', randomModel);

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
          content: `${prompts.systemPrompt} Respond with ONLY the word you think is being described, in uppercase letters. Do not add any explanation or punctuation.`
        },
        {
          role: "user",
          content: `${prompts.instruction} "${sentence}"`
        }
      ]
    })
  });

  if (!response.ok) {
    throw new Error(`OpenRouter API error: ${response.status}`);
  }

  const data = await response.json();
  return data.choices[0].message.content.trim().toUpperCase();
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { sentence, language = 'en' } = await req.json();
    console.log('Trying to guess word from sentence:', sentence, 'language:', language);

    try {
      console.log('Attempting with Mistral...');
      const guess = await tryMistral(sentence, language);
      console.log('Successfully generated guess with Mistral:', guess);
      return new Response(
        JSON.stringify({ guess }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } catch (mistralError) {
      console.error('Mistral error:', mistralError);
      console.log('Falling back to OpenRouter...');
      
      const guess = await tryOpenRouter(sentence, language);
      console.log('Successfully generated guess with OpenRouter:', guess);
      return new Response(
        JSON.stringify({ guess }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
  } catch (error) {
    console.error('Error generating guess:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
