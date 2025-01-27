import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Mistral } from "npm:@mistralai/mistralai";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { sentence, targetWord } = await req.json();
    console.log('Checking for fraud:', { sentence, targetWord });

    const client = new Mistral({
      apiKey: Deno.env.get('MISTRAL_API_KEY'),
    });

    const response = await client.chat.complete({
      model: "mistral-large-latest",
      messages: [
        {
          role: "system",
          content: `You are a fraud detection system for a word guessing game. 
          Your task is to detect if a player is trying to cheat by:
          1. Using a misspelling of the target word
          2. Writing a sentence without spaces to bypass word count checks
          3. Using variations or close synonyms of the target word
          
          Respond with ONLY "cheating" or "legitimate" (no punctuation or explanation).`
        },
        {
          role: "user",
          content: `Target word: "${targetWord}"
          Player's description: "${sentence}"
          
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
    console.error('Error in fraud detection:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});