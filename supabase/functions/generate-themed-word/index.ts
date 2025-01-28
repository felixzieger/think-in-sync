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
  }
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const apiKey = Deno.env.get('MISTRAL_API_KEY');
    if (!apiKey) {
      console.error('MISTRAL_API_KEY is not set');
      throw new Error('MISTRAL_API_KEY is not configured');
    }

    const { theme, usedWords = [], language = 'en' } = await req.json();
    console.log('Generating word for theme:', theme, 'language:', language, 'excluding:', usedWords);

    const client = new Mistral({
      apiKey: apiKey,
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
      maxTokens: 15,
      temperature: 0.99
    });

    const word = response.choices[0].message.content.trim();
    console.log('Generated word:', word);

    return new Response(
      JSON.stringify({ word }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    );
  } catch (error) {
    console.error('Error in generate-themed-word function:', error);
    
    // Return a more detailed error response
    return new Response(
      JSON.stringify({ 
        error: `API error occurred: ${error.message}`,
        details: error.stack
      }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    );
  }
});