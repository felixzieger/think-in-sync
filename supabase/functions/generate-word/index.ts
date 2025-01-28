import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Mistral } from "npm:@mistralai/mistralai";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const languagePrompts = {
  en: {
    systemPrompt: "You are helping in a word game. The secret word is",
    task: "Your task is to find a sentence to describe this word without using it directly.",
    instruction: "Answer with a description for this word. Start your answer with"
  },
  fr: {
    systemPrompt: "Vous aidez dans un jeu de mots. Le mot secret est",
    task: "Votre tâche est de trouver une phrase pour décrire ce mot sans l'utiliser directement.",
    instruction: "Répondez avec une phrase qui commence par"
  },
  de: {
    systemPrompt: "Sie helfen bei einem Wortspiel. Das geheime Wort ist",
    task: "Ihre Aufgabe ist es, eine Beschreibung zu finden, der dieses Wort beschreibt, ohne es direkt zu verwenden.",
    instruction: "Beginnen sie ihre Antwort mit"
  },
  it: {
    systemPrompt: "Stai aiutando in un gioco di parole. La parola segreta è",
    task: "Il tuo compito è trovare una frase per descrivere questa parola senza usarla direttamente.",
    instruction: "Rispondi con una frase completa e grammaticalmente corretta che inizia con"
  },
  es: {
    systemPrompt: "Estás ayudando en un juego de palabras. La palabra secreta es",
    task: "Tu tarea es encontrar una frase para describir esta palabra sin usarla directamente.",
    instruction: "Responde con una frase completa y gramaticalmente correcta que comience con"
  }
};

const openRouterModels = [
  'sophosympatheia/rogue-rose-103b-v0.2:free',
  'google/gemini-2.0-flash-exp:free',
  'meta-llama/llama-3.1-70b-instruct:free',
  'microsoft/phi-3-medium-128k-instruct:free'
];

async function tryMistral(currentWord: string, existingSentence: string, language: string) {
  const client = new Mistral({
    apiKey: Deno.env.get('MISTRAL_API_KEY'),
  });

  const prompts = languagePrompts[language as keyof typeof languagePrompts] || languagePrompts.en;

  const response = await client.chat.complete({
    model: "mistral-medium-latest",
    messages: [
      {
        role: "system",
        content: `${prompts.systemPrompt} "${currentWord}". ${prompts.task} ${prompts.instruction} "${existingSentence}". Do not add quotes or backticks. Just answer with the sentence.`
      }
    ],
    maxTokens: 300,
    temperature: 0.5
  });

  const aiResponse = response.choices[0].message.content.trim();
  console.log('Mistral full response:', aiResponse);
  
  return aiResponse
    .slice(existingSentence.length)
    .trim()
    .split(' ')[0]
    .replace(/[.,!?]$/, '');
}

async function tryOpenRouter(currentWord: string, existingSentence: string, language: string) {
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
          content: `${prompts.systemPrompt} "${currentWord}". ${prompts.task} ${prompts.instruction} "${existingSentence}". Do not add quotes or backticks. Just answer with the sentence.`
        }
      ]
    })
  });

  if (!response.ok) {
    throw new Error(`OpenRouter API error: ${response.status}`);
  }

  const data = await response.json();
  const aiResponse = data.choices[0].message.content.trim();
  console.log('OpenRouter full response:', aiResponse);
  
  return aiResponse
    .slice(existingSentence.length)
    .trim()
    .split(' ')[0]
    .replace(/[.,!?]$/, '');
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { currentWord, currentSentence, language = 'en' } = await req.json();
    console.log('Generating word for:', { currentWord, currentSentence, language });

    const existingSentence = currentSentence || '';

    try {
      console.log('Attempting with Mistral...');
      const word = await tryMistral(currentWord, existingSentence, language);
      console.log('Successfully generated word with Mistral:', word);
      return new Response(
        JSON.stringify({ word }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } catch (mistralError) {
      console.error('Mistral error:', mistralError);
      console.log('Falling back to OpenRouter...');
      
      const word = await tryOpenRouter(currentWord, existingSentence, language);
      console.log('Successfully generated word with OpenRouter:', word);
      return new Response(
        JSON.stringify({ word }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
  } catch (error) {
    console.error('Error generating word:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
