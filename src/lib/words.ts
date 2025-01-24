// A small list of random words for the game
export const words = [
  "ELEPHANT",
  "SUNSHINE",
  "RAINBOW",
  "BUTTERFLY",
  "MOUNTAIN",
  "OCEAN",
  "GALAXY",
  "WHISPER",
  "BREEZE",
  "DIAMOND",
];

export const getRandomWord = () => {
  return words[Math.floor(Math.random() * words.length)];
};