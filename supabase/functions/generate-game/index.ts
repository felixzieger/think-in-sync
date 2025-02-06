import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';
import * as Sentry from "https://deno.land/x/sentry/index.mjs";

Sentry.init({
  dsn: "https://ca41c3f96489cc1b3e69c9a44704f7ee@o4508722276007936.ingest.de.sentry.io/4508772265558096",
  defaultIntegrations: false,
  // Performance Monitoring
  tracesSampleRate: 1.0,
  // Set sampling rate for profiling - this is relative to tracesSampleRate
  profilesSampleRate: 1.0,
});

Sentry.setTag('region', Deno.env.get('SB_REGION'));
Sentry.setTag('execution_id', Deno.env.get('SB_EXECUTION_ID'));

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
        Sentry.captureException(error)
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
