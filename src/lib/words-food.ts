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
  "HONEY",
  "GRAPES",
  "LEMON",
  "PEPPER",
  "ONION",
  "GARLIC",
  "CABBAGE",
  "BROCCOLI",
  "SPINACH",
  "MUSHROOM",
  "PUMPKIN",
  "ZUCCHINI",
  "CORN",
  "AVOCADO",
  "YOGURT",
  "NUTS",
  "CEREAL",
  "PUDDING",
  "JAM"
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
  "HONIG",
  "TRAUBE",
  "ZITRONE",
  "PFEFFER",
  "ZWIEBEL",
  "KNOBLAUCH",
  "KOHLSALAT",
  "BROKKOLI",
  "SPINAT",
  "PILZ",
  "KÜRBIS",
  "ZUCCHINI",
  "PAPRIKA",
  "MAIS",
  "AVOCADO",
  "JOGHURT",
  "NÜSSE",
  "MÜSLI",
  "PUDDING",
  "MARMELADE"
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
  "MIEL",
  "RAISIN",
  "CITRON",
  "POIVRON",
  "OIGNON",
  "AIL",
  "CHOU",
  "BROCOLI",
  "ÉPINARD",
  "CHAMPIGNON",
  "COURGE",
  "COURGETTE",
  "MAÏS",
  "AVOCAT",
  "YAOURT",
  "NOIX",
  "CÉRÉALES",
  "CRÈME",
  "CONFITURE"
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
  "MIELE",
  "UVA",
  "LIMONE",
  "PEPERONE",
  "CIPOLLA",
  "AGLIO",
  "CAVOLO",
  "BROCCOLI",
  "SPINACI",
  "FUNGHI",
  "ZUCCA",
  "ZUCCHINI",
  "MAIS",
  "AVOCADO",
  "YOGURT",
  "NOCI",
  "CEREALI",
  "CREMA",
  "MARMELLATA"
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
  "MIEL",
  "UVAS",
  "LIMÓN",
  "PIMIENTA",
  "CEBOLLA",
  "AJO",
  "COL",
  "BRÓCOLI",
  "ESPINACA",
  "CHAMPIÑÓN",
  "CALABAZA",
  "CALABACÍN",
  "PIMIENTO",
  "MAÍZ",
  "AGUACATE",
  "YOGUR",
  "NUECES",
  "CEREALES",
  "CREMA",
  "MERMELADA"
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