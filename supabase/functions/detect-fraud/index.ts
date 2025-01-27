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
          model: "mistral-large-latest",
          messages: [
            {
              role: "system",
              content: `You are a fraud detection system for a word guessing game. 
              The game is being played in ${language}.
              Your task is to detect if a player is trying to cheat by:
              1. Using a misspelling of the target word
              2. Writing a sentence without spaces to bypass word count checks
              3. Using variations or close synonyms of the target word in ${language}
              
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
          maxTokens: 10,
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