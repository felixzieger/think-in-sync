export const englishFoodWords = [
  "PIZZA",
  "PASTA",
  "BREAD",
  "CHEESE",
  "APPLE",
  "BANANA",
  "ORANGE",
  "CARROT",
  "POTATO",
  "TOMATO",
  "CHICKEN",
  "BEEF",
  "FISH",
  "RICE",
  "SOUP",
  "SALAD",
  "CAKE",
  "COOKIE",
  "CHOCOLATE",
  "HONEY"
];

export const germanFoodWords = [
  "PIZZA",
  "NUDELN",
  "BROT",
  "KÄSE",
  "APFEL",
  "BANANE",
  "ORANGE",
  "KAROTTE",
  "KARTOFFEL",
  "TOMATE",
  "HUHN",
  "RINDFLEISCH",
  "FISCH",
  "REIS",
  "SUPPE",
  "SALAT",
  "KUCHEN",
  "KEKS",
  "SCHOKOLADE",
  "HONIG"
];

export const frenchFoodWords = [
  "PIZZA",
  "PÂTES",
  "PAIN",
  "FROMAGE",
  "POMME",
  "BANANE",
  "ORANGE",
  "CAROTTE",
  "POMMETERRE",
  "TOMATE",
  "POULET",
  "BOEUF",
  "POISSON",
  "RIZ",
  "SOUPE",
  "SALADE",
  "GÂTEAU",
  "BISCUIT",
  "CHOCOLAT",
  "MIEL"
];

export const italianFoodWords = [
  "PIZZA",
  "PASTA",
  "PANE",
  "FORMAGGIO",
  "MELA",
  "BANANA",
  "ARANCIA",
  "CAROTA",
  "PATATA",
  "POMODORO",
  "POLLO",
  "MANZO",
  "PESCE",
  "RISO",
  "ZUPPA",
  "INSALATA",
  "TORTA",
  "BISCOTTO",
  "CIOCCOLATO",
  "MIELE"
];

export const spanishFoodWords = [
  "PIZZA",
  "PASTA",
  "PAN",
  "QUESO",
  "MANZANA",
  "PLÁTANO",
  "NARANJA",
  "ZANAHORIA",
  "PATATA",
  "TOMATE",
  "POLLO",
  "TERNERA",
  "PESCADO",
  "ARROZ",
  "SOPA",
  "ENSALADA",
  "PASTEL",
  "GALLETA",
  "CHOCOLATE",
  "MIEL"
];

export const getRandomFoodWord = (language: string = 'en') => {
  let wordList;
  switch (language) {
    case 'de':
      wordList = germanFoodWords;
      break;
    case 'fr':
      wordList = frenchFoodWords;
      break;
    case 'it':
      wordList = italianFoodWords;
      break;
    case 'es':
      wordList = spanishFoodWords;
      break;
    default:
      wordList = englishFoodWords;
  }
  return wordList[Math.floor(Math.random() * wordList.length)];
};