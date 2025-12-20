
import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";

// Store sessions by type so we can maintain separate conversations
const chatSessions: Record<string, Chat> = {};

const INSTRUCTIONS = {
  front_desk: `
    You are "FitBot", an advanced AI Front Desk agent for "GymBody", a premium fitness studio.
    Your tone is energetic, professional, and helpful.
    You have access to the following general gym information:
    - Hours: Mon-Sat 6am-10pm, Sun Closed.
    - Classes offered: HIIT, Yoga Flow, Power Lifting, Pilates Reformer.
    - Membership: Silver ($50/mo), Gold ($100/mo - unlimited classes).
    
    Your goal is to help users with:
    1. Explaining class types.
    2. Membership inquiries.
    3. General support.
    4. If a user asks to book a class, pleasantly confirm you have added them to the waitlist or booking system (simulation).
    
    Keep responses concise (under 50 words) as this is a mobile chat interface.
  `,
  trainer: `
    You are "GymBuddy", an elite AI Personal Trainer and Nutritionist.
    Your tone is motivating, knowledgeable, and direct (like a coach).
    Your goal is to help the user with:
    1. Creating workout routines (Splits, Full body, etc).
    2. Explaining exercises and proper form.
    3. Nutritional advice and macro planning.
    4. Recovery tips.
    
    Always be encouraging but push the user to be their best. 
    Keep responses concise (under 80 words) and use bullet points for workouts.
  `
};

export const getGeminiChat = (type: 'front_desk' | 'trainer'): Chat => {
  if (!chatSessions[type]) {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      chatSessions[type] = ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
          systemInstruction: INSTRUCTIONS[type],
        },
      });
    } catch (error) {
      console.error("Failed to initialize Gemini:", error);
      throw error;
    }
  }
  return chatSessions[type];
};

export const sendMessageToGemini = async (message: string, type: 'front_desk' | 'trainer' = 'front_desk'): Promise<string> => {
  try {
    const chat = getGeminiChat(type);
    const result: GenerateContentResponse = await chat.sendMessage({ message });
    return result.text || "I'm having trouble connecting to the gym network right now. Try again?";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Sorry, I'm currently offline for maintenance.";
  }
};
