export const englishSportsWords = [
  "SOCCER",
  "TENNIS",
  "GOLF",
  "BASEBALL",
  "BASKETBALL",
  "VOLLEYBALL",
  "HOCKEY",
  "RUGBY",
  "CRICKET",
  "SWIMMING",
  "RUNNING",
  "CYCLING",
  "SKIING",
  "BOXING",
  "SKATING",
  "SURFING",
  "CLIMBING",
  "DIVING",
  "SAILING",
  "WRESTLING"
];

export const germanSportsWords = [
  "FUSSBALL",
  "TENNIS",
  "GOLF",
  "BASEBALL",
  "BASKETBALL",
  "VOLLEYBALL",
  "HOCKEY",
  "RUGBY",
  "CRICKET",
  "SCHWIMMEN",
  "LAUFEN",
  "RADFAHREN",
  "SKIFAHREN",
  "BOXEN",
  "EISLAUFEN",
  "SURFEN",
  "KLETTERN",
  "TAUCHEN",
  "SEGELN",
  "RINGEN"
];

export const frenchSportsWords = [
  "FOOTBALL",
  "TENNIS",
  "GOLF",
  "BASEBALL",
  "BASKETBALL",
  "VOLLEYBALL",
  "HOCKEY",
  "RUGBY",
  "CRICKET",
  "NATATION",
  "COURSE",
  "CYCLISME",
  "SKI",
  "BOXE",
  "PATINAGE",
  "SURF",
  "ESCALADE",
  "PLONGÉE",
  "VOILE",
  "LUTTE"
];

export const italianSportsWords = [
  "CALCIO",
  "TENNIS",
  "GOLF",
  "BASEBALL",
  "PALLACANESTRO",
  "PALLAVOLO",
  "HOCKEY",
  "RUGBY",
  "CRICKET",
  "NUOTO",
  "CORSA",
  "CICLISMO",
  "SCI",
  "PUGILATO",
  "PATTINAGGIO",
  "SURF",
  "ARRAMPICATA",
  "IMMERSIONE",
  "VELA",
  "LOTTA"
];

export const spanishSportsWords = [
  "FÚTBOL",
  "TENIS",
  "GOLF",
  "BÉISBOL",
  "BALONCESTO",
  "VOLEIBOL",
  "HOCKEY",
  "RUGBY",
  "CRÍQUET",
  "NATACIÓN",
  "CARRERA",
  "CICLISMO",
  "ESQUÍ",
  "BOXEO",
  "PATINAJE",
  "SURF",
  "ESCALADA",
  "BUCEO",
  "VELA",
  "LUCHA"
];

export const getRandomSportsWord = (language: string = 'en') => {
  let wordList;
  switch (language) {
    case 'de':
      wordList = germanSportsWords;
      break;
    case 'fr':
      wordList = frenchSportsWords;
      break;
    case 'it':
      wordList = italianSportsWords;
      break;
    case 'es':
      wordList = spanishSportsWords;
      break;
    default:
      wordList = englishSportsWords;
  }
  return wordList[Math.floor(Math.random() * wordList.length)];
};