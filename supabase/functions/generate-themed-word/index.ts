import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Mistral } from 'npm:@mistralai/mistralai';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { theme, usedWords = [], language = 'en' } = await req.json();
    console.log('Generating word for theme:', theme, 'language:', language, 'excluding:', usedWords);

    const client = new Mistral({
      apiKey: Deno.env.get('MISTRAL_API_KEY'),
    });

    const languageInstructions = {
      en: "Generate a single word in English",
      fr: "Générez un seul mot en français",
      de: "Generieren Sie ein einzelnes Wort auf Deutsch",
      it: "Genera una singola parola in italiano",
      es: "Genera una sola palabra en español"
    };

    const response = await client.chat.complete({
      model: "mistral-large-latest",
      messages: [
        {
          role: "system",
          content: `You are helping generate words for a word-guessing game. ${languageInstructions[language]} related to the theme "${theme}". 
          The word should be:
          - A single word (no spaces or hyphens)
          - Common enough that people would know it
          - Specific enough to be interesting
          - Related to the theme "${theme}"
          - Between 4 and 12 letters
          - A noun
          - NOT be any of these previously used words: ${usedWords.join(', ')}
          
          Respond with just the word in UPPERCASE, nothing else.`
        }
      ],
      maxTokens: 10,
      temperature: 0.9
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
    console.error('Error generating themed word:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
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