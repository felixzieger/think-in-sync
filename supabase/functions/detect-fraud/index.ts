import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Mistral } from "npm:@mistralai/mistralai";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { sentence, targetWord, language } = await req.json();
    console.log('Checking for fraud:', { sentence, targetWord, language });

    const client = new Mistral({
      apiKey: Deno.env.get('MISTRAL_API_KEY'),
    });

    const maxRetries = 3;
    let retryCount = 0;
    let lastError = null;

    while (retryCount < maxRetries) {
      try {
        const response = await client.chat.complete({
          model: "mistral-medium-latest",
          messages: [
            {
              role: "system",
              content: `You are a fraud detection system for a word guessing game. 
              The game is being played in ${language}.
              Your task is to detect if a player is trying to cheat by one of two methods:
              1. The Player's description is a misspelling of the target word
              2. The Player's description is a sentence without spaces

              Examples for cheating:
                
              Target word: hand
              Player's description: hnd
              Language: en
              CORRECT ANSWER: cheating
            
              Target word: barfuß
              Player's description: germanwordforbarefoot
              Language: de
              CORRECT ANSWER: cheating

              Synonyms and names of instances of a class are legitimate descriptions.
                
              Target word: laptop
              Player's description: notebook
              Language: en
              CORRECT ANSWER: legitimate

              Target word: play
              Player's description: children often
              Language: en
              CORRECT ANSWER: legitimate
            
              Target word: Pfankuchen
              Player's description: Berliner
              Language: de
              CORRECT ANSWER: legitimate

              Target word: Burrito
              Player's description: Wrap
              Language: es
              CORRECT ANSWER: legitimate
            
              Respond with ONLY "cheating" or "legitimate" (no punctuation or explanation).`
            },
            {
              role: "user",
              content: `Target word: "${targetWord}"
              Player's description: "${sentence}"
              Language: ${language}
              
              Is this a legitimate description or an attempt to cheat?`
            }
          ],
          maxTokens: 20,
          temperature: 0.1
        });

        const verdict = response.choices[0].message.content.trim().toLowerCase();
        console.log('Fraud detection verdict:', verdict);

        return new Response(
          JSON.stringify({ verdict }),
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
    console.error('Error in fraud detection:', error);
    
    const errorMessage = error.message?.includes('rate limit') 
      ? "The AI service is currently busy. Please try again in a few moments."
      : "Sorry, there was an error checking for fraud. Please try again.";

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