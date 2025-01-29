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
    const { playerName, score, avgWordsPerRound, sessionId, theme } = await req.json()

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

    console.log('Submitting score:', { playerName, score, avgWordsPerRound, sessionId, theme })

    const { data, error } = await supabaseClient.rpc('check_and_update_high_score', {
      p_player_name: playerName,
      p_score: score,
      p_avg_words_per_round: avgWordsPerRound,
      p_session_id: sessionId,
      p_theme: theme
    })

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