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
    const { sessionId } = await req.json()

    if (!sessionId) {
      throw new Error('Missing sessionId')
    }

    console.log('Saving game results for session:', sessionId)

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        auth: {
          persistSession: false,
        },
      }
    )

    // First get all game results for this session
    const { data: gameResults, error: gameResultsError } = await supabaseClient
      .from('game_results')
      .select('*')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true })

    if (gameResultsError) {
      throw new Error('Failed to fetch game results')
    }

    console.log('Found game results:', gameResults?.length)

    // Get the session to find the game_id
    const { data: session, error: sessionError } = await supabaseClient
      .from('sessions')
      .select('game_id')
      .eq('id', sessionId)
      .single()

    if (sessionError || !session) {
      throw new Error('Failed to fetch session')
    }

    // Get the original game to get the theme
    const { data: game, error: gameError } = await supabaseClient
      .from('games')
      .select('theme')
      .eq('id', session.game_id)
      .single()

    if (gameError || !game) {
      throw new Error('Failed to fetch game')
    }

    // Calculate success metrics
    const successfulRounds = gameResults?.filter(result => result.is_correct).length ?? 0
    const avgWordsPerRound = gameResults ? gameResults.length / successfulRounds : 0

    console.log('Game metrics:', {
      sessionId,
      successfulRounds,
      avgWordsPerRound,
      theme: game.theme
    })

    return new Response(
      JSON.stringify({ 
        success: true,
        data: {
          successfulRounds,
          avgWordsPerRound,
          theme: game.theme
        }
      }),
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