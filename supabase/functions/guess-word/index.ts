import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Mistral } from "npm:@mistralai/mistralai";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const languagePrompts = {
  en: {
    systemPrompt: "You are playing a word guessing game in English. Given a descriptive sentence, your task is to guess the single word being described.",
    instruction: "Based on this description, what single word is being described:"
  },
  fr: {
    systemPrompt: "Vous jouez à un jeu de devinettes de mots en français. À partir d'une phrase descriptive, votre tâche est de deviner le mot unique décrit.",
    instruction: "D'après cette description, quel mot unique est décrit :"
  },
  de: {
    systemPrompt: "Sie spielen ein Worträtselspiel auf Deutsch. Anhand eines beschreibenden Satzes ist es Ihre Aufgabe, das beschriebene einzelne Wort zu erraten.",
    instruction: "Welches einzelne Wort wird basierend auf dieser Beschreibung beschrieben:"
  },
  it: {
    systemPrompt: "Stai giocando a un gioco di indovinelli in italiano. Data una frase descrittiva, il tuo compito è indovinare la singola parola descritta.",
    instruction: "In base a questa descrizione, quale singola parola viene descritta:"
  },
  es: {
    systemPrompt: "Estás jugando a un juego de adivinanzas de palabras en español. Dada una frase descriptiva, tu tarea es adivinar la única palabra que se describe.",
    instruction: "Según esta descripción, ¿qué palabra única se está describiendo:"
  }
};

serve(async (req) => {
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
          maxTokens: 50,
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