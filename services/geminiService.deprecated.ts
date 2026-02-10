import { GoogleGenAI, Type } from "@google/genai";
import { ScriptAnalysisResult, VideoIdea } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const ANALYSIS_MODEL = "gemini-3-flash-preview";

export const analyzeScript = async (scriptContent: string): Promise<ScriptAnalysisResult> => {
  try {
    const response = await ai.models.generateContent({
      model: ANALYSIS_MODEL,
      contents: `Analyze the following video script/concept for a creator content platform. Provide a critical assessment.
      
      Script:
      ${scriptContent}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.NUMBER, description: "Overall score out of 100" },
            hookStrength: { type: Type.STRING, description: "Analysis of the first 5-10 seconds" },
            pacing: { type: Type.STRING, description: "Critique of flow" },
            viralPotential: { type: Type.STRING, description: "Engagement likelihood" },
            keyImprovements: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "3-5 actionable improvements"
            },
            reachAnalysis: {
              type: Type.OBJECT,
              properties: {
                retentionScore: { type: Type.NUMBER, description: "Score 0-100 for audience retention capability" },
                retentionInsight: { type: Type.STRING, description: "Why retention is high/low" },
                lightingSuggestions: { type: Type.STRING, description: "Visual/Lighting advice (Warning/Caution tone if needed)" },
                captionTips: { type: Type.STRING, description: "Accessibility and captioning strategy" }
              },
              required: ["retentionScore", "retentionInsight", "lightingSuggestions", "captionTips"]
            }
          },
          required: ["score", "hookStrength", "pacing", "viralPotential", "keyImprovements", "reachAnalysis"]
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as ScriptAnalysisResult;
    }
    throw new Error("No response text from Gemini");
  } catch (error) {
    console.error("Analysis failed:", error);
    throw error;
  }
};

export const generateVideoIdeas = async (topic: string): Promise<VideoIdea[]> => {
  try {
    const response = await ai.models.generateContent({
      model: ANALYSIS_MODEL,
      contents: `Generate 5 high-potential video ideas based on the topic: "${topic}". Focus on professional, educational, or entertainment niches.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              logline: { type: Type.STRING },
              targetAudience: { type: Type.STRING },
              estimatedViews: { type: Type.STRING, description: "A realistic projection (e.g. 50k-100k)" }
            },
            required: ["title", "logline", "targetAudience", "estimatedViews"]
          }
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as VideoIdea[];
    }
    throw new Error("No response text from Gemini");
  } catch (error) {
    console.error("Idea generation failed:", error);
    throw error;
  }
};