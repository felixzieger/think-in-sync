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
    console.log('Starting daily challenge generation...');

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Deactivate current active challenge if exists
    console.log('Deactivating current active challenge...');
    const { error: deactivateError } = await supabase
      .from('daily_challenges')
      .update({ is_active: false })
      .eq('is_active', true);

    if (deactivateError) {
      console.error('Error deactivating current challenge:', deactivateError);
      throw deactivateError;
    }

    // Create new game for the daily challenge
    console.log('Creating new game for daily challenge...');
    const { data: gameData, error: gameError } = await supabase
      .from('games')
      .insert({
        theme: 'standard',
        words: Array(25).fill('').map(() => generateRandomWord()),
        language: 'en'
      })
      .select()
      .single();

    if (gameError) {
      console.error('Error creating game:', gameError);
      throw gameError;
    }

    // Create new daily challenge
    console.log('Creating new daily challenge entry...');
    const { data: challengeData, error: challengeError } = await supabase
      .from('daily_challenges')
      .insert({
        game_id: gameData.id,
        is_active: true
      })
      .select()
      .single();

    if (challengeError) {
      console.error('Error creating daily challenge:', challengeError);
      throw challengeError;
    }

    console.log('Daily challenge generated successfully:', challengeData);

    return new Response(
      JSON.stringify({ success: true, data: challengeData }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in generate-daily-challenge:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});

// Helper function to generate random words (simplified version)
function generateRandomWord(): string {
  const words = [
    'house', 'car', 'tree', 'book', 'computer',
    'phone', 'table', 'chair', 'window', 'door',
    'garden', 'flower', 'sun', 'moon', 'star',
    'ocean', 'mountain', 'river', 'forest', 'bird',
    'cat', 'dog', 'fish', 'rabbit', 'horse',
    'apple', 'banana', 'orange', 'grape', 'cherry'
  ];
  return words[Math.floor(Math.random() * words.length)];
}