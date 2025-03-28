import nlp from 'compromise';

export const normalizeWord = (word: string, language: string = 'en'): string => {
  let processedWord = word;
  
  // Only apply compromise for English
  if (language === 'en') {
    const doc = nlp(word);
    processedWord = doc.nouns().toSingular().out('text');
    
    // Handle cases where compromise doesn't produce output
    if (!processedWord) {
      processedWord = word;
    }
  }

  // Apply standard normalization for all languages
  return processedWord
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()

    // Handle German umlauts and their alternative spellings
    .replace(/ü/g, 'ue')
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ß/g, 'ss')

    .replace(/[^a-z]/g, '')
    .trim();
};
