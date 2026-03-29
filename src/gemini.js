import { GoogleGenerativeAI } from "@google/generative-ai";

const FALLBACK_MOCK_RESPONSE = {
  priority: "High",
  sentiment: "Angry",
  sentimentEmoji: "😡",
  category: "Billing Issue",
  reasoning: "The customer is incredibly frustrated about a double charge ('charged twice'). Keywords like 'ASAP' and 'refund' strongly indicate an urgent escalation requirement.",
  confidence: 95
};

// Ensure API key is somewhat safe, or fallback gracefully
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";

let genAI = null;
if (API_KEY) {
  genAI = new GoogleGenerativeAI(API_KEY);
}

export async function analyzeTicketText(ticketText) {
  // Graceful fallback for demo if API key isn't provided yet
  if (!genAI) {
    console.warn("No Gemini API Key found in .env. Falling back to mock data.");
    return new Promise(resolve => {
      setTimeout(() => {
        // Simple heuristic fallback just in case
        const isLow = ticketText.toLowerCase().includes("feature");
        const isMed = ticketText.toLowerCase().includes("how to");
        resolve({
          priority: isLow ? "Low" : isMed ? "Medium" : "High",
          sentiment: isLow ? "Positive" : isMed ? "Neutral" : "Angry",
          sentimentEmoji: isLow ? "😀" : isMed ? "😐" : "😡",
          category: isLow ? "Feature Request" : isMed ? "General Inquiry" : "Technical/Billing",
          reasoning: "Fall-back mock reasoning: Identified key phrases indicating urgency levels."
        });
      }, 1500);
    });
  }

  try {
    const model = await getStableModel(genAI);

    // Fetch learning loop history
    let feedbackContext = "";
    if (typeof window !== "undefined") {
      const storedFeedback = localStorage.getItem("ai_feedback_loop");
      if (storedFeedback) {
        feedbackContext = `\nCRITICAL CONTEXT FROM PREVIOUS HUMAN CORRECTIONS:\n${storedFeedback}\nLearn from these corrections and adapt your priority/sentiment assignments.\n`;
      }
    }

    const prompt = `
    Analyze the following customer support ticket and extract key intelligence.
    ${feedbackContext}
    Ticket: "${ticketText}"
    
    You MUST respond with ONLY a valid JSON object matching this exact structure:
    {
      "priority": "High" | "Medium" | "Low",
      "sentiment": "Angry" | "Negative" | "Neutral" | "Positive" | "Happy",
      "sentimentEmoji": "<a single relevant emoji>",
      "category": "<A short 2-3 word topic classification>",
      "reasoning": "<A 2-3 sentence explanation of WHY this priority was chosen. Mention specific keywords found.>"
    }
    `;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    // Clean JSON parsing
    const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error("❌ Gemini API Analysis Error:", error);
    // Informative fallback
    return {
        ...FALLBACK_MOCK_RESPONSE,
        reasoning: `⚠️ API Error: ${error.message}. (Using Mock Data)`
    };
  }
}

export async function draftReplyWithGemini(ticketText, priority, sentiment) {
  if (!genAI) {
    return "Mock Response: We have received your ticket and are looking into it immediately. (API Key Missing)";
  }
  try {
    const model = await getStableModel(genAI);
    const prompt = `You are a professional customer support agent. 
Draft a polite, empathetic, and concise reply to the following customer ticket.
The ticket priority is ${priority} and the customer's sentiment is ${sentiment}.

Customer Ticket: "${ticketText}"

Write only the email reply body.`;
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error("❌ Gemini Draft Reply Error:", error);
    return `⚠️ Error generating draft: ${error.message}. Ensure you are using a FREE TIER key from Google AI Studio.`;
  }
}
