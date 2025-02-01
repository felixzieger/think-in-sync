import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const wordTranslations: Record<string, Record<string, string>> = {
  "CAT": { de: "KATZE", fr: "CHAT", it: "GATTO", es: "GATO" },
  "DOG": { de: "HUND", fr: "CHIEN", it: "CANE", es: "PERRO" },
  "SUN": { de: "SONNE", fr: "SOLEIL", it: "SOLE", es: "SOL" },
  "RAIN": { de: "REGEN", fr: "PLUIE", it: "PIOGGIA", es: "LLUVIA" },
  "TREE": { de: "BAUM", fr: "ARBRE", it: "ALBERO", es: "ÁRBOL" },
  "STAR": { de: "STERN", fr: "ÉTOILE", it: "STELLA", es: "ESTRELLA" },
  "MOON": { de: "MOND", fr: "LUNE", it: "LUNA", es: "LUNA" },
  "FISH": { de: "FISCH", fr: "POISSON", it: "PESCE", es: "PEZ" },
  "BIRD": { de: "VOGEL", fr: "OISEAU", it: "UCCELLO", es: "PÁJARO" },
  "CLOUD": { de: "WOLKE", fr: "NUAGE", it: "NUVOLA", es: "NUBE" },
  "SKY": { de: "HIMMEL", fr: "CIEL", it: "CIELO", es: "CIELO" },
  "WIND": { de: "WIND", fr: "VENT", it: "VENTO", es: "VIENTO" },
  "SNOW": { de: "SCHNEE", fr: "NEIGE", it: "NEVE", es: "NIEVE" },
  "FLOWER": { de: "BLUME", fr: "FLEUR", it: "FIORE", es: "FLOR" },
  "BUTTERFLY": { de: "SCHMETTERLING", fr: "PAPILLON", it: "FARFALLA", es: "MARIPOSA" },
  "WATER": { de: "WASSER", fr: "EAU", it: "ACQUA", es: "AGUA" },
  "OCEAN": { de: "OZEAN", fr: "OCÉAN", it: "OCEANO", es: "OCÉANO" },
  "RIVER": { de: "FLUSS", fr: "FLEUVE", it: "FIUME", es: "RÍO" },
  "MOUNTAIN": { de: "BERG", fr: "MONTAGNE", it: "MONTAGNA", es: "MONTAÑA" },
  "FOREST": { de: "WALD", fr: "FORÊT", it: "FORESTA", es: "BOSQUE" },
  "HOUSE": { de: "HAUS", fr: "MAISON", it: "CASA", es: "CASA" },
  "CANDLE": { de: "KERZE", fr: "BOUGIE", it: "CANDELA", es: "VELA" },
  "GARDEN": { de: "GARTEN", fr: "JARDIN", it: "GIARDINO", es: "JARDÍN" },
  "BRIDGE": { de: "BRÜCKE", fr: "PONT", it: "PONTE", es: "PUENTE" },
  "ISLAND": { de: "INSEL", fr: "ÎLE", it: "ISOLA", es: "ISLA" },
  "BREEZE": { de: "BRISE", fr: "BRISE", it: "BREZZA", es: "BRISA" },
  "LIGHT": { de: "LICHT", fr: "LUMIÈRE", it: "LUCE", es: "LUZ" },
  "THUNDER": { de: "DONNER", fr: "TONNERRE", it: "TUONO", es: "TRUENO" },
  "RAINBOW": { de: "REGENBOGEN", fr: "ARC-EN-CIEL", it: "ARCOBALENO", es: "ARCOÍRIS" },
  "SMILE": { de: "LÄCHELN", fr: "SOURIRE", it: "SORRISO", es: "SONRISA" },
  "FRIEND": { de: "FREUND", fr: "AMI", it: "AMICO", es: "AMIGO" },
  "FAMILY": { de: "FAMILIE", fr: "FAMILLE", it: "FAMIGLIA", es: "FAMILIA" },
  "APPLE": { de: "APFEL", fr: "POMME", it: "MELA", es: "MANZANA" },
  "BANANA": { de: "BANANE", fr: "BANANE", it: "BANANA", es: "BANANA" },
  "CAR": { de: "AUTO", fr: "VOITURE", it: "AUTO", es: "COCHE" },
  "BOAT": { de: "BOOT", fr: "BATEAU", it: "BARCA", es: "BARCO" },
  "BALL": { de: "BALL", fr: "BALLE", it: "PALLA", es: "PELOTA" },
  "CAKE": { de: "KUCHEN", fr: "GÂTEAU", it: "TORTA", es: "PASTEL" },
  "FROG": { de: "FROSCH", fr: "GRENOUILLE", it: "RANA", es: "RANA" },
  "HORSE": { de: "PFERD", fr: "CHEVAL", it: "CAVALLO", es: "CABALLO" },
  "LION": { de: "LÖWE", fr: "LION", it: "LEONE", es: "LEÓN" },
  "MONKEY": { de: "AFFE", fr: "SINGE", it: "SCIMMIA", es: "MONO" },
  "PANDA": { de: "PANDA", fr: "PANDA", it: "PANDA", es: "PANDA" },
  "PLANE": { de: "FLUGZEUG", fr: "AVION", it: "AEREO", es: "AVIÓN" },
  "TRAIN": { de: "ZUG", fr: "TRAIN", it: "TRENO", es: "TREN" },
  "CANDY": { de: "SÜSSIGKEIT", fr: "BONBON", it: "CARAMELLA", es: "CARAMELO" },
  "KITE": { de: "DRACHEN", fr: "CERF-VOLANT", it: "AQUILONE", es: "COMETA" },
  "BALLOON": { de: "BALLON", fr: "BALLON", it: "PALLONCINO", es: "GLOBO" },
  "PARK": { de: "PARK", fr: "PARC", it: "PARCO", es: "PARQUE" },
  "BEACH": { de: "STRAND", fr: "PLAGE", it: "SPIAGGIA", es: "PLAYA" },
  "TOY": { de: "SPIELZEUG", fr: "JOUET", it: "GIOCATTOLO", es: "JUGUETE" },
  "BOOK": { de: "BUCH", fr: "LIVRE", it: "LIBRO", es: "LIBRO" },
  "BUBBLE": { de: "BLASE", fr: "BULLE", it: "BOLLA", es: "BURBUJA" },
  "SHELL": { de: "MUSCHEL", fr: "COQUILLAGE", it: "CONCHIGLIA", es: "CONCHA" },
  "PEN": { de: "STIFT", fr: "STYLO", it: "PENNA", es: "BOLÍGRAFO" },
  "ICE": { de: "EIS", fr: "GLACE", it: "GHIACCIO", es: "HIELO" },
  "HAT": { de: "HUT", fr: "CHAPEAU", it: "CAPPELLO", es: "SOMBRERO" },
  "SHOE": { de: "SCHUH", fr: "CHAUSSURE", it: "SCARPA", es: "ZAPATO" },
  "CLOCK": { de: "UHR", fr: "HORLOGE", it: "OROLOGIO", es: "RELOJ" },
  "BED": { de: "BETT", fr: "LIT", it: "LETTO", es: "CAMA" },
  "CUP": { de: "TASSE", fr: "TASSE", it: "Tazza", es: "TazA" },
  "KEY": { de: "SCHLÜSSEL", fr: "CLÉ", it: "CHIAVE", es: "LLAVE" },
  "DOOR": { de: "TÜR", fr: "PORTE", it: "PORTA", es: "PUERTA" },
  "CHICKEN": { de: "HÜHNCHEN", fr: "POULET", it: "POLLO", es: "POLLO" },
  "DUCK": { de: "ENTE", fr: "CANARD", it: "ANATRA", es: "PATO" },
  "SHEEP": { de: "SCHAF", fr: "MOUTON", it: "PECORA", es: "OVEJA" },
  "COW": { de: "KUH", fr: "VACHE", it: "MUCCA", es: "VACA" },
  "PIG": { de: "SCHWEIN", fr: "COCHON", it: "MAIALE", es: "CERDO" },
  "GOAT": { de: "ZIEGE", fr: "CHÈVRE", it: "CAPRA", es: "CABRA" },
  "FOX": { de: "FUCHS", fr: "RENARD", it: "VOLPE", es: "ZORRO" },
  "BEAR": { de: "BÄR", fr: "OURS", it: "ORSO", es: "OSO" },
  "DEER": { de: "REH", fr: "CERF", it: "CERVO", es: "CIERVO" },
  "OWL": { de: "EULE", fr: "HIBOU", it: "GUFO", es: "BÚHO" },
  "EGG": { de: "EI", fr: "ŒUF", it: "UOVO", es: "HUEVO" },
  "NEST": { de: "NEST", fr: "NID", it: "NIDO", es: "NIDO" },
  "ROCK": { de: "STEIN", fr: "ROCHE", it: "ROCCIA", es: "ROCA" },
  "LEAF": { de: "BLATT", fr: "FEUILLE", it: "FOGLIA", es: "HOJA" },
  "BRUSH": { de: "PINSEL", fr: "BROSSE", it: "PENNELLO", es: "Pincel" },
  "TOOTH": { de: "ZAHN", fr: "DENT", it: "DENTE", es: "DIENTE" },
  "HAND": { de: "HAND", fr: "MAIN", it: "MANO", es: "MANO" },
  "FEET": { de: "FÜSSE", fr: "PIEDS", it: "PIEDI", es: "PIES" },
  "EYE": { de: "AUGE", fr: "ŒIL", it: "OCCHIO", es: "OJO" },
  "NOSE": { de: "NASE", fr: "NEZ", it: "NASO", es: "NARIZ" },
  "EAR": { de: "OHR", fr: "OREILLE", it: "ORECCHIO", es: "OREJA" },
  "MOUTH": { de: "MUND", fr: "BOUCHE", it: "BOCCA", es: "BOCA" },
  "CHILD": { de: "KIND", fr: "ENFANT", it: "BAMBINO", es: "NIÑO" },
  "RAINCOAT": { de: "REGENMANTEL", fr: "IMPERMÉABLE", it: "IMPERMEABILE", es: "IMPERMEABLE" },
  "LADDER": { de: "LEITER", fr: "ÉCHELLE", it: "SCALA", es: "ESCALERA" },
  "WINDOW": { de: "FENSTER", fr: "FENÊTRE", it: "FINESTRA", es: "VENTANA" },
  "DOCTOR": { de: "ARZT", fr: "MÉDECIN", it: "MEDICO", es: "MÉDICO" },
  "NURSE": { de: "KRANKENSCHWESTER", fr: "INFIRMIÈRE", it: "INFERMIERA", es: "ENFERMERA" },
  "TEACHER": { de: "LEHRER", fr: "ENSEIGNANT", it: "INSEGNANTE", es: "MAESTRO" },
  "STUDENT": { de: "STUDENT", fr: "ÉTUDIANT", it: "STUDENTE", es: "ESTUDIANTE" },
  "PENCIL": { de: "BLEISTIFT", fr: "CRAYON", it: "MATITA", es: "LÁPIZ" },
  "TABLE": { de: "TISCH", fr: "TABLE", it: "Tavolo", es: "MESA" },
  "CHAIR": { de: "STUHL", fr: "CHAISE", it: "SEDIA", es: "SILLA" },
  "LAMP": { de: "LAMPE", fr: "LAMPE", it: "LAMPADA", es: "LÁMPARA" },
  "MIRROR": { de: "SPIEGEL", fr: "MIROIR", it: "SPECCHIO", es: "ESPEJO" },
  "BOWL": { de: "SCHÜSSEL", fr: "BOL", it: "CIOTOLA", es: "CUENCO" },
  "PLATE": { de: "TELLER", fr: "ASSIETTE", it: "PIATTO", es: "PLATO" },
  "SPOON": { de: "LÖFFEL", fr: "CUILLÈRE", it: "CUCCHIAIO", es: "CUCHARA" },
  "FORK": { de: "GABEL", fr: "FOURCHETTE", it: "FORCHETTA", es: "TENEDOR" },
  "KNIFE": { de: "MESSER", fr: "COUTEAU", it: "COLTELLO", es: "CUCHILLO" },
  "GLASS": { de: "GLAS", fr: "VERRE", it: "BICCHIERE", es: "VASO" },
  "STRAW": { de: "STROHHALM", fr: "PAILLE", it: "CANNUCCIA", es: "PAJITA" },
  "RULER": { de: "LINEAL", fr: "RÈGLE", it: "RIGHELLO", es: "REGLA" },
  "PAPER": { de: "PAPIER", fr: "PAPIER", it: "CARTA", es: "PAPEL" },
  "BASKET": { de: "KORB", fr: "PANIER", it: "CESTINO", es: "CESTA" },
  "CARPET": { de: "TEPPICH", fr: "TAPIS", it: "TAPPETO", es: "ALFOMBRA" },
  "SOFA": { de: "SOFA", fr: "CANAPÉ", it: "DIVANO", es: "SOFÁ" },
  "TELEVISION": { de: "FERNSEHER", fr: "TÉLÉVISION", it: "TELEVISIONE", es: "TELEVISIÓN" },
  "RADIO": { de: "RADIO", fr: "RADIO", it: "RADIO", es: "RADIO" },
  "BATTERY": { de: "BATTERIE", fr: "PILE", it: "BATTERIA", es: "BATERÍA" },
  "FENCE": { de: "ZAUN", fr: "CLÔTURE", it: "RECINTO", es: "VALLA" },
  "MAILBOX": { de: "BRIEFKASTEN", fr: "BOÎTE AUX LETTRES", it: "CASSETTA POSTALE", es: "BUZÓN" },
  "BRICK": { de: "BACKSTEIN", fr: "BRIQUE", it: "MATTONE", es: "LADRILLO" },
  "LANTERN": { de: "LATERNE", fr: "LANTERNE", it: "LANTERNA", es: "FAROL" },
  "WHEEL": { de: "RAD", fr: "ROUE", it: "RUOTA", es: "RUEDA" },
  "BELL": { de: "GLOCKE", fr: "CLoche", it: "CAMPANA", es: "CAMPANA" },
  "UMBRELLA": { de: "REGENSCHIRM", fr: "PARAPLUIE", it: "OMBRELLO", es: "PARAGUAS" },
  "TRUCK": { de: "LASTWAGEN", fr: "CAMION", it: "CAMION", es: "CAMIÓN" },
  "MOTORCYCLE": { de: "MOTORRAD", fr: "MOTO", it: "MOTOCICLETTA", es: "MOTOCICLETA" },
  "BICYCLE": { de: "FAHRRAD", fr: "VÉLO", it: "BICICLETTA", es: "BICICLETA" },
  "STOVE": { de: "HERD", fr: "CUISINIÈRE", it: "FORNELLO", es: "ESTUFA" },
  "REFRIGERATOR": { de: "KÜHLSCHRANK", fr: "RÉFRIGÉRATEUR", it: "FRIGORIFERO", es: "REFRIGERADOR" },
  "MICROWAVE": { de: "MIKROWELLE", fr: "MICRO-ONDES", it: "MICROONDE", es: "MICROONDAS" },
  "WASHER": { de: "WASCHMASCHINE", fr: "LAVE-LINGE", it: "LAVATRICE", es: "LAVADORA" },
  "DRYER": { de: "TROCKNER", fr: "SÈCHE-LINGE", it: "ASCUGATRICE", es: "SECADORA" },
  "FURNACE": { de: "OFEN", fr: "FOURNAISE", it: "FORNACE", es: "HORNO" },
  "FAN": { de: "VENTILATOR", fr: "VENTILATEUR", it: "VENTILATORE", es: "VENTILADOR" },
  "PAINTBRUSH": { de: "PINSEL", fr: "PINCEAU", it: "PENNELLO", es: "Pincel" },
  "BUCKET": { de: "EIMER", fr: "SEAU", it: "SECCHIO", es: "CUBO" },
  "SPONGE": { de: "SCHWAMM", fr: "ÉPONGE", it: "SPUGNA", es: "ESPONJA" },
  "SOAP": { de: "SEIFE", fr: "SAVON", it: "SAPONE", es: "JABÓN" },
  "TOWEL": { de: "HANDTUCH", fr: "SERVIETTE", it: "ASCIUGAMANO", es: "TOALLA" },
  "CLOTH": { de: "STOFF", fr: "TISSU", it: "STOFFA", es: "TELA" },
  "SCISSORS": { de: "SCHERE", fr: "CISEAUX", it: "FORBICI", es: "TIJERAS" },
  // "TAPE": { de: "KLEBEBAND", fr: "RUBAN ADESÍF", it: "NASTRO ADESIVO", es: "CINTA ADESIVA" },
  "RIBBON": { de: "BAND", fr: "RUBAN", it: "NASTRO", es: "CINTA" },
  "THREAD": { de: "FADEN", fr: "FIL", it: "FILO", es: "HILO" },
  "NEEDLE": { de: "NADEL", fr: "AIGUILLE", it: "AGO", es: "AGUJA" },
  "BUTTON": { de: "KNOPF", fr: "BOUTON", it: "BOTTONE", es: "BOTÓN" },
  // "ZIPPER": { de: "REISSVERSCHLUSS", fr: "FERMETURE ÉCLAIR", it: "CERNIERA", es: "CREMALLERA" },
  "SLIPPER": { de: "HAUSSCHUH", fr: "PANTOUFLE", it: "PANTOFOLE", es: "PANTUFLA" },
  "COAT": { de: "MANTEL", fr: "MANTEAU", it: "CAPPOTTO", es: "ABRIGO" },
  "MITTEN": { de: "FAUSTHANDSCHUH", fr: "MOUFLE", it: "GUANTO", es: "MANOPLA" },
  "SCARF": { de: "SCHAL", fr: "ÉCHARPE", it: "SCIARPA", es: "BUFANDA" },
  "GLOVE": { de: "HANDSCHUH", fr: "GANT", it: "GUANTO", es: "GUANTE" },
  "PANTS": { de: "HOSE", fr: "PANTALON", it: "PANTALONI", es: "PANTALONES" },
  "SHIRT": { de: "HEMD", fr: "CHEMISE", it: "CAMICIA", es: "CAMISA" },
  "JACKET": { de: "JACKE", fr: "VESTE", it: "GIACCA", es: "CHAQUETA" },
  "DRESS": { de: "KLEID", fr: "ROBE", it: "VESTITO", es: "VESTIDO" },
  "SKIRT": { de: "ROCK", fr: "JUPE", it: "GONNA", es: "FALDA" },
  "SOCK": { de: "SOCKE", fr: "CHAUSSETTE", it: "CALZINO", es: "CALCETÍN" },
  "BOOT": { de: "STIEFEL", fr: "BOTTE", it: "STIVALE", es: "BOTA" },
  "SANDAL": { de: "SANDALE", fr: "SANDALE", it: "SANDALO", es: "SANDALIA" },
  "CAP": { de: "MÜTZE", fr: "CASQUETTE", it: "BERRETTO", es: "GORRA" },
  "MASK": { de: "MASKE", fr: "MASQUE", it: "MASCHERA", es: "MÁSCARA" },
  // "SUNGLASSES": { de: "SONNENBRILLE", fr: "LUNETTES DE SOLEIL", it: "OCCHIALI DA SOLE", es: "GAFAS DE SOL" },
  "WATCH": { de: "UHR", fr: "MONTRE", it: "OROLOGIO", es: "RELOJ" },
  "NECKLACE": { de: "HALSKETTE", fr: "COLLER", it: "COLLANA", es: "COLLAR" },
  "BRACELET": { de: "ARMBAND", fr: "BRACELET", it: "BRACCIALE", es: "PULSERA" },
  "RING": { de: "RING", fr: "BAGUE", it: "ANELLO", es: "ANILLO" },
  // "EARRING": { de: "OHRRING", fr: "BOUCLE D'OREILLE", it: "ORECCHINO", es: "PENDIENTE" },
  "BACKPACK": { de: "RUCKSACK", fr: "SAC À DOS", it: "ZAINO", es: "MOCHILA" },
  "SUITCASE": { de: "KOFFER", fr: "VALISE", it: "VALIGIA", es: "MALETA" },
  "TICKET": { de: "TICKET", fr: "BILLET", it: "BIGLIETTO", es: "BILLETE" },
  "PASSPORT": { de: "REISEPASS", fr: "PASSEPORT", it: "PASSAPORTO", es: "PASAPORTE" },
  "MAP": { de: "KARTE", fr: "CARTE", it: "MAPP", es: "MAPA" },
  "COMPASS": { de: "KOMPASS", fr: "BOUSSOLE", it: "BUSSOLA", es: "BRÚJULA" },
  "TORCH": { de: "FACKEL", fr: "TORCHE", it: "TORCIA", es: "ANTORCHA" },
  // "FLASHLIGHT": { de: "TASCHENLAMPE", fr: "LAMPE DE POCHE", it: "TORCIA ELETTRICA", es: "LINterna" },
  "CAMPFIRE": { de: "LAGERFEUER", fr: "FEU DE CAMP", it: "FALÒ", es: "FOGATA" },
  "TENT": { de: "ZELT", fr: "TENTE", it: "TENDA", es: "TIENDA DE CAMPAÑA" },
  // "SLEEPINGBAG": { de: "SCHLAFSACK", fr: "SAC DE COUCHAGE", it: "SACCO A PELO", es: "SACO DE DORMIR" },
  "PICNIC": { de: "PICKNICK", fr: "PIQUE-NIQUE", it: "PICNIC", es: "PICNIC" },
  "BENCH": { de: "BANK", fr: "BANC", it: "PANCHINA", es: "BANCO" },
  "GATE": { de: "TOR", fr: "PORTAIL", it: "CANCELLO", es: "PORTÓN" },
  "SIGN": { de: "SCHILD", fr: "PANNEAU", it: "SEGNALE", es: "SEÑAL" },
  // "CROSSWALK": { de: "ZEBRASTREIFEN", fr: "PASSAGE PIÉTONS", it: "ATTRAVERSAMENTO PEDONALE", es: "PASO DE PEATONES" },
  // "TRAFFICLIGHT": { de: "VERKEHRSAMPEL", fr: "FEU DE CIRCULATION", it: "SEMAFORO", es: "SEMÁFORO" },
  "SIDEWALK": { de: "BÜRGERSTEIG", fr: "TROTTOIR", it: "MARCIAPIEDE", es: "ACERA" },
  "POSTCARD": { de: "POSTKARTE", fr: "CARTE POSTALE", it: "CARTOLINA", es: "POSTAL" },
  "STAMP": { de: "BRIEFMARKE", fr: "TIMBRE", it: "FRANCOBOLLO", es: "SELLO" },
  "LETTER": { de: "BRIEF", fr: "LETTRE", it: "LETTERA", es: "CARTA" },
  "ENVELOPE": { de: "UMSCHLAG", fr: "ENVELOPPE", it: "BUSTA", es: "SOBRE" },
  "PARKING": { de: "PARKPLATZ", fr: "PARKING", it: "PARCHEGGIO", es: "ESTACIONAMIENTO" },
  "STREET": { de: "STRAßE", fr: "RUE", it: "STRADA", es: "CALLE" },
  "HIGHWAY": { de: "AUTOBAHN", fr: "AUTOROUTE", it: "AUTOSTRADA", es: "AUTOPISTA" },
  "TUNNEL": { de: "TUNNEL", fr: "TUNNEL", it: "GALLERIA", es: "TÚNEL" },
  "STATUE": { de: "STATUE", fr: "STATUE", it: "STATUA", es: "ESTATUA" },
  "FOUNTAIN": { de: "BRUNNEN", fr: "FONTAINE", it: "FONTANA", es: "FUENTE" },
  "TOWER": { de: "TURM", fr: "TOUR", it: "TORRE", es: "TORRE" },
  "CASTLE": { de: "SCHLOSS", fr: "CHÂTEAU", it: "CASTELLO", es: "CASTILLO" },
  "PYRAMID": { de: "PYRAMIDE", fr: "PYRAMIDE", it: "PIRAMIDE", es: "PIRÁMIDE" },
  "PLANET": { de: "PLANET", fr: "PLANÈTE", it: "PIANETA", es: "PLANETA" },
  "GALAXY": { de: "GALAXIE", fr: "GALAXIE", it: "GALASSIA", es: "GALAXIA" },
  "SATELLITE": { de: "SATELLIT", fr: "SATELLITE", it: "SATELLITE", es: "SATÉLITE" },
  "ASTRONAUT": { de: "ASTRONAUT", fr: "ASTRONAUTE", it: "ASTRONAUTA", es: "ASTRONAUTA" },
  "TELESCOPE": { de: "TELESCOP", fr: "TÉLESCOPE", it: "TELESCOPIO", es: "TELESCOPIO" },
  "MICROSCOPE": { de: "MIKROSKOP", fr: "MICROSCOPE", it: "MICROSCOPIO", es: "MICROSCOPIO" },
  "MAGNET": { de: "MAGNET", fr: "AIMANT", it: "MAGNETE", es: "IMÁN" },
  "BULB": { de: "GLÜHBIRNE", fr: "AMPOULE", it: "LAMPADINA", es: "BOMBILLA" },
  "SOCKET": { de: "STECKDOSE", fr: "PRISE", it: "PRESA", es: "ENCHUFE" },
  "PLUG": { de: "STECKER", fr: "FICHE", it: "SPINA", es: "CLAVIJA" },
  "WIRE": { de: "DRAHT", fr: "FIL", it: "FILO", es: "CABLE" },
  "SWITCH": { de: "SCHALTER", fr: "INTERRUPTEUR", it: "INTERRUTTORE", es: "INTERRUPTOR" },
  "CIRCUIT": { de: "SCHALTUNG", fr: "CIRCUIT", it: "CIRCUITO", es: "CIRCUITO" },
  "ROBOT": { de: "ROBOTER", fr: "ROBOT", it: "ROBOT", es: "ROBOT" },
  "COMPUTER": { de: "COMPUTER", fr: "ORDINATEUR", it: "COMPUTER", es: "ORDENADOR" },
  "MOUSE": { de: "MAUS", fr: "SOURIS", it: "MOUSE", es: "RATÓN" },
  "KEYBOARD": { de: "TASTATUR", fr: "CLAVIER", it: "TASTIERA", es: "TECLADO" },
  "SCREEN": { de: "BILDSCHIRM", fr: "ÉCRAN", it: "SCHERMO", es: "PANTALLA" },
  "PRINTER": { de: "DRUCKER", fr: "IMPRIMANTE", it: "STAMPANTE", es: "IMPRESORA" },
  "SPEAKER": { de: "LAUTSPRECHER", fr: "HAUT-PARLEUR", it: "ALTOPARLANTE", es: "ALTAVOZ" },
  "HEADPHONE": { de: "KOPFHÖRER", fr: "CASQUE", it: "CUFFIE", es: "AURICULARES" },
  "PHONE": { de: "TELEFON", fr: "TÉLÉPHONE", it: "TELEFONO", es: "TELÉFONO" },
  // "CAMERA": { de: "KAMERA", fr: "APPAREIL PHOTO", it: "FOTOCAMERA", es: "CÁMARA" },
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

  // Create a copy of the word list to avoid duplicates
  const availableWords = [...englishWords];

  for (let i = 0; i < count; i++) {
    if (availableWords.length === 0) {
      // If we run out of unique words, reset the available words
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

    // Generate one set of English words
    const selectedEnglishWords = generateEnglishRandomWords(10);
    const languages = ['en', 'de', 'fr', 'it', 'es'];
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