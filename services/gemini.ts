import { GoogleGenAI, Type, Schema } from "@google/genai";
import { Exercise, UserProfile } from "../types";

// Initialize Gemini Client lazily to prevent crashes if API key is missing on load
let aiClient: GoogleGenAI | null = null;

const getAI = () => {
  if (!aiClient) {
    const key = process.env.API_KEY || process.env.GEMINI_API_KEY || 'missing_key';
    aiClient = new GoogleGenAI({ apiKey: key });
  }
  return aiClient;
};

// Models
const GENERATOR_MODEL = 'gemini-3-flash-preview';
const COACH_MODEL = 'gemini-3-flash-preview';

export const generateWorkoutPlan = async (
  age: number,
  weight: number,
  maxPushups: number,
  goal: string,
  notes: string,
  rank: string,
  specialRequest?: string
): Promise<Exercise[]> => {
  
  const prompt = `
    Create a home workout plan for a user with the following stats:
    Age: ${age}
    Weight: ${weight}kg
    Max Pushups: ${maxPushups}
    Goal: ${goal}
    Current Rank: ${rank} (Difficulty should scale with rank: F is easiest, S++ is legendary/hardest)
    Notes: ${notes}
    ${specialRequest ? `Special Request: ${specialRequest}` : ''}

    Generate exactly 5 to 7 exercises.
    For type, use "REPS" or "MINUTES".
    Provide a brief, clear description for each exercise (max 15 words).
    Return a JSON array of exercises.
  `;

  // Define Schema for structured output
  const exerciseSchema: Schema = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        name: { type: Type.STRING, description: "Name of the exercise" },
        type: { type: Type.STRING, enum: ["REPS", "MINUTES"], description: "Type of measurement" },
        target: { type: Type.NUMBER, description: "Number of reps or minutes" },
        sets: { type: Type.NUMBER, description: "Number of sets" },
        description: { type: Type.STRING, description: "Brief instruction on how to do it" }
      },
      required: ["name", "type", "target", "sets", "description"],
    }
  };

  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: GENERATOR_MODEL,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: exerciseSchema,
      },
    });

    const rawData = JSON.parse(response.text || "[]");
    
    // Map to internal Exercise interface with IDs
    const generateId = () => typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 11);
    
    return rawData.map((item: any) => ({
      id: generateId(),
      name: item.name,
      type: item.type,
      target: item.target,
      sets: item.sets,
      description: item.description
    }));

  } catch (error) {
    console.error("Gemini Workout Generation Error:", error);
    throw new Error("Failed to generate workout plan.");
  }
};

export const getCoachResponse = async (
  history: { role: 'user' | 'model'; text: string }[],
  userProfile: UserProfile
): Promise<string> => {
  
  const systemInstruction = `
    You are "Iron Coach", a supportive, RPG-themed fitness companion.
    User Info:
    - Name: ${userProfile.name}
    - Level: ${userProfile.level}
    - Streak: ${userProfile.streak} days
    - Main Stats: STR ${userProfile.stats.strength}, END ${userProfile.stats.endurance}
    
    Style:
    - Use slight RPG terminology (e.g., "gaining XP", "buffing stats").
    - Be encouraging but practical.
    - Keep responses concise (under 3 sentences unless explaining a complex topic).
    - If the user feels down, motivate them to keep their streak.
  `;

  try {
    const ai = getAI();
    const chat = ai.chats.create({
      model: COACH_MODEL,
      config: {
        systemInstruction: systemInstruction,
      }
    });

    // Replay history to sync state (excluding the last new message which we send now)
    // Note: In a real app, we might maintain the chat object. Here we just rebuild context or send the last message.
    // For simplicity with this stateless helper, we will just send the last message with context of previous turns if needed, 
    // but the most robust way in a quick implementation is to just send the latest message or reconstruct history.
    
    // Simplification: We will just send the conversation history as the prompt context if we aren't maintaining a persistent chat object instance across re-renders efficiently.
    // Ideally, we use chat.sendMessage for the latest.
    
    const lastMessage = history[history.length - 1];
    
    // Build history for the chat instance
    const historyForChat = history.slice(0, -1).map(msg => ({
      role: msg.role,
      parts: [{ text: msg.text }]
    }));

    const activeChat = ai.chats.create({
      model: COACH_MODEL,
      history: historyForChat,
      config: { systemInstruction }
    });

    const result = await activeChat.sendMessage({ message: lastMessage.text });
    return result.text || "I am meditating... ask again shortly.";

  } catch (error) {
    console.error("Gemini Coach Error:", error);
    return "The spirit realm is cloudy (API Error). Try again later.";
  }
};