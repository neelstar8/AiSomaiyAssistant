
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { RAG_SYSTEM_INSTRUCTION, VISION_SYSTEM_INSTRUCTION } from "../constants";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getRAGResponse = async (query: string, knowledgeContext: string, history: any[] = []) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: history.length > 0 ? history.map(h => ({
        role: h.role,
        parts: [{ text: h.text }]
      })) : query,
      config: {
        systemInstruction: RAG_SYSTEM_INSTRUCTION(knowledgeContext),
        temperature: 0.0, // Absolute zero temperature for maximum grounding and link accuracy
      },
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "I am currently experiencing connectivity issues. Please try again later.";
  }
};

export const analyzeInfrastructure = async (imageB64: string, description: string) => {
  try {
    const imagePart = {
      inlineData: {
        mimeType: 'image/jpeg',
        data: imageB64.split(',')[1],
      },
    };
    const textPart = {
      text: `Analyze this image for infrastructure damage. User description: "${description}"`,
    };

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: { parts: [imagePart, textPart] },
      config: {
        systemInstruction: VISION_SYSTEM_INSTRUCTION,
      }
    });

    return response.text;
  } catch (error) {
    console.error("Vision Error:", error);
    return "Failed to analyze the image.";
  }
};
