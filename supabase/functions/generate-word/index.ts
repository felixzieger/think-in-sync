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
    const { currentWord, currentSentence } = await req.json();
    console.log('Generating word for:', { currentWord, currentSentence });

    const client = new Mistral({
      apiKey: Deno.env.get('MISTRAL_API_KEY'),
    });

    const response = await client.chat.complete({
      model: "mistral-large-latest",
      messages: [
        {
          role: "system",
          content: `You are helping in a word game. The secret word is "${currentWord}". 
                    Your task is to add ONE word to help describe this word without using it directly. 
                    The words must form a correct sentence in English.
                    The current sentence is: "${currentSentence.join(' ')}". 
                    Respond with one appropriate word that continues the sentence naturally.
                    Do not add quotes or punctuation.`
        }
      ],
      maxTokens: 10,
      temperature: 0.7
    });

    const word = response.choices[0].message.content.trim().split(' ').pop().replace(/"/g, '');
    console.log('Generated word:', word);

    return new Response(
      JSON.stringify({ word }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
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