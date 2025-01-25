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
    const { sentence } = await req.json();
    console.log('Trying to guess word from sentence:', sentence);

    const client = new Mistral({
      apiKey: Deno.env.get('MISTRAL_API_KEY'),
    });

    const response = await client.chat.complete({
      model: "mistral-large-latest",
      messages: [
        {
          role: "system",
          content: `You are playing a word guessing game. Given a descriptive sentence, your task is to guess the single word being described.
                    Respond with ONLY the word you think is being described, in uppercase letters.
                    Do not add any explanation or punctuation.`
        },
        {
          role: "user",
          content: `Based on this description, what single word is being described: "${sentence}"`
        }
      ],
      maxTokens: 10,
      temperature: 0.2
    });

    const guess = response.choices[0].message.content.trim().toUpperCase();
    console.log('AI guess:', guess);

    return new Response(
      JSON.stringify({ guess }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
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