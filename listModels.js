import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI("AIzaSyB3HMSUd3UPgEOLWCGuS4AEb_URWH-cs90");

async function listAllModels() {
  try {
    const fetch = globalThis.fetch;
    const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models?key=AIzaSyB3HMSUd3UPgEOLWCGuS4AEb_URWH-cs90");
    const data = await response.json();
    console.log("AVAILABLE MODELS:", data.models.map(m => m.name));
  } catch (err) {
    console.error("ERROR:", err.message);
  }
}

listAllModels();
