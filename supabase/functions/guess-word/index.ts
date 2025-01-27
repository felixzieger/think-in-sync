import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Mistral } from "npm:@mistralai/mistralai";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const languagePrompts = {
  en: {
    systemPrompt: "You are helping in a word guessing game. Given a description, guess what single word is being described.",
    instruction: "Based on this description"
  },
  fr: {
    systemPrompt: "Vous aidez dans un jeu de devinettes. À partir d'une description, devinez le mot unique qui est décrit.",
    instruction: "D'après cette description"
  },
  de: {
    systemPrompt: "Sie helfen bei einem Worträtsel. Erraten Sie anhand einer Beschreibung, welches einzelne Wort beschrieben wird.",
    instruction: "Basierend auf dieser Beschreibung"
  },
  it: {
    systemPrompt: "Stai aiutando in un gioco di indovinelli. Data una descrizione, indovina quale singola parola viene descritta.",
    instruction: "Basandoti su questa descrizione"
  },
  es: {
    systemPrompt: "Estás ayudando en un juego de adivinanzas. Dada una descripción, adivina qué palabra única se está describiendo.",
    instruction: "Basándote en esta descripción"
  }
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { sentence, language = 'en' } = await req.json();
    console.log('Trying to guess word from sentence:', sentence, 'language:', language);

    const client = new Mistral({
      apiKey: Deno.env.get('MISTRAL_API_KEY'),
    });

    const prompts = languagePrompts[language as keyof typeof languagePrompts] || languagePrompts.en;

    const maxRetries = 3;
    let retryCount = 0;
    let lastError = null;

    while (retryCount < maxRetries) {
      try {
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
          maxTokens: 10,
          temperature: 0.1
        });

        const guess = response.choices[0].message.content.trim().toUpperCase();
        console.log('AI guess:', guess);

        return new Response(
          JSON.stringify({ guess }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      } catch (error) {
        console.error(`Attempt ${retryCount + 1} failed:`, error);
        lastError = error;
        
        if (error.message?.includes('rate limit') || error.status === 429) {
          const waitTime = Math.pow(2, retryCount) * 1000;
          console.log(`Rate limit hit, waiting ${waitTime}ms before retry`);
          await new Promise(resolve => setTimeout(resolve, waitTime));
          retryCount++;
          continue;
        }
        
        throw error;
      }
    }

    throw new Error(`Failed after ${maxRetries} attempts. Last error: ${lastError?.message}`);

  } catch (error) {
    console.error('Error generating guess:', error);
    
    const errorMessage = error.message?.includes('rate limit') 
      ? "The AI service is currently busy. Please try again in a few moments."
      : "Sorry, there was an error generating the guess. Please try again.";

    return new Response(
      JSON.stringify({ 
        error: errorMessage,
        details: error.message 
      }),
      { 
        status: error.message?.includes('rate limit') ? 429 : 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});