export const normalizeWord = (word: string): string => {
  return word.normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z]/g, '')
    .trim();
};