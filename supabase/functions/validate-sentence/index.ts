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
    console.log('Validating sentence:', sentence);

    const client = new Mistral({
      apiKey: Deno.env.get('MISTRAL_API_KEY'),
    });

    const response = await client.chat.complete({
      model: "mistral-medium-latest",
      messages: [
        {
          role: "system",
          content: `You are an English language validator. Your task is to determine if the given sentence is grammatically correct and makes sense in English.
                    Respond with ONLY "true" or "false".`
        },
        {
          role: "user",
          content: `Is this a valid, grammatically correct English sentence that makes sense: "${sentence}"?`
        }
      ],
      maxTokens: 10,
      temperature: 0.1
    });

    const isValid = response.choices[0].message.content.trim().toLowerCase() === 'true';
    console.log('Sentence validation result:', isValid);

    return new Response(
      JSON.stringify({ isValid }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error validating sentence:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});