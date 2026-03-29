import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';
dotenv.config();

const API_KEY = process.env.VITE_GEMINI_API_KEY;

async function listModels() {
  if (!API_KEY) {
    console.error("VITE_GEMINI_API_KEY is missing");
    return;
  }
  const genAI = new GoogleGenerativeAI(API_KEY);
  try {
    // There isn't a direct listModels in the client-side SDK usually, 
    // but the Node.js one might have it or I can just try different names.
    // Actually simpler: let's try gemini-1.5-flash-latest
    
    const modelsToTry = ["gemini-1.5-flash", "gemini-1.5-flash-latest", "gemini-1.5-pro", "gemini-pro"];
    
    for (const modelName of modelsToTry) {
        try {
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent("test");
            console.log(`✅ ${modelName} works!`);
            return;
        } catch (e) {
            console.log(`❌ ${modelName} failed: ${e.message}`);
        }
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

listModels();
