/**
 * Debug Script for Gemini API 
 * Run this with: node debug_gemini.js
 */

import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';

// Load .env
dotenv.config();

const API_KEY = process.env.VITE_GEMINI_API_KEY;

async function testGemini() {
    console.log("🚀 Starting Gemini Connectivity Test...");
    
    if (!API_KEY) {
        console.error("❌ ERROR: VITE_GEMINI_API_KEY is not set in your .env file.");
        return;
    }

    console.log(`🔑 API Key found (starts with: ${API_KEY.substring(0, 4)}...)`);
    
    const genAI = new GoogleGenerativeAI(API_KEY);
    const modelNames = ["gemini-1.5-flash-latest", "gemini-1.5-flash", "gemini-2.0-flash", "gemini-pro"];

    let success = false;
    for (const modelName of modelNames) {
        try {
            console.log(`📡 Trying model: ${modelName}...`);
            const model = genAI.getGenerativeModel({ model: modelName });
            const prompt = "Say 'Connected' in one word.";
            
            const result = await model.generateContent(prompt);
            const text = result.response.text();
            
            console.log(`✅ SUCCESS with ${modelName}: "${text.trim()}"`);
            success = true;
            break;
        } catch (error) {
            console.warn(`❌ ${modelName} failed: ${error.message}`);
        }
    }

    if (!success) {
        console.error("\n❌ ALL MODELS FAILED. Potential reasons:");
        console.error("1. Your API key might be from Vertex AI (Google Cloud) instead of AI Studio.");
        console.error("2. Your region might not support these specific models.");
        console.error("3. The API key is invalid or restricted.");
        console.error("\n💡 TIP: Get a FREE key from https://aistudio.google.com/app/apikey");
    }
}

testGemini();
