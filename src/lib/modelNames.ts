export const modelNames: Record<string, string> = {
  'google/gemini-2.0-flash-exp:free': 'Gemini 2.0 Flash',
  'mistralai/mistral-nemo': 'Mistral Nemo',
  // Add more models as needed
};

export const getModelDisplayName = (modelId: string): string => {
  return modelNames[modelId] || modelId;
}; 