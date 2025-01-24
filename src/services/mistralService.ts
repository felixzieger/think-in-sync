import { Mistral } from '@mistralai/mistralai';

export const generateAIResponse = async (currentWord: string, currentSentence: string[]) => {
  try {
    const apiKey = import.meta.env.VITE_MISTRAL_API_KEY;
    // Create client instance inside the function
    const client = new Mistral({ apiKey });

    console.log('Generating AI response for word:', currentWord);
    console.log('Current sentence:', currentSentence);

    const response = await client.chat.complete({
      model: "mistral-large-latest",
      messages: [
        {
          role: "system",
          content: `You are helping in a word game. The secret word is "${currentWord}". 
                    Your task is to add ONE word to help describe this word without using it directly. 
                    The words must form a correct sentence in English.
                    The current sentence is: "${currentSentence.join(' ')}". 
                    Respond with just one appropriate word that continues the sentence naturally.
                    Do not add quotes or punctuation.`
        }
      ],
      max_tokens: 10,
      temperature: 0.7
    });

    const word = response.choices[0].message.content.trim().split(' ').pop().replace(/"/g, '');
    console.log('AI generated word:', word);
    return word;
  } catch (error) {
    console.error('Error generating AI response:', error);
    return 'the'; // Fallback word in case of error
  }
};