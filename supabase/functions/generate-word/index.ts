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

    // currentSentence is already a string from the client
    const existingSentence = currentSentence || '';

    const client = new Mistral({
      apiKey: Deno.env.get('MISTRAL_API_KEY'),
    });

    // Add retry logic with exponential backoff
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
              content: `You are helping in a word game. The secret word is "${currentWord}". 
                    Your task is to find a sentence to describe this word without using it directly. 
                    Answer with a complete, grammatically correct sentence that starts with "${existingSentence}".
                    Do not add quotes or backticks. Just answer with the sentence.`
            }
          ],
          maxTokens: 10,
          temperature: 0.7
        });

        const aiResponse = response.choices[0].message.content.trim();
        console.log('AI full response:', aiResponse);
        
        // Extract the new word by comparing with the existing sentence
        const newWord = aiResponse
          .slice(existingSentence.length)
          .trim()
          .split(' ')[0]
          .replace(/[.,!?]$/, ''); // Remove any punctuation at the end
        
        console.log('Extracted new word:', newWord);

        return new Response(
          JSON.stringify({ word: newWord }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      } catch (error) {
        console.error(`Attempt ${retryCount + 1} failed:`, error);
        lastError = error;
        
        // If it's a rate limit error, wait before retrying
        if (error.message?.includes('rate limit') || error.status === 429) {
          const waitTime = Math.pow(2, retryCount) * 1000; // Exponential backoff: 1s, 2s, 4s
          console.log(`Rate limit hit, waiting ${waitTime}ms before retry`);
          await new Promise(resolve => setTimeout(resolve, waitTime));
          retryCount++;
          continue;
        }
        
        // If it's not a rate limit error, throw immediately
        throw error;
      }
    }

    // If we've exhausted all retries
    throw new Error(`Failed after ${maxRetries} attempts. Last error: ${lastError?.message}`);

  } catch (error) {
    console.error('Error generating word:', error);
    
    // Provide a more user-friendly error message
    const errorMessage = error.message?.includes('rate limit') 
      ? "The AI service is currently busy. Please try again in a few moments."
      : "Sorry, there was an error generating the word. Please try again.";

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