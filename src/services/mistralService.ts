import { Mistral } from '@mistralai/mistralai';

const apiKey = import.meta.env.VITE_MISTRAL_API_KEY;
const client = new Mistral({ apiKey });

export const generateAIResponse = async (currentWord: string, currentSentence: string[]) => {
  const response = await client.chat.complete({
    model: "ministral-8b-latest",
    messages: [
      {
        role: "system",
        content: `You are helping in a word game. The secret word is "${currentWord}". 
                  Your task is to add ONE word to help describe this word without using it directly. 
                  The words must form a correct sentence in English.
                  The current sentence is: "${currentSentence.join(' ')}". 
                  Respond the sentence and add one appropriate word that continues the sentence naturally.
                  Do not add quotes or punctuation.`
      }
    ],
    max_tokens: 10,
    temperature: 0.7
  });

  const word = response.choices[0].message.content.trim().split(' ').pop().replace(/"/g, '');
  console.log('AI generated word:', word);
  return word;
};