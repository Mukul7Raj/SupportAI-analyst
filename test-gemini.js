import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI("AIzaSyB3HMSUd3UPgEOLWCGuS4AEb_URWH-cs90");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

try {
  const result = await model.generateContent("Respond with the word SUCCESS");
  console.log("SUCCESS:", result.response.text());
} catch (err) {
  console.error("ERROR KEY INVALID:", err.status, err.message);
}
