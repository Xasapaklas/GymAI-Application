
import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { GymConfig } from "../types";

const chatSessions: Record<string, Chat> = {};

const getSystemInstruction = (type: 'front_desk' | 'trainer' | 'nutritionist', gym: GymConfig) => {
  if (type === 'front_desk') {
    return `
      You are "FitBot", the friendly AI Concierge for "${gym.name}".
      Tone: Premium, supportive, welcoming, non-judgmental.
      Rules:
      - Answer questions about classes and memberships.
      - Keep responses under 40 words.
      - Use emojis sparingly.
      - NEVER use pressure-based language.
    `;
  }
  if (type === 'nutritionist') {
    return `
      You are "Eats AI", a friendly food ideation partner for "${gym.name}".
      DISCLAIMER: Always start by clarifying you provide non-medical ideas, not clinical advice.
      Philosophy: Food is fuel and joy. No good/bad foods. No red flags.
      Goal: Suggest delicious meal ideas based on the user's current context (time of day, training status).
      Rules:
      - Never mention weight loss, diseases, or medical diagnoses.
      - Frame suggestions as "You could try..." or "Some people like...".
      - Focus on vibrant, high-energy ingredients.
      - Keep it short, actionable, and visual with text.
    `;
  }
  return `
    You are "Coach Pro", a supportive human-performance AI trainer at "${gym.name}".
    Philosophy: No streaks, no penalties, no FOMO.
    Goal: Provide actionable, encouraging workout advice.
    Rules:
    - Focus on long-term well-being and emotional comfort.
    - Never use fear-based language.
    Format: Short bullet points and bold headers.
  `;
};

export const getGeminiChat = (type: 'front_desk' | 'trainer' | 'nutritionist', gym: GymConfig): Chat => {
  const sessionId = `${gym.id}_${type}`;
  if (!chatSessions[sessionId]) {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const model = type === 'front_desk' ? 'gemini-3-flash-preview' : 'gemini-3-pro-preview';
    chatSessions[sessionId] = ai.chats.create({
      model,
      config: {
        systemInstruction: getSystemInstruction(type, gym),
        temperature: 0.8,
      },
    });
  }
  return chatSessions[sessionId];
};

export const sendMessageToGemini = async (message: string, gym: GymConfig, type: 'front_desk' | 'trainer' | 'nutritionist' = 'front_desk'): Promise<string> => {
  try {
    const chat = getGeminiChat(type, gym);
    const result: GenerateContentResponse = await chat.sendMessage({ message });
    return result.text || "Neural link stable, but no data received.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "The system is resting. Try again when you're ready.";
  }
};
