// ES Module version of the model names updater
import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the current file's directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Set up unhandled rejection handler
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

/**
 * Clean up model name by removing ":", "(free)" and deduplicating words
 * @param {string} name - Original model name
 * @returns {string} - Cleaned model name
 */
function cleanModelName(name) {
  // Remove ": " and " (free)" from name
  let cleanedName = name.replace(/:\s*/g, ' ').replace(/\s*\(free\)/g, '');
  
  // Split by space to check for duplicated words
  const words = cleanedName.split(' ');
  const result = [];
  
  for (let i = 0; i < words.length; i++) {
    // Skip this word if it's the same as the next word
    if (i < words.length - 1 && words[i].toLowerCase() === words[i + 1].toLowerCase()) {
      continue;
    }
    result.push(words[i]);
  }
  
  return result.join(' ').trim();
}

async function updateModelNames() {
  try {
    console.log('Fetching models from OpenRouter API...');
    const response = await axios.get('https://openrouter.ai/api/v1/models');
    
    if (!response.data || !response.data.data) {
      console.error('Invalid response format:', JSON.stringify(response.data));
      process.exit(1);
    }
    
    const models = response.data.data;
    console.log(`Received ${models.length} models from API`);

    const modelNames = {};
    
    models.forEach((model) => {
      modelNames[model.id] = cleanModelName(model.name);
    });

    // Get path to the modelNames.ts file
    const modelNamesPath = path.join(__dirname, '..', 'src', 'lib', 'modelNames.ts');
    console.log(`Updating file at: ${modelNamesPath}`);
    
    try {
      const currentContent = fs.readFileSync(modelNamesPath, 'utf-8');
      console.log('Successfully read existing modelNames.ts file');
      
      // Create the new content
      const newContent = `export const modelNames: Record<string, string> = ${JSON.stringify(modelNames, null, 2)};

export const getModelDisplayName = (modelId: string): string => {
  return modelNames[modelId] || modelId;
};`;

      // Write the updated content back to the file
      fs.writeFileSync(modelNamesPath, newContent);
      console.log('Successfully updated model names!');
    } catch (fileError) {
      console.error('Error working with the file:', fileError);
      process.exit(1);
    }
  } catch (error) {
    console.error('Caught error in updateModelNames:');
    
    if (axios.isAxiosError(error)) {
      console.error('API Error:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message
      });
    } else if (error instanceof Error) {
      console.error('Error details:', error.message, error.stack);
    } else {
      console.error('Unknown error type:', typeof error, JSON.stringify(error));
    }
    
    process.exit(1);
  }
}

// Run the function using an immediately invoked async function expression (IIFE)
(async () => {
  try {
    await updateModelNames();
    console.log('Script completed successfully!');
  } catch (err) {
    console.error('Final error handler caught:', err);
    process.exit(1);
  }
})(); 