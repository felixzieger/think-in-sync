import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Mistral } from "npm:@mistralai/mistralai";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const languagePrompts = {
  en: {
    systemPrompt: "You are helping in a word game. The secret word is",
    task: "Your task is to find a sentence to describe this word without using it directly.",
    instruction: "Answer with a description for this word. Start your answer with"
  },
  fr: {
    systemPrompt: "Vous aidez dans un jeu de mots. Le mot secret est",
    task: "Votre tâche est de trouver une phrase pour décrire ce mot sans l'utiliser directement.",
    instruction: "Répondez avec une phrase qui commence par"
  },
  de: {
    systemPrompt: "Sie helfen bei einem Wortspiel. Das geheime Wort ist",
    task: "Ihre Aufgabe ist es, eine Beschreibung zu finden, der dieses Wort beschreibt, ohne es direkt zu verwenden.",
    instruction: "Beginnen sie ihre Antwort mit"
  },
  it: {
    systemPrompt: "Stai aiutando in un gioco di parole. La parola segreta è",
    task: "Il tuo compito è trovare una frase per descrivere questa parola senza usarla direttamente.",
    instruction: "Rispondi con una frase completa e grammaticalmente corretta che inizia con"
  },
  es: {
    systemPrompt: "Estás ayudando en un juego de palabras. La palabra secreta es",
    task: "Tu tarea es encontrar una frase para describir esta palabra sin usarla directamente.",
    instruction: "Responde con una frase completa y gramaticalmente correcta que comience con"
  }
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { currentWord, currentSentence, language = 'en' } = await req.json();
    console.log('Generating word for:', { currentWord, currentSentence, language });

    const existingSentence = currentSentence || '';
    const prompts = languagePrompts[language as keyof typeof languagePrompts] || languagePrompts.en;

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
              content: `${prompts.systemPrompt} "${currentWord}". ${prompts.task} ${prompts.instruction} "${existingSentence}". Do not add quotes or backticks. Just answer with the sentence.`
            }
          ],
          maxTokens: 300,
          temperature: 0.5
        });

        const aiResponse = response.choices[0].message.content.trim();
        console.log('AI full response:', aiResponse);
        
        const newWord = aiResponse
          .slice(existingSentence.length)
          .trim()
          .split(' ')[0]
          .replace(/[.,!?]$/, '');
        
        console.log('Extracted new word:', newWord);

        return new Response(
          JSON.stringify({ word: newWord }),
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
    console.error('Error generating word:', error);
    
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