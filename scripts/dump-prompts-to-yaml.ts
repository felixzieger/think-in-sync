import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

// Define the structure for our prompt files
interface PromptFile {
  messages: {
    role: string;
    content: string;
  }[];
  model: string;
  modelParameters: {
    max_tokens: number;
  };
  testData: {
    input: string;
    expected: string;
  }[];
  evaluators: {
    name: string;
    uses?: string;
    string?: {
      contains: string;
    };
  }[];
}

// Function to extract prompts from a file
function extractPromptsFromFile(filePath: string): Record<string, PromptFile> {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const prompts: Record<string, PromptFile> = {};

    // Extract languagePrompts object
    const languagePromptsMatch = content.match(/const languagePrompts = ({[\s\S]*?});/);
    if (!languagePromptsMatch) {
      console.error(`No languagePrompts found in ${filePath}`);
      return prompts;
    }

    const languagePromptsStr = languagePromptsMatch[1];
    const languagePrompts = eval(`(${languagePromptsStr})`);

    // For each language, create a prompt file
    Object.entries(languagePrompts).forEach(([lang, promptData]: [string, any]) => {
      let userContent: string;
      
      // Handle different prompt structures
      if ('systemPrompt' in promptData && 'requirements' in promptData) {
        // generate-themed-word format
        userContent = `${promptData.systemPrompt} "{{word}}".\n${promptData.requirements} {{input}}`;
      } else if ('systemPrompt' in promptData && 'task' in promptData) {
        // generate-word format
        userContent = `${promptData.systemPrompt} "{{word}}". ${promptData.task} ${promptData.instruction} "{{input}}". ${promptData.noQuotes}`;
      } else if ('systemPrompt' in promptData && 'instruction' in promptData && 'responseInstruction' in promptData) {
        // guess-word format
        userContent = `${promptData.systemPrompt} ${promptData.responseInstruction}\n\n${promptData.instruction} "{{input}}"`;
      } else {
        console.error(`Unknown prompt format in ${filePath} for language ${lang}`);
        return;
      }

      const promptFile: PromptFile = {
        messages: [
          {
            role: 'system',
            content: ''
          },
          {
            role: 'user',
            content: userContent
          }
        ],
        model: 'openai/gpt-4.1-nano',
        modelParameters: {
          max_tokens: 4096
        },
        testData: [],
        evaluators: [
          {
            name: 'Similarity',
            uses: 'github/similarity'
          }
        ]
      };

      prompts[lang] = promptFile;
    });

    return prompts;
  } catch (error) {
    console.error(`Error processing file ${filePath}:`, error);
    return {};
  }
}

// Main function to process all Supabase functions
async function main() {
  try {
    const functionsDir = path.join(process.cwd(), 'supabase', 'functions');
    const promptsDir = path.join(process.cwd(), 'prompts');

    // Create prompts directory if it doesn't exist
    if (!fs.existsSync(promptsDir)) {
      fs.mkdirSync(promptsDir, { recursive: true });
    }

    // Get all function directories
    const functionDirs = fs.readdirSync(functionsDir)
      .filter(dir => fs.statSync(path.join(functionsDir, dir)).isDirectory());

    // Process each function
    for (const dir of functionDirs) {
      const indexFile = path.join(functionsDir, dir, 'index.ts');
      if (fs.existsSync(indexFile)) {
        const prompts = extractPromptsFromFile(indexFile);
        
        // Save each language's prompts
        for (const [lang, promptFile] of Object.entries(prompts)) {
          const outputFile = path.join(promptsDir, `${dir}-${lang}.prompt.yml`);
          const yamlContent = yaml.dump(promptFile, {
            indent: 2,
            lineWidth: -1,
            noRefs: true
          });
          fs.writeFileSync(outputFile, yamlContent);
          console.log(`Created ${outputFile}`);
        }
      }
    }
  } catch (error) {
    console.error('Error in main function:', error);
    process.exit(1);
  }
}

// Run the main function and handle any uncaught errors
main().catch(error => {
  console.error('Unhandled error:', error);
  process.exit(1);
}); 