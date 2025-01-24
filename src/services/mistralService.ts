import axios from 'axios';

const MISTRAL_API_URL = 'https://api.mistral.ai/v1/chat/completions';

export const generateAIResponse = async (currentWord: string, currentSentence: string[]) => {
  try {
    const response = await axios.post(
      MISTRAL_API_URL,
      {
        model: "mistral-tiny",
        messages: [
          {
            role: "system",
            content: `You are helping in a word game. The secret word is "${currentWord}". 
                     Your task is to add ONE word to help describe this word without using it directly. 
                     The current sentence is: "${currentSentence.join(' ')}". 
                     Respond with just one appropriate word that continues the sentence naturally.`
          }
        ],
        max_tokens: 10,
        temperature: 0.7
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_MISTRAL_API_KEY}`
        }
      }
    );

    const word = response.data.choices[0].message.content.trim().split(' ')[0];
    console.log('AI generated word:', word);
    return word;
  } catch (error) {
    console.error('Error generating AI response:', error);
    return getDefaultWord(currentSentence);
  }
};

// Fallback function in case the API fails
const getDefaultWord = (currentSentence: string[]) => {
  const connectingWords = ["is", "looks", "appears", "seems", "feels"];
  const descriptiveWords = ["very", "quite", "really", "extremely", "notably"];
  
  if (currentSentence.length === 0) {
    return "this";
  } else if (currentSentence.length === 1) {
    return connectingWords[Math.floor(Math.random() * connectingWords.length)];
  } else {
    return descriptiveWords[Math.floor(Math.random() * descriptiveWords.length)];
  }
};