import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Word lists from words-standard.ts
const englishWords = [
  "CAT", "SUN", "RAIN", "TREE", "STAR", "MOON", "FISH", "BIRD", "CLOUD", "SKY",
  "WIND", "SNOW", "FLOWER", "BUTTERFLY", "WATER", "OCEAN", "RIVER", "MOUNTAIN", "FOREST", "HOUSE",
  "CANDLE", "GARDEN", "BRIDGE", "ISLAND", "BREEZE", "LIGHT", "THUNDER", "RAINBOW", "SMILE", "FRIEND",
  "FAMILY", "APPLE", "BANANA", "CAR", "BOAT", "BALL", "CAKE", "FROG", "HORSE", "LION",
  "MONKEY", "PANDA", "PLANE", "TRAIN", "CANDY", "KITE", "BALLOON", "PARK", "BEACH", "TOY",
  "BOOK", "BUBBLE", "SHELL", "PEN", "ICE", "HAT", "SHOE", "CLOCK", "BED", "CUP",
  "KEY", "DOOR", "CHICKEN", "DUCK", "SHEEP", "COW", "PIG", "GOAT", "FOX", "BEAR",
  "DEER", "OWL", "EGG", "NEST", "ROCK", "LEAF", "BRUSH", "TOOTH", "HAND", "FEET",
  "EYE", "NOSE", "EAR", "MOUTH", "CHILD", "RAINCOAT", "LADDER", "WINDOW", "DOCTOR", "NURSE",
  "TEACHER", "STUDENT", "PENCIL", "TABLE", "CHAIR", "LAMP", "MIRROR", "BOWL", "PLATE", "SPOON",
  "FORK", "KNIFE", "GLASS", "STRAW", "RULER", "PAPER", "BASKET", "CARPET", "SOFA", "TELEVISION",
  "RADIO", "BATTERY", "CANDLE", "FENCE", "MAILBOX", "BRICK", "LANTERN", "WHEEL", "BELL", "UMBRELLA",
  "TRUCK", "MOTORCYCLE", "BICYCLE", "STOVE", "REFRIGERATOR", "MICROWAVE", "WASHER", "DRYER", "FURNACE", "FAN",
  "PAINTBRUSH", "BUCKET", "SPONGE", "SOAP", "TOWEL", "CLOTH", "SCISSORS", "TAPE", "RIBBON", "THREAD",
  "NEEDLE", "BUTTON", "ZIPPER", "SLIPPER", "COAT", "MITTEN", "SCARF", "GLOVE", "PANTS", "SHIRT",
  "JACKET", "DRESS", "SKIRT", "SOCK", "BOOT", "SANDAL", "HAT", "CAP", "MASK", "SUNGALASSES",
  "WATCH", "NECKLACE", "BRACELET", "RING", "EARRING", "BACKPACK", "SUITCASE", "TICKET", "PASSPORT", "MAP",
  "COMPASS", "TORCH", "FLASHLIGHT", "CAMPFIRE", "TENT", "SLEEPINGBAG", "PICNIC", "BENCH", "FENCE", "GATE",
  "SIGN", "CROSSWALK", "TRAFFICLIGHT", "SIDEWALK", "LANTERN", "BALLOON", "POSTCARD", "STAMP", "LETTER", "ENVELOPE",
  "PARKING", "STREET", "HIGHWAY", "BRIDGE", "TUNNEL", "STATUE", "FOUNTAIN", "TOWER", "CASTLE", "PYRAMID",
  "PLANET", "GALAXY", "SATELLITE", "ASTRONAUT", "TELESCOPE", "MICROSCOPE", "MAGNET", "BATTERY", "BULB", "SOCKET",
  "PLUG", "WIRE", "SWITCH", "CIRCUIT", "ROBOT", "COMPUTER", "MOUSE", "KEYBOARD", "SCREEN", "PRINTER",
  "SPEAKER", "HEADPHONE", "PHONE", "CAMERA", "DOG"
];

const germanWords = [
  "HUND", "KATZE", "SONNE", "REGEN", "BAUM", "STERN", "MOND", "FISCH", "VOGEL", "WOLKE", "HIMMEL", "WIND",
  "SCHNEE", "BLUME", "SCHMETTERLING", "WASSER", "OZEAN", "FLUSS", "BERG", "WALD", "HAUS",
  "KERZE", "GARTEN", "BRÜCKE", "INSEL", "BRISE", "LICHT", "DONNER", "REGENBOGEN", "LÄCHELN", "FREUND",
  "FAMILIE", "APFEL", "BANANE", "AUTO", "BOOT", "BALL", "KUCHEN", "FROSCH", "PFERD", "LÖWE", "AFFE", "PANDA",
  "FLUGZEUG", "ZUG", "SÜSSIGKEIT", "DRACHEN", "BALLON", "PARK", "STRAND", "SPIELZEUG", "BUCH",
  "BLASE", "MUSCHEL", "STIFT", "EIS", "HUT", "SCHUH", "UHR", "BETT", "TASSE", "SCHLÜSSEL", "TÜR",
  "HÜHNCHEN", "ENTE", "SCHAF", "KUH", "SCHWEIN", "ZIEGE", "FUCHS", "BÄR", "REH", "EULE", "EI",
  "NEST", "STEIN", "BLATT", "PINSEL", "ZAHN", "HAND", "FÜSSE", "AUGE", "NASE", "OHR", "MUND",
  "KIND", "REGENMANTEL", "LEITER", "FENSTER", "ARZT", "KRANKENSCHWESTER", "LEHRER", "STUDENT",
  "BLEISTIFT", "TISCH", "STUHL", "LAMPE", "SPIEGEL", "SCHÜSSEL", "TELLER", "LÖFFEL", "GABEL",
  "MESSER", "GLAS", "STROHHALM", "LINEAL", "PAPIER", "KORB", "TEPPICH", "SOFA", "FERNSEHER",
  "RADIO", "BATTERIE", "ZAUN", "BRIEFKASTEN", "BACKSTEIN", "LATERNE", "RAD", "GLOCKE",
  "REGENSCHIRM", "LASTWAGEN", "MOTORRAD", "FAHRRAD", "HERD", "KÜHLSCHRANK", "MIKROWELLE",
  "WASCHMASCHINE", "TROCKNER", "OFEN", "VENTILATOR", "EIMER", "SCHWAMM", "SEIFE", "HANDTUCH",
  "STOFF", "SCHERE", "KLEBEBAND", "BAND", "FADEN", "NADEL", "KNOPF", "REISSVERSCHLUSS", "HAUSSCHUH",
  "MANTEL", "FAUSTHANDSCHUH", "SCHAL", "HANDSCHUH", "HOSE", "HEMD", "JACKE", "KLEID", "ROCK", "SOCKE",
  "STIEFEL", "SANDALE", "MÜTZE", "MASKE", "SONNENBRILLE", "UHR", "HALSKETTE", "ARMBAND", "RING", "OHRRING",
  "RUCKSACK", "KOFFER", "TICKET", "REISEPASS", "KARTE", "KOMPASS", "FACKEL", "TASCHENLAMPE", "LAGERFEUER", "ZELT",
  "SCHLAFSACK", "PICKNICK", "BANK", "TOR", "SCHILD", "ZEBRASTREIFEN", "VERKEHRSAMPEL", "BÜRGERSTEIG", "POSTKARTE",
  "BRIEFMARKE", "BRIEF", "UMSCHLAG", "PARKPLATZ", "STRAßE", "AUTOBAHN", "TUNNEL", "STATUE", "BRUNNEN", "TURM",
  "SCHLOSS", "PYRAMIDE", "PLANET", "GALAXIE", "SATELLIT", "ASTRONAUT", "TELESKOP", "MIKROSKOP", "MAGNET",
  "GLÜHBIRNE", "STECKDOSE", "STECKER", "DRAHT", "SCHALTER", "SCHALTUNG", "ROBOTER", "COMPUTER", "MAUS", "TASTATUR",
  "BILDSCHIRM", "DRUCKER", "LAUTSPRECHER", "KOPFHÖRER", "TELEFON", "KAMERA"
];

export const frenchWords = [
  "CHIEN", "CHAT", "SOLEIL", "PLUIE", "ARBRE", "ÉTOILE", "LUNE", "POISSON", "OISEAU", "NUAGE",
  "CIEL", "VENT", "NEIGE", "FLEUR", "PAPILLON", "EAU", "OCÉAN", "FLEUVE", "MONTAGNE", "FORÊT",
  "MAISON", "BOUGIE", "JARDIN", "PONT", "ÎLE", "BRISE", "LUMIÈRE", "TONNERRE", "ARC-EN-CIEL", "SOURIRE",
  "AMI", "FAMILLE", "POMME", "BANANE", "VOITURE", "BATEAU", "BALLE", "GÂTEAU", "GRENOUILLE", "CHEVAL",
  "LION", "SINGE", "PANDA", "AVION", "TRAIN", "BONBON", "CERF-VOLANT", "BALLON", "PARC", "PLAGE",
  "JOUET", "LIVRE", "BULLE", "COQUILLAGE", "STYLO", "GLACE", "CHAPEAU", "CHAUSSURE", "HORLOGE", "LIT",
  "TASSE", "CLÉ", "PORTE", "POULET", "CANARD", "MOUTON", "VACHE", "COCHON", "CHÈVRE", "RENARD",
  "OURS", "CERF", "HIBOU", "ŒUF", "NID", "ROCHE", "FEUILLE", "PINCEAU", "DENT", "MAIN",
  "PIEDS", "ŒIL", "NEZ", "OREILLE", "BOUCHE", "ENFANT", "IMPERMÉABLE", "ÉCHELLE", "FENÊTRE", "MÉDECIN",
  "INFIRMIÈRE", "ENSEIGNANT", "ÉTUDIANT", "CRAYON", "TABLE", "CHAISE", "LAMPE", "MIROIR", "BOL", "ASSIETTE",
  "CUILLÈRE", "FOURCHETTE", "COUTEAU", "VERRE", "PAILLE", "RÈGLE", "PAPIER", "PANIER", "TAPIS", "CANAPÉ",
  "TÉLÉVISION", "RADIO", "PILE", "CLÔTURE", "BRIQUE", "LANTERNE", "ROUE", "CLOCHE", "PARAPLUIE", "CAMION",
  "MOTO", "VÉLO", "CUISINIÈRE", "RÉFRIGÉRATEUR", "MICRO-ONDES", "LAVE-LINGE", "SÈCHE-LINGE", "FOURNAISE", "VENTILATEUR", "SEAU",
  "ÉPONGE", "SAVON", "SERVIETTE", "TISSU", "CISEAUX", "SCOTCH", "RUBAN", "FIL", "AIGUILLE", "BOUTON",
  "PANTOUFLE", "MANTEAU", "MOUFLE", "ÉCHARPE", "GANT", "PANTALON", "CHEMISE", "VESTE", "ROBE", "JUPE",
  "CHAUSSETTE", "BOTTE", "SANDALE", "CASQUETTE", "MASQUE", "MONTRE", "COLLIER", "BRACELET", "BAGUE", "VALISE",
  "BILLET", "PASSEPORT", "CARTE", "BOUSSOLE", "TORCHE", "TENTE", "PIQUE-NIQUE", "BANC", "PORTAIL", "PANNEAU",
  "TROTTOIR", "TIMBRE", "LETTRE", "ENVELOPPE", "PARKING", "RUE", "AUTOROUTE", "TUNNEL", "STATUE", "FONTAINE",
  "TOUR", "CHÂTEAU", "PYRAMIDE", "PLANÈTE", "GALAXIE", "SATELLITE", "ASTRONAUTE", "TÉLESCOPE", "MICROSCOPE", "AIMANT",
  "AMPOULE", "PRISE", "FICHE", "INTERRUPTEUR", "CIRCUIT", "ROBOT", "ORDINATEUR", "SOURIS", "CLAVIER", "ÉCRAN",
  "IMPRIMANTE", "HAUT-PARLEUR", "CASQUE", "TÉLÉPHONE", "APPAREIL PHOTO"
];

export const italianWords = [
  "CANE", "GATTO", "SOLE", "PIOGGIA", "ALBERO", "STELLA", "LUNA", "PESCE", "UCCELLO", "NUVOLA",
  "CIELO", "VENTO", "NEVE", "FIORE", "FARFALLA", "ACQUA", "OCEANO", "FIUME", "MONTAGNA", "FORESTA",
  "CASA", "GIARDINO", "PONTE", "ISOLA", "BREZZA", "LUCE", "TUONO", "ARCOBALENO", "SORRISO", "AMICO",
  "FAMIGLIA", "MELA", "BANANA", "AUTO", "BARCA", "PALLA", "TORTA", "RANA", "CAVALLO", "LEONE",
  "SCIMMIA", "PANDA", "AEREO", "TRENO", "CARAMELLA", "AQUILONE", "PARCO", "SPIAGGIA", "GIOCATTOLO",
  "LIBRO", "BOLLA", "CONCHIGLIA", "PENNA", "GHIACCIO", "CAPPELLO", "SCARPA", "OROLOGIO", "LETTO",
  "TAZZA", "CHIAVE", "PORTA", "POLLO", "ANATRA", "PECORA", "MUCCA", "MAIALE", "CAPRA", "VOLPE",
  "ORSO", "CERVO", "GUFO", "UOVO", "NIDO", "ROCCIA", "FOGLIA", "PENNELLO", "DENTE", "MANO",
  "PIEDI", "OCCHIO", "NASO", "ORECCHIO", "BOCCA", "BAMBINO", "IMPERMEABILE", "SCALA", "FINESTRA",
  "MEDICO", "INFERMIERA", "INSEGNANTE", "STUDENTE", "MATITA", "TAVOLO", "SEDIA", "LAMPADA", "SPECCHIO",
  "CIOTOLA", "PIATTO", "CUCCHIAIO", "FORCHETTA", "COLTELLO", "BICCHIERE", "CANNUCCIA", "RIGHELLO", "CARTA",
  "CESTINO", "TAPPETO", "DIVANO", "TELEVISIONE", "RADIO", "RECINTO", "MATTONE", "LANTERNA", "RUOTA",
  "CAMPANA", "OMBRELLO", "CAMION", "MOTOCICLETTA", "BICICLETTA", "FORNELLO", "FRIGORIFERO", "MICROONDE",
  "LAVATRICE", "ASCIUGATRICE", "FORNO", "VENTILATORE", "SECCHIO", "SPUGNA", "SAPONE", "ASCIUGAMANO",
  "PANNO", "FORBICI", "NASTRO", "FILO", "AGO", "BOTTONE", "CERNIERA", "PANTOFOLA", "CAPPOTTO",
  "MOFFOLA", "SCIARPA", "GUANTO", "PANTALONI", "CAMICIA", "GIACCA", "VESTITO", "GONNA", "CALZINO",
  "STIVALE", "SANDALO", "BERRETTO", "MASCHERA", "COLLANA", "BRACCIALETTO", "ANELLO", "ORECCHINO",
  "ZAINO", "VALIGIA", "BIGLIETTO", "PASSAPORTO", "CARTINA", "BUSSOLA", "TORCIA", "FALÒ", "TENDA",
  "PICNIC", "PANCHINA", "CANCELLO", "SEGNALE", "SEMAFORO", "MARCIAPIEDE", "CARTOLINA", "FRANCOBOLLO",
  "LETTERA", "BUSTA", "PARCHEGGIO", "STRADA", "AUTOSTRADA", "TUNNEL", "STATUA", "FONTANA", "TORRE",
  "CASTELLO", "PIRAMIDE", "PIANETA", "GALASSIA", "SATELLITE", "ASTRONAUTA", "TELESCOPIO", "MICROSCOPIO",
  "MAGNETE", "LAMPADINA", "PRESA", "SPINA", "INTERRUTTORE", "CIRCUITO", "ROBOT", "COMPUTER", "MOUSE",
  "TASTIERA", "SCHERMO", "STAMPANTE", "ALTOPARLANTE", "CUFFIE", "TELEFONO", "FOTOCAMERA"
];

const spanishWords = [
  "PERRO", "GATO", "SOL", "LLUVIA", "ÁRBOL", "ESTRELLA", "LUNA", "PEZ", "PÁJARO", "NUBE",
  "CIELO", "VIENTO", "NIEVE", "FLOR", "MARIPOSA", "AGUA", "OCÉANO", "RÍO", "MONTAÑA", "BOSQUE",
  "CASA", "VELA", "JARDÍN", "PUENTE", "ISLA", "BRISA", "LUZ", "TRUENO", "ARCOÍRIS", "SONRISA",
  "AMIGO", "FAMILIA", "MANZANA", "BANANA", "COCHE", "BARCO", "PELOTA", "PASTEL", "RANA", "CABALLO",
  "LEÓN", "MONO", "AVIÓN", "TREN", "CARAMELO", "COMETA", "GLOBO", "PARQUE", "PLAYA", "JUGUETE",
  "LIBRO", "BURBUJA", "CONCHA", "BOLÍGRAFO", "HIELO", "SOMBRERO", "ZAPATO", "RELOJ", "CAMA", "TAZA",
  "LLAVE", "PUERTA", "POLLO", "PATO", "OVEJA", "VACA", "CERDO", "CABRA", "ZORRO", "OSO",
  "CIERVO", "BÚHO", "HUEVO", "NIDO", "ROCA", "HOJA", "PINCEL", "DIENTE", "MANO", "PIES",
  "OJO", "NARIZ", "OREJA", "BOCA", "NIÑO", "IMPERMEABLE", "ESCALERA", "VENTANA", "MÉDICO", "ENFERMERA",
  "MAESTRO", "ESTUDIANTE", "LÁPIZ", "MESA", "SILLA", "LÁMPARA", "ESPEJO", "CUENCO", "PLATO", "CUCHARA",
  "TENEDOR", "CUCHILLO", "VASO", "PAJITA", "REGLA", "PAPEL", "CESTA", "ALFOMBRA", "SOFÁ", "TELEVISIÓN",
  "RADIO", "BATERÍA", "VALLA", "BUZÓN", "LADRILLO", "FAROL", "RUEDA", "CAMPANA", "PARAGUAS", "CAMIÓN",
  "MOTOCICLETA", "BICICLETA", "ESTUFA", "REFRIGERADOR", "MICROONDAS", "LAVADORA", "SECADORA", "HORNO", "VENTILADOR", "CUBO",
  "ESPONJA", "JABÓN", "TOALLA", "TELA", "TIJERAS", "CINTA", "HILO", "AGUJA", "BOTÓN", "CREMALLERA",
  "PANTUFLA", "ABRIGO", "MANOPLA", "BUFANDA", "GUANTE", "PANTALONES", "CAMISA", "CHAQUETA", "VESTIDO", "FALDA",
  "CALCETÍN", "BOTA", "SANDALIA", "GORRA", "MÁSCARA", "COLLAR", "PULSERA", "ANILLO", "PENDIENTE", "MOCHILA",
  "MALETA", "BILLETE", "PASAPORTE", "MAPA", "BRÚJULA", "ANTORCHA", "LINTERNA", "HOGUERA", "PICNIC", "BANCO",
  "PORTÓN", "SEÑAL", "SEMÁFORO", "ACERA", "POSTAL", "SELLO", "CARTA", "SOBRE", "ESTACIONAMIENTO", "CALLE",
  "AUTOPISTA", "TÚNEL", "ESTATUA", "FUENTE", "TORRE", "CASTILLO", "PIRÁMIDE", "PLANETA", "GALAXIA", "SATÉLITE",
  "ASTRONAUTA", "TELESCOPIO", "MICROSCOPIO", "IMÁN", "BOMBILLA", "ENCHUFE", "CABLE", "INTERRUPTOR", "CIRCUITO", "ROBOT",
  "ORDENADOR", "RATÓN", "TECLADO", "PANTALLA", "IMPRESORA", "ALTAVOZ", "AURICULARES", "TELÉFONO", "CÁMARA"
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
          words: generateRandomWords(language, 10),
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