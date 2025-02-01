import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Word lists from words-standard.ts
const englishWords = [
  "DOG", "CAT", "SUN", "RAIN", "TREE", "STAR", "MOON", "FISH", "BIRD", "CLOUD",
  "SKY", "WIND", "SNOW", "FLOWER", "BUTTERFLY", "WATER", "OCEAN", "RIVER", "MOUNTAIN",
  "FOREST", "HOUSE", "CANDLE", "GARDEN", "BRIDGE", "ISLAND"
];

const germanWords = [
  "HUND", "KATZE", "SONNE", "REGEN", "BAUM", "STERN", "MOND", "FISCH", "VOGEL",
  "WOLKE", "HIMMEL", "WIND", "SCHNEE", "BLUME", "SCHMETTERLING", "WASSER", "OZEAN",
  "FLUSS", "BERG", "WALD", "HAUS", "KERZE", "GARTEN", "BRÜCKE", "INSEL"
];

const frenchWords = [
  "CHIEN", "CHAT", "SOLEIL", "PLUIE", "ARBRE", "ÉTOILE", "LUNE", "POISSON",
  "OISEAU", "NUAGE", "CIEL", "VENT", "NEIGE", "FLEUR", "PAPILLON", "EAU", "OCÉAN",
  "FLEUVE", "MONTAGNE", "FORÊT", "MAISON", "BOUGIE", "JARDIN", "PONT", "ÎLE"
];

const italianWords = [
  "CANE", "GATTO", "SOLE", "PIOGGIA", "ALBERO", "STELLA", "LUNA", "PESCE",
  "UCCELLO", "NUVOLA", "CIELO", "VENTO", "NEVE", "FIORE", "FARFALLA", "ACQUA",
  "OCEANO", "FIUME", "MONTAGNA", "FORESTA", "CASA", "CANDELA", "GIARDINO", "PONTE", "ISOLA"
];

const spanishWords = [
  "PERRO", "GATO", "SOL", "LLUVIA", "ÁRBOL", "ESTRELLA", "LUNA", "PEZ", "PÁJARO",
  "NUBE", "CIELO", "VIENTO", "NIEVE", "FLOR", "MARIPOSA", "AGUA", "OCÉANO", "RÍO",
  "MONTAÑA", "BOSQUE", "CASA", "VELA", "JARDÍN", "PUENTE", "ISLA"
];

// Helper function to get word list based on language
function getWordList(language: string): string[] {
  switch (language) {
    case 'de':
      return germanWords;
    case 'fr':
      return frenchWords;
    case 'it':
      return italianWords;
    case 'es':
      return spanishWords;
    default:
      return englishWords;
  }
}

// Helper function to generate random words from the appropriate list
function generateRandomWords(language: string, count: number): string[] {
  const wordList = getWordList(language);
  const words: string[] = [];
  
  // Create a copy of the word list to avoid duplicates
  const availableWords = [...wordList];
  
  for (let i = 0; i < count; i++) {
    if (availableWords.length === 0) {
      // If we run out of unique words, reset the available words
      availableWords.push(...wordList);
    }
    const randomIndex = Math.floor(Math.random() * availableWords.length);
    words.push(availableWords[randomIndex]);
    availableWords.splice(randomIndex, 1);
  }
  
  return words;
}

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

    // Deactivate current active challenges
    console.log('Deactivating current active challenges...');
    const { error: deactivateError } = await supabase
      .from('daily_challenges')
      .update({ is_active: false })
      .eq('is_active', true);

    if (deactivateError) {
      console.error('Error deactivating current challenges:', deactivateError);
      throw deactivateError;
    }

    // Create new games for each language
    const languages = ['en', 'de', 'fr', 'it', 'es'];
    const challenges = [];

    for (const language of languages) {
      console.log(`Creating new game for language: ${language}`);
      
      // Create new game
      const { data: gameData, error: gameError } = await supabase
        .from('games')
        .insert({
          theme: 'standard',
          words: generateRandomWords(language, 25),
          language: language
        })
        .select()
        .single();

      if (gameError) {
        console.error(`Error creating game for ${language}:`, gameError);
        throw gameError;
      }

      // Create new daily challenge
      const { data: challengeData, error: challengeError } = await supabase
        .from('daily_challenges')
        .insert({
          game_id: gameData.id,
          is_active: true
        })
        .select()
        .single();

      if (challengeError) {
        console.error(`Error creating daily challenge for ${language}:`, challengeError);
        throw challengeError;
      }

      challenges.push({ language, challenge: challengeData });
      console.log(`Successfully created daily challenge for ${language}`);
    }

    console.log('All daily challenges generated successfully');

    return new Response(
      JSON.stringify({ success: true, data: challenges }),
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