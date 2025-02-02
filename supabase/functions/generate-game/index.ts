import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { theme, wordCount = 10 } = await req.json();
    console.log('Generating game for theme:', theme, 'with word count:', wordCount);

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Generate words using existing generate-themed-word function
    const words: string[] = [];
    const usedWords: string[] = [];

    for (let i = 0; i < wordCount; i++) {
      try {
        const response = await fetch(`${supabaseUrl}/functions/v1/generate-themed-word`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${supabaseKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ theme, usedWords }),
        });

        if (!response.ok) {
          throw new Error(`Failed to generate word: ${response.statusText}`);
        }

        const data = await response.json();
        if (data.word) {
          words.push(data.word);
          usedWords.push(data.word);
        }
      } catch (error) {
        console.error('Error generating word:', error);
        throw error;
      }
    }

    // Insert new game into database
    const { data: game, error: insertError } = await supabase
      .from('games')
      .insert({
        theme,
        words,
      })
      .select()
      .single();

    if (insertError) {
      throw insertError;
    }

    console.log('Successfully created game:', game);

    return new Response(
      JSON.stringify(game),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in generate-game:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});