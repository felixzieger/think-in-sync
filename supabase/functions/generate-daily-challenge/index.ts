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

// Ensure that all words are singular nouns by updating the keys for words that were originally plural.
const wordTranslations: Record<string, Record<string, string>> = {
  "CAT": { de: "KATZE", fr: "CHAT", it: "GATTO", es: "GATO", pt: "GATO" },
  "DOG": { de: "HUND", fr: "CHIEN", it: "CANE", es: "PERRO", pt: "CÃO" },
  "SUN": { de: "SONNE", fr: "SOLEIL", it: "SOLE", es: "SOL", pt: "SOL" },
  "RAIN": { de: "REGEN", fr: "PLUIE", it: "PIOGGIA", es: "LLUVIA", pt: "CHUVA" },
  "TREE": { de: "BAUM", fr: "ARBRE", it: "ALBERO", es: "ÁRBOL", pt: "ÁRVORE" },
  "STAR": { de: "STERN", fr: "ÉTOILE", it: "STELLA", es: "ESTRELLA", pt: "ESTRELA" },
  "MOON": { de: "MOND", fr: "LUNE", it: "LUNA", es: "LUNA", pt: "LUA" },
  "FISH": { de: "FISCH", fr: "POISSON", it: "PESCE", es: "PEZ", pt: "PEIXE" },
  "BIRD": { de: "VOGEL", fr: "OISEAU", it: "UCCELLO", es: "PÁJARO", pt: "PÁSSARO" },
  "CLOUD": { de: "WOLKE", fr: "NUAGE", it: "NUVOLA", es: "NUBE", pt: "NUVEM" },
  "SKY": { de: "HIMMEL", fr: "CIEL", it: "CIELO", es: "CIELO", pt: "CÉU" },
  "WIND": { de: "WIND", fr: "VENT", it: "VENTO", es: "VIENTO", pt: "VENTO" },
  "SNOW": { de: "SCHNEE", fr: "NEIGE", it: "NEVE", es: "NIEVE", pt: "NEVE" },
  "FLOWER": { de: "BLUME", fr: "FLEUR", it: "FIORE", es: "FLOR", pt: "FLOR" },
  "BUTTERFLY": { de: "SCHMETTERLING", fr: "PAPILLON", it: "FARFALLA", es: "MARIPOSA", pt: "BORBOLETA" },
  "WATER": { de: "WASSER", fr: "EAU", it: "ACQUA", es: "AGUA", pt: "ÁGUA" },
  "OCEAN": { de: "OZEAN", fr: "OCÉAN", it: "OCEANO", es: "OCÉANO", pt: "OCEANO" },
  "RIVER": { de: "FLUSS", fr: "FLEUVE", it: "FIUME", es: "RÍO", pt: "RIO" },
  "MOUNTAIN": { de: "BERG", fr: "MONTAGNE", it: "MONTAGNA", es: "MONTAÑA", pt: "MONTANHA" },
  "FOREST": { de: "WALD", fr: "FORÊT", it: "FORESTA", es: "BOSQUE", pt: "FLORESTA" },
  "HOUSE": { de: "HAUS", fr: "MAISON", it: "CASA", es: "CASA", pt: "CASA" },
  "CANDLE": { de: "KERZE", fr: "BOUGIE", it: "CANDELA", es: "VELA", pt: "VELA" },
  "GARDEN": { de: "GARTEN", fr: "JARDIN", it: "GIARDINO", es: "JARDÍN", pt: "JARDIM" },
  "BRIDGE": { de: "BRÜCKE", fr: "PONT", it: "PONTE", es: "PUENTE", pt: "PONTE" },
  "ISLAND": { de: "INSEL", fr: "ÎLE", it: "ISOLA", es: "ISLA", pt: "ILHA" },
  "BREEZE": { de: "BRISE", fr: "BRISE", it: "BREZZA", es: "BRISA", pt: "BRISA" },
  "LIGHT": { de: "LICHT", fr: "LUMIÈRE", it: "LUCE", es: "LUZ", pt: "LUZ" },
  "THUNDER": { de: "DONNER", fr: "TONNERRE", it: "TUONO", es: "TRUENO", pt: "TROVÃO" },
  "RAINBOW": { de: "REGENBOGEN", fr: "ARC-EN-CIEL", it: "ARCOBALENO", es: "ARCOÍRIS", pt: "ARCO-ÍRIS" },
  "SMILE": { de: "LÄCHELN", fr: "SOURIRE", it: "SORRISO", es: "SONRISA", pt: "SORRISO" },
  "FRIEND": { de: "FREUND", fr: "AMI", it: "AMICO", es: "AMIGO", pt: "AMIGO" },
  "FAMILY": { de: "FAMILIE", fr: "FAMILLE", it: "FAMIGLIA", es: "FAMILIA", pt: "FAMÍLIA" },
  "APPLE": { de: "APFEL", fr: "POMME", it: "MELA", es: "MANZANA", pt: "MAÇÃ" },
  "BANANA": { de: "BANANE", fr: "BANANE", it: "BANANA", es: "BANANA", pt: "BANANA" },
  "CAR": { de: "AUTO", fr: "VOITURE", it: "AUTO", es: "COCHE", pt: "CARRO" },
  "BOAT": { de: "BOOT", fr: "BATEAU", it: "BARCA", es: "BARCO", pt: "BARCO" },
  "BALL": { de: "BALL", fr: "BALLE", it: "PALLA", es: "PELOTA", pt: "BOLA" },
  "CAKE": { de: "KUCHEN", fr: "GÂTEAU", it: "TORTA", es: "PASTEL", pt: "BOLO" },
  "FROG": { de: "FROSCH", fr: "GRENOUILLE", it: "RANA", es: "RANA", pt: "SAPO" },
  "HORSE": { de: "PFERD", fr: "CHEVAL", it: "CAVALLO", es: "CABALLO", pt: "CAVALO" },
  "LION": { de: "LÖWE", fr: "LION", it: "LEONE", es: "LEÓN", pt: "LEÃO" },
  "MONKEY": { de: "AFFE", fr: "SINGE", it: "SCIMMIA", es: "MONO", pt: "MACACO" },
  "PANDA": { de: "PANDA", fr: "PANDA", it: "PANDA", es: "PANDA", pt: "PANDA" },
  "PLANE": { de: "FLUGZEUG", fr: "AVION", it: "AEREO", es: "AVIÓN", pt: "AVIÃO" },
  "TRAIN": { de: "ZUG", fr: "TRAIN", it: "TRENO", es: "TREN", pt: "TREM" },
  "CANDY": { de: "SÜSSIGKEIT", fr: "BONBON", it: "CARAMELLA", es: "CARAMELO", pt: "DOCE" },
  "KITE": { de: "DRACHEN", fr: "CERF-VOLANT", it: "AQUILONE", es: "COMETA", pt: "PIPA" },
  "BALLOON": { de: "BALLON", fr: "BALLON", it: "PALLONCINO", es: "GLOBO", pt: "BALÃO" },
  "PARK": { de: "PARK", fr: "PARC", it: "PARCO", es: "PARQUE", pt: "PARQUE" },
  "BEACH": { de: "STRAND", fr: "PLAGE", it: "SPIAGGIA", es: "PLAYA", pt: "PRAIA" },
  "TOY": { de: "SPIELZEUG", fr: "JOUET", it: "GIOCATTOLO", es: "JUGUETE", pt: "BRINQUEDO" },
  "BOOK": { de: "BUCH", fr: "LIVRE", it: "LIBRO", es: "LIBRO", pt: "LIVRO" },
  "BUBBLE": { de: "BLASE", fr: "BULLE", it: "BOLLA", es: "BURBUJA", pt: "BOLHA" },
  "SHELL": { de: "MUSCHEL", fr: "COQUILLAGE", it: "CONCHIGLIA", es: "CONCHA", pt: "CONCHA" },
  "PEN": { de: "STIFT", fr: "STYLO", it: "PENNA", es: "BOLÍGRAFO", pt: "CANETA" },
  "ICE": { de: "EIS", fr: "GLACE", it: "GHIACCIO", es: "HIELO", pt: "GELO" },
  "HAT": { de: "HUT", fr: "CHAPEAU", it: "CAPPELLO", es: "SOMBRERO", pt: "CHAPÉU" },
  "SHOE": { de: "SCHUH", fr: "CHAUSSURE", it: "SCARPA", es: "ZAPATO", pt: "SAPATO" },
  "CLOCK": { de: "UHR", fr: "HORLOGE", it: "OROLOGIO", es: "RELOJ", pt: "RELÓGIO" },
  "BED": { de: "BETT", fr: "LIT", it: "LETTO", es: "CAMA", pt: "CAMA" },
  "CUP": { de: "TASSE", fr: "TASSE", it: "Tazza", es: "TazA", pt: "XÍCARA" },
  "KEY": { de: "SCHLÜSSEL", fr: "CLÉ", it: "CHIAVE", es: "LLAVE", pt: "CHAVE" },
  "DOOR": { de: "TÜR", fr: "PORTE", it: "PORTA", es: "PUERTA", pt: "PORTA" },
  "CHICKEN": { de: "HÜHNCHEN", fr: "POULET", it: "POLLO", es: "POLLO", pt: "FRANGO" },
  "DUCK": { de: "ENTE", fr: "CANARD", it: "ANATRA", es: "PATO", pt: "PATO" },
  "SHEEP": { de: "SCHAF", fr: "MOUTON", it: "PECORA", es: "OVEJA", pt: "OVELHA" },
  "COW": { de: "KUH", fr: "VACHE", it: "MUCCA", es: "VACA", pt: "VACA" },
  "PIG": { de: "SCHWEIN", fr: "COCHON", it: "MAIALE", es: "CERDO", pt: "PORCO" },
  "GOAT": { de: "ZIEGE", fr: "CHÈVRE", it: "CAPRA", es: "CABRA", pt: "CABRA" },
  "FOX": { de: "FUCHS", fr: "RENARD", it: "VOLPE", es: "ZORRO", pt: "RAPOSA" },
  "BEAR": { de: "BÄR", fr: "OURS", it: "ORSO", es: "OSO", pt: "URSO" },
  "DEER": { de: "REH", fr: "CERF", it: "CERVO", es: "CIERVO", pt: "VEADO" },
  "OWL": { de: "EULE", fr: "HIBOU", it: "GUFO", es: "BÚHO", pt: "CORUJA" },
  "EGG": { de: "EI", fr: "ŒUF", it: "UOVO", es: "HUEVO", pt: "OVO" },
  "NEST": { de: "NEST", fr: "NID", it: "NIDO", es: "NIDO", pt: "NINHO" },
  "ROCK": { de: "STEIN", fr: "ROCHE", it: "ROCCIA", es: "ROCA", pt: "PEDRA" },
  "LEAF": { de: "BLATT", fr: "FEUILLE", it: "FOGLIA", es: "HOJA", pt: "FOLHA" },
  "BRUSH": { de: "PINSEL", fr: "BROSSE", it: "PENNELLO", es: "Pincel", pt: "Pincel" },
  "TOOTH": { de: "ZAHN", fr: "DENT", it: "DENTE", es: "DIENTE", pt: "DENTE" },
  "HAND": { de: "HAND", fr: "MAIN", it: "MANO", es: "MANO", pt: "MÃO" },
  "FOOT": { de: "FUß", fr: "PIED", it: "PIEDE", es: "PIE", pt: "PÉ" },
  "EYE": { de: "AUGE", fr: "ŒIL", it: "OCCHIO", es: "OJO", pt: "OLHO" },
  "NOSE": { de: "NASE", fr: "NEZ", it: "NASO", es: "NARIZ", pt: "NARIZ" },
  "EAR": { de: "OHR", fr: "OREILLE", it: "ORECCHIO", es: "OREJA", pt: "ORELHA" },
  "MOUTH": { de: "MUND", fr: "BOUCHE", it: "BOCCA", es: "BOCA", pt: "BOCA" },
  "CHILD": { de: "KIND", fr: "ENFANT", it: "BAMBINO", es: "NIÑO", pt: "CRIANÇA" },
  "RAINCOAT": { de: "REGENMANTEL", fr: "IMPERMÉABLE", it: "IMPERMEABILE", es: "IMPERMEABLE", pt: "IMPERMEÁVEL" },
  "LADDER": { de: "LEITER", fr: "ÉCHELLE", it: "SCALA", es: "ESCALERA", pt: "ESCADA" },
  "WINDOW": { de: "FENSTER", fr: "FENÊTRE", it: "FINESTRA", es: "VENTANA", pt: "JANELA" },
  "DOCTOR": { de: "ARZT", fr: "MÉDECIN", it: "MEDICO", es: "MÉDICO", pt: "MÉDICO" },
  "NURSE": { de: "KRANKENSCHWESTER", fr: "INFIRMIÈRE", it: "INFERMIERA", es: "ENFERMERA", pt: "ENFERMEIRA" },
  "TEACHER": { de: "LEHRER", fr: "ENSEIGNANT", it: "INSEGNANTE", es: "MAESTRO", pt: "PROFESSOR" },
  "STUDENT": { de: "STUDENT", fr: "ÉTUDIANT", it: "STUDENTE", es: "ESTUDIANTE", pt: "ESTUDANTE" },
  "PENCIL": { de: "BLEISTIFT", fr: "CRAYON", it: "MATITA", es: "LÁPIZ", pt: "LÁPIS" },
  "TABLE": { de: "TISCH", fr: "TABLE", it: "Tavolo", es: "MESA", pt: "MESA" },
  "CHAIR": { de: "STUHL", fr: "CHAISE", it: "SEDIA", es: "SILLA", pt: "CADEIRA" },
  "LAMP": { de: "LAMPE", fr: "LAMPE", it: "LAMPADA", es: "LÁMPARA", pt: "LÂMPADA" },
  "MIRROR": { de: "SPIEGEL", fr: "MIROIR", it: "SPECCHIO", es: "ESPEJO", pt: "ESPELHO" },
  "BOWL": { de: "SCHÜSSEL", fr: "BOL", it: "CIOTOLA", es: "CUENCO", pt: "TIGELA" },
  "PLATE": { de: "TELLER", fr: "ASSIETTE", it: "PIATTO", es: "PLATO", pt: "PRATO" },
  "SPOON": { de: "LÖFFEL", fr: "CUILLÈRE", it: "CUCCHIAIO", es: "CUCHARA", pt: "COLHER" },
  "FORK": { de: "GABEL", fr: "FOURCHETTE", it: "FORCHETTA", es: "TENEDOR", pt: "GARFO" },
  "KNIFE": { de: "MESSER", fr: "COUTEAU", it: "COLTELLO", es: "CUCHILLO", pt: "FACA" },
  "GLASS": { de: "GLAS", fr: "VERRE", it: "BICCHIERE", es: "VASO", pt: "COPO" },
  "STRAW": { de: "STROHHALM", fr: "PAILLE", it: "CANNUCCIA", es: "PAJITA", pt: "CANUDO" },
  "RULER": { de: "LINEAL", fr: "RÈGLE", it: "RIGHELLO", es: "REGLA", pt: "RÉGUA" },
  "PAPER": { de: "PAPIER", fr: "PAPIER", it: "CARTA", es: "PAPEL", pt: "PAPEL" },
  "BASKET": { de: "KORB", fr: "PANIER", it: "CESTINO", es: "CESTA", pt: "CESTA" },
  "CARPET": { de: "TEPPICH", fr: "TAPIS", it: "TAPPETO", es: "ALFOMBRA", pt: "TAPETE" },
  "SOFA": { de: "SOFA", fr: "CANAPÉ", it: "DIVANO", es: "SOFÁ", pt: "SOFÁ" },
  "TELEVISION": { de: "FERNSEHER", fr: "TÉLÉVISION", it: "TELEVISIONE", es: "TELEVISIÓN", pt: "TELEVISÃO" },
  "RADIO": { de: "RADIO", fr: "RADIO", it: "RADIO", es: "RADIO", pt: "RÁDIO" },
  "BATTERY": { de: "BATTERIE", fr: "PILE", it: "BATTERIA", es: "BATERÍA", pt: "BATERIA" },
  "FENCE": { de: "ZAUN", fr: "CLÔTURE", it: "RECINTO", es: "VALLA", pt: "CERCA" },
  "MAILBOX": { de: "BRIEFKASTEN", fr: "BOÎTE AUX LETTRES", it: "CASSETTA POSTALE", es: "BUZÓN", pt: "CAIXA DE CORREIO" },
  "BRICK": { de: "BACKSTEIN", fr: "BRIQUE", it: "MATTONE", es: "LADRILLO", pt: "TIJOLO" },
  "LANTERN": { de: "LATERNE", fr: "LANTERNE", it: "LANTERNA", es: "FAROL", pt: "LANTERNA" },
  "WHEEL": { de: "RAD", fr: "ROUE", it: "RUOTA", es: "RUEDA", pt: "RODA" },
  "BELL": { de: "GLOCKE", fr: "CLoche", it: "CAMPANA", es: "CAMPANA", pt: "SINO" },
  "UMBRELLA": { de: "REGENSCHIRM", fr: "PARAPLUIE", it: "OMBRELLO", es: "PARAGUAS", pt: "GUARDA-CHUVA" },
  "TRUCK": { de: "LASTWAGEN", fr: "CAMION", it: "CAMION", es: "CAMIÓN", pt: "CAMINHÃO" },
  "MOTORCYCLE": { de: "MOTORRAD", fr: "MOTO", it: "MOTOCICLETTA", es: "MOTOCICLETA", pt: "MOTOCICLETA" },
  "BICYCLE": { de: "FAHRRAD", fr: "VÉLO", it: "BICICLETTA", es: "BICICLETA", pt: "BICICLETA" },
  "STOVE": { de: "HERD", fr: "CUISINIÈRE", it: "FORNELLO", es: "ESTUFA", pt: "FOGÃO" },
  "REFRIGERATOR": { de: "KÜHLSCHRANK", fr: "RÉFRIGÉRATEUR", it: "FRIGORIFERO", es: "REFRIGERADOR", pt: "GELADEIRA" },
  "MICROWAVE": { de: "MIKROWELLE", fr: "MICRO-ONDES", it: "MICROONDE", es: "MICROONDAS", pt: "MICRO-ONDAS" },
  "WASHER": { de: "WASCHMASCHINE", fr: "LAVE-LINGE", it: "LAVATRICE", es: "LAVADORA", pt: "MÁQUINA DE LAVAR" },
  "DRYER": { de: "TROCKNER", fr: "SÈCHE-LINGE", it: "ASCUGATRICE", es: "SECADORA", pt: "SECADORA" },
  "FURNACE": { de: "OFEN", fr: "FOURNAISE", it: "FORNACE", es: "HORNO", pt: "FORNALHA" },
  "FAN": { de: "VENTILATOR", fr: "VENTILATEUR", it: "VENTILATORE", es: "VENTILADOR", pt: "VENTILADOR" },
  "PAINTBRUSH": { de: "PINSEL", fr: "PINCEAU", it: "PENNELLO", es: "Pincel", pt: "Pincel" },
  "BUCKET": { de: "EIMER", fr: "SEAU", it: "SECCHIO", es: "CUBO", pt: "BALDE" },
  "SPONGE": { de: "SCHWAMM", fr: "ÉPONGE", it: "SPUGNA", es: "ESPONJA", pt: "ESPONJA" },
  "SOAP": { de: "SEIFE", fr: "SAVON", it: "SAPONE", es: "JABÓN", pt: "SABÃO" },
  "TOWEL": { de: "HANDTUCH", fr: "SERVIETTE", it: "ASCIUGAMANO", es: "TOALLA", pt: "TOALHA" },
  "CLOTH": { de: "STOFF", fr: "TISSU", it: "STOFFA", es: "TELA", pt: "TECIDO" },
  "SCISSOR": { de: "SCHERE", fr: "CISEAU", it: "FORBICI", es: "TIJERA", pt: "TESOURA" },
  "RIBBON": { de: "BAND", fr: "RUBAN", it: "NASTRO", es: "CINTA", pt: "FITA" },
  "THREAD": { de: "FADEN", fr: "FIL", it: "FILO", es: "HILO", pt: "LINHA" },
  "NEEDLE": { de: "NADEL", fr: "AIGUILLE", it: "AGO", es: "AGUJA", pt: "AGULHA" },
  "BUTTON": { de: "KNOPF", fr: "BOUTON", it: "BOTTONE", es: "BOTÓN", pt: "BOTÃO" },
  "SLIPPER": { de: "HAUSSCHUH", fr: "PANTOUFLE", it: "PANTOFOLE", es: "PANTUFLA", pt: "PANTOFO" },
  "COAT": { de: "MANTEL", fr: "MANTEAU", it: "CAPPOTTO", es: "ABRIGO", pt: "CASACO" },
  "MITTEN": { de: "FAUSTHANDSCHUH", fr: "MOUFLE", it: "GUANTO", es: "MANOPLA", pt: "LUVA" },
  "SCARF": { de: "SCHAL", fr: "ÉCHARPE", it: "SCIARPA", es: "BUFANDA", pt: "CACHECOL" },
  "GLOVE": { de: "HANDSCHUH", fr: "GANT", it: "GUANTO", es: "GUANTE", pt: "LUVA" },
  "TROUSER": { de: "HOSE", fr: "PANTALON", it: "PANTALONE", es: "PANTALÓN", pt: "CALÇA" },
  "SHIRT": { de: "HEMD", fr: "CHEMISE", it: "CAMICIA", es: "CAMISA", pt: "CAMISA" },
  "JACKET": { de: "JACKE", fr: "VESTE", it: "GIACCA", es: "CHAQUETA", pt: "JAQUETA" },
  "DRESS": { de: "KLEID", fr: "ROBE", it: "VESTITO", es: "VESTIDO", pt: "VESTIDO" },
  "SKIRT": { de: "ROCK", fr: "JUPE", it: "GONNA", es: "FALDA", pt: "SAIA" },
  "SOCK": { de: "SOCKE", fr: "CHAUSSETTE", it: "CALZINO", es: "CALCETÍN", pt: "MEIA" },
  "BOOT": { de: "STIEFEL", fr: "BOTTE", it: "STIVALE", es: "BOTA", pt: "BOTA" },
  "SANDAL": { de: "SANDALE", fr: "SANDALE", it: "SANDALO", es: "SANDALIA", pt: "SANDÁLIA" },
  "CAP": { de: "MÜTZE", fr: "CASQUETTE", it: "BERRETTO", es: "GORRA", pt: "BONÉ" },
  "MASK": { de: "MASKE", fr: "MASQUE", it: "MASCHERA", es: "MÁSCARA", pt: "MÁSCARA" },
  "WATCH": { de: "UHR", fr: "MONTRE", it: "OROLOGIO", es: "RELOJ", pt: "RELÓGIO" },
  "NECKLACE": { de: "HALSKETTE", fr: "COLLER", it: "COLLANA", es: "COLLAR", pt: "COLAR" },
  "BRACELET": { de: "ARMBAND", fr: "BRACELET", it: "BRACCIALE", es: "PULSERA", pt: "PULSEIRA" },
  "RING": { de: "RING", fr: "BAGUE", it: "ANELLO", es: "ANILLO", pt: "ANEL" },
  "BACKPACK": { de: "RUCKSACK", fr: "SAC À DOS", it: "ZAINO", es: "MOCHILA", pt: "MOCHILA" },
  "SUITCASE": { de: "KOFFER", fr: "VALISE", it: "VALIGIA", es: "MALETA", pt: "MALA" },
  "TICKET": { de: "TICKET", fr: "BILLET", it: "BIGLIETTO", es: "BILLETE", pt: "BILHETE" },
  "PASSPORT": { de: "REISEPASS", fr: "PASSEPORT", it: "PASSAPORTO", es: "PASAPORTE", pt: "PASSAPORTE" },
  "MAP": { de: "KARTE", fr: "CARTE", it: "MAPP", es: "MAPA", pt: "MAPA" },
  "COMPASS": { de: "KOMPASS", fr: "BOUSSOLE", it: "BUSSOLA", es: "BRÚJULA", pt: "BÚSSOLA" },
  "TORCH": { de: "FACKEL", fr: "TORCHE", it: "TORCIA", es: "ANTORCHA", pt: "TOCHA" },
  "CAMPFIRE": { de: "LAGERFEUER", fr: "FEU DE CAMP", it: "FALÒ", es: "FOGATA", pt: "FOGUEIRA" },
  "TENT": { de: "ZELT", fr: "TENTE", it: "TENDA", es: "TIENDA DE CAMPAÑA", pt: "BARRACA" },
  "PICNIC": { de: "PICKNICK", fr: "PIQUE-NIQUE", it: "PICNIC", es: "PICNIC", pt: "PIQUENIQUE" },
  "BENCH": { de: "BANK", fr: "BANC", it: "PANCHINA", es: "BANCO", pt: "BANCO" },
  "GATE": { de: "TOR", fr: "PORTAIL", it: "CANCELLO", es: "PORTÓN", pt: "PORTÃO" },
  "SIGN": { de: "SCHILD", fr: "PANNEAU", it: "SEGNALE", es: "SEÑAL", pt: "PLACA" },
  "SIDEWALK": { de: "BÜRGERSTEIG", fr: "TROTTOIR", it: "MARCIAPIEDE", es: "ACERA", pt: "CALÇADA" },
  "POSTCARD": { de: "POSTKARTE", fr: "CARTE POSTALE", it: "CARTOLINA", es: "POSTAL", pt: "CARTÃO-POSTAL" },
  "STAMP": { de: "BRIEFMARKE", fr: "TIMBRE", it: "FRANCOBOLLO", es: "SELLO", pt: "SELO" },
  "LETTER": { de: "BRIEF", fr: "LETTRE", it: "LETTERA", es: "CARTA", pt: "CARTA" },
  "ENVELOPE": { de: "UMSCHLAG", fr: "ENVELOPPE", it: "BUSTA", es: "SOBRE", pt: "ENVELOPE" },
  "PARKING": { de: "PARKPLATZ", fr: "PARKING", it: "PARCHEGGIO", es: "ESTACIONAMIENTO", pt: "ESTACIONAMENTO" },
  "STREET": { de: "STRAßE", fr: "RUE", it: "STRADA", es: "CALLE", pt: "RUA" },
  "HIGHWAY": { de: "AUTOBAHN", fr: "AUTOROUTE", it: "AUTOSTRADA", es: "AUTOPISTA", pt: "AUTOESTRADA" },
  "TUNNEL": { de: "TUNNEL", fr: "TUNNEL", it: "GALLERIA", es: "TÚNEL", pt: "TÚNEL" },
  "STATUE": { de: "STATUE", fr: "STATUE", it: "STATUA", es: "ESTATUA", pt: "ESTÁTUA" },
  "FOUNTAIN": { de: "BRUNNEN", fr: "FONTAINE", it: "FONTANA", es: "FUENTE", pt: "FONTE" },
  "TOWER": { de: "TURM", fr: "TOUR", it: "TORRE", es: "TORRE", pt: "TORRE" },
  "CASTLE": { de: "SCHLOSS", fr: "CHÂTEAU", it: "CASTELLO", es: "CASTILLO", pt: "CASTELO" },
  "PYRAMID": { de: "PYRAMIDE", fr: "PYRAMIDE", it: "PIRAMIDE", es: "PIRÁMIDE", pt: "PIRÂMIDE" },
  "PLANET": { de: "PLANET", fr: "PLANÈTE", it: "PIANETA", es: "PLANETA", pt: "PLANETA" },
  "GALAXY": { de: "GALAXIE", fr: "GALAXIE", it: "GALASSIA", es: "GALAXIA", pt: "GALÁXIA" },
  "SATELLITE": { de: "SATELLIT", fr: "SATELLITE", it: "SATELLITE", es: "SATÉLITE", pt: "SATÉLITE" },
  "ASTRONAUT": { de: "ASTRONAUT", fr: "ASTRONAUTE", it: "ASTRONAUTA", es: "ASTRONAUTA", pt: "ASTRONAUTA" },
  "TELESCOPE": { de: "TELESCOP", fr: "TÉLESCOPE", it: "TELESCOPIO", es: "TELESCOPIO", pt: "TELESCÓPIO" },
  "MICROSCOPE": { de: "MIKROSKOP", fr: "MICROSCOPE", it: "MICROSCOPIO", es: "MICROSCOPIO", pt: "MICROSCÓPIO" },
  "MAGNET": { de: "MAGNET", fr: "AIMANT", it: "MAGNETE", es: "IMÁN", pt: "ÍMAN" },
  "BULB": { de: "GLÜHBIRNE", fr: "AMPOULE", it: "LAMPADINA", es: "BOMBILLA", pt: "LÂMPADA" },
  "SOCKET": { de: "STECKDOSE", fr: "PRISE", it: "PRESA", es: "ENCHUFE", pt: "TOMADA" },
  "PLUG": { de: "STECKER", fr: "FICHE", it: "SPINA", es: "CLAVIJA", pt: "PLUGUE" },
  "WIRE": { de: "DRAHT", fr: "FIL", it: "FILO", es: "CABLE", pt: "FIO" },
  "SWITCH": { de: "SCHALTER", fr: "INTERRUPTEUR", it: "INTERRUTTORE", es: "INTERRUPTOR", pt: "INTERRUPTOR" },
  "CIRCUIT": { de: "SCHALTUNG", fr: "CIRCUIT", it: "CIRCUITO", es: "CIRCUITO", pt: "CIRCUITO" },
  "ROBOT": { de: "ROBOTER", fr: "ROBOT", it: "ROBOT", es: "ROBOT", pt: "ROBÔ" },
  "COMPUTER": { de: "COMPUTER", fr: "ORDINATEUR", it: "COMPUTER", es: "ORDENADOR", pt: "COMPUTADOR" },
  "MOUSE": { de: "MAUS", fr: "SOURIS", it: "MOUSE", es: "RATÓN", pt: "MOUSE" },
  "KEYBOARD": { de: "TASTATUR", fr: "CLAVIER", it: "TASTIERA", es: "TECLADO", pt: "TECLADO" },
  "SCREEN": { de: "BILDSCHIRM", fr: "ÉCRAN", it: "SCHERMO", es: "PANTALLA", pt: "TELA" },
  "PRINTER": { de: "DRUCKER", fr: "IMPRIMANTE", it: "STAMPANTE", es: "IMPRESORA", pt: "IMPRESSORA" },
  "SPEAKER": { de: "LAUTSPRECHER", fr: "HAUT-PARLEUR", it: "ALTOPARLANTE", es: "ALTAVOZ", pt: "ALTO-FALANTE" },
  "HEADPHONE": { de: "KOPFHÖRER", fr: "CASQUE", it: "CUFFIE", es: "AURICULARES", pt: "FONES DE OUVIDO" },
  "PHONE": { de: "TELEFON", fr: "TÉLÉPHONE", it: "TELEFONO", es: "TELÉFONO", pt: "TELEFONE" }
};

// Helper function to translate a word to target language
function translateWord(word: string, targetLang: string): string {
  const translations = wordTranslations[word];
  if (!translations || !translations[targetLang]) {
    console.warn(`Missing translation for word: ${word} in language: ${targetLang}`);
    return word;
  }
  return translations[targetLang];
}

// Helper function to generate translated word sets
function generateTranslatedWords(englishWords: string[], targetLang: string): string[] {
  return englishWords.map(word => translateWord(word, targetLang));
}

function generateEnglishRandomWords(count: number): string[] {
  const words: string[] = [];
  const englishWords = Object.keys(wordTranslations);
  const availableWords = [...englishWords];

  for (let i = 0; i < count; i++) {
    if (availableWords.length === 0) {
      availableWords.push(...englishWords);
    }
    const randomIndex = Math.floor(Math.random() * availableWords.length);
    words.push(availableWords[randomIndex]);
    availableWords.splice(randomIndex, 1);
  }

  return words;
}

interface Challenge {
  language: string;
  challenge: {
    id: number;
    game_id: number;
    is_active: boolean;
    created_at: string;
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Starting daily challenge generation...');

    // Get environment variables
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    // Validate environment variables
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing required environment variables: SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
    }

    // Initialize Supabase client
    const supabase = createClient(supabaseUrl, supabaseKey);
    console.log('Supabase client initialized');

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

    // Generate one set of English words
    const selectedEnglishWords = generateEnglishRandomWords(10);
    const languages = ['en', 'de', 'fr', 'it', 'es', 'pt'];
    const challenges: Challenge[] = [];

    for (const language of languages) {
      console.log(`Creating new game for language: ${language}`);

      // Translate words if not English
      const gameWords = language === 'en' ?
        selectedEnglishWords :
        generateTranslatedWords(selectedEnglishWords, language);

      // Create new game
      const { data: gameData, error: gameError } = await supabase
        .from('games')
        .insert({
          theme: 'standard',
          words: gameWords,
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
    Sentry.captureException(error)
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
