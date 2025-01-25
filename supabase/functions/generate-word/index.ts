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
                    Your task is to find a sentence to describe this word without using it directly. 
                    Answer with a complete, grammatically correct sentence that starts with "${currentSentence.join(' ')}".
                    Do not add quotes or backticks. Just answer with the sentence.`
        }
      ],
      maxTokens: 10,
      temperature: 0.7
    });

    const aiResponse = response.choices[0].message.content.trim();
    console.log('AI full response:', aiResponse);
    
    // Extract the new word by comparing with the existing sentence
    const existingWords = currentSentence.join(' ');
    const newWord = aiResponse
      .slice(existingWords.length)
      .trim()
      .split(' ')[0]
      .replace(/[.,!?]$/, ''); // Remove any punctuation at the end
    
    console.log('Extracted new word:', newWord);

    return new Response(
      JSON.stringify({ word: newWord }),
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