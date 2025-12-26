
import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { GymConfig } from "../types";

const chatSessions: Record<string, Chat> = {};

const getSystemInstruction = (type: 'front_desk' | 'trainer', gym: GymConfig) => {
  if (type === 'front_desk') {
    return `
      You are "FitBot", the elite AI Concierge for "${gym.name}".
      Context: ${gym.name} uses advanced AI scheduling.
      Tone: Premium, efficient, energetic. 
      Rules:
      - Answer questions about classes and memberships.
      - Keep responses under 40 words.
      - Use emojis sparingly but effectively.
    `;
  }
  return `
    You are "Coach Pro", an expert human-performance AI trainer at "${gym.name}".
    Context: You are talking to a member on their mobile app.
    Goal: Provide fast, actionable workout advice or motivation.
    Format: Use bold text for exercises and short bullet points.
  `;
};

export const getGeminiChat = (type: 'front_desk' | 'trainer', gym: GymConfig): Chat => {
  const sessionId = `${gym.id}_${type}`;
  if (!chatSessions[sessionId]) {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    chatSessions[sessionId] = ai.chats.create({
      model: type === 'trainer' ? 'gemini-3-pro-preview' : 'gemini-3-flash-preview',
      config: {
        systemInstruction: getSystemInstruction(type, gym),
        temperature: 0.7,
      },
    });
  }
  return chatSessions[sessionId];
};

export const sendMessageToGemini = async (message: string, gym: GymConfig, type: 'front_desk' | 'trainer' = 'front_desk'): Promise<string> => {
  try {
    const chat = getGeminiChat(type, gym);
    const result: GenerateContentResponse = await chat.sendMessage({ message });
    return result.text || "Connection to neural gym network lost.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "I'm cooling down. Give me a second to catch my breath.";
  }
};
