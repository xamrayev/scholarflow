import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || ''; // In a real app, ensure this is set safely
// Note: In this demo environment, we assume the environment variable is injected.

const ai = new GoogleGenAI({ apiKey });

export const summarizeContent = async (text: string): Promise<string> => {
  if (!apiKey) return "API Key not configured.";

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Provide a concise, 3-sentence summary of the following academic abstract suitable for a general audience: ${text}`,
    });
    return response.text || "Could not generate summary.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Failed to generate summary. Please check your network or API key.";
  }
};

export const semanticSearch = async (query: string, journals: string[]): Promise<string[]> => {
    if (!apiKey) return [];
    
    try {
        const prompt = `
        I have the following list of academic journals:
        ${JSON.stringify(journals)}
        
        The user is searching for: "${query}".
        
        Return a JSON array of strings containing ONLY the exact names of the journals that are most relevant to this search query. 
        If none are relevant, return an empty array.
        `;
        
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json'
            }
        });
        
        const text = response.text;
        if (!text) return [];
        return JSON.parse(text) as string[];
    } catch (e) {
        console.error(e);
        return [];
    }
}