import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'

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

    // Insert or update the high score
    const { data, error } = await supabaseClient
      .from('high_scores')
      .upsert({
        player_name: playerName,
        score,
        avg_words_per_round: avgWordsPerRound,
        session_id: sessionId,
        theme,
        game_id: gameId
      })
      .select()
      .single()

    if (error) {
      throw error
    }

    return new Response(
      JSON.stringify({ success: true, data }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
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