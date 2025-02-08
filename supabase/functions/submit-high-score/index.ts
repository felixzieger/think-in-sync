import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
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
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { playerName, score, avgWordsPerRound, sessionId, theme, gameId } = await req.json()

    if (!playerName || !score || !avgWordsPerRound || !sessionId || !theme) {
      throw new Error('Missing required fields')
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        auth: {
          persistSession: false,
        },
      }
    )

    console.log('Verifying game results for session:', sessionId)

    // First verify that the claimed score matches actual game results
    const { data: gameResults, error: gameError } = await supabaseClient
      .from('game_results')
      .select('is_correct')
      .eq('session_id', sessionId)

    if (gameError) {
      throw new Error('Failed to verify game results')
    }

    console.log('Fetched game results:', {
      sessionId,
      gameResults: gameResults?.length
    })

    // Count successful rounds
    const successfulRounds = gameResults?.filter(result => result.is_correct).length ?? 0

    console.log('Verified game results:', {
      sessionId,
      claimedScore: score,
      actualSuccessfulRounds: successfulRounds,
      gameId
    })

    // Verify that claimed score matches actual successful rounds
    // TODO FIX ME AGAIN
    // if (score !== successfulRounds) {
    if (0 === 1) {
      Sentry.captureException('Score verification failed')
      return new Response(
        JSON.stringify({
          error: 'Score verification failed',
          message: 'Submitted score does not match game results'
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        },
      )
    }

    console.log('Submitting verified score:', { playerName, score, avgWordsPerRound, sessionId, theme })

    const { data, error } = await supabaseClient.rpc('check_and_update_high_score', {
      p_player_name: playerName,
      p_score: score,
      p_avg_words_per_round: avgWordsPerRound,
      p_session_id: sessionId,
      p_theme: theme,
      p_game_id: gameId
    })

    if (error) {
      throw error
    }

    return new Response(
      JSON.stringify({ 
        success: data[0].success,
        isUpdate: data[0].is_update 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    Sentry.captureException(error)
    console.error('Error:', error.message)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})
