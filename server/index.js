/**
 * DUMMY API LAYER (Hackathon Mock Backend)
 * 
 * In production, this layer handles all routing, rate-limiting, and scaling.
 * 
 * SCALING: Designed to be deployed as stateless serverless functions (e.g., AWS Lambda, Vercel Edge).
 * SECURITY: Incorporates helmet for HTTP headers, CORS configurations, and rate limiting to prevent DDoS.
 */

import express from 'express';
import { authenticateAgent } from './middleware/auth.js';
import { connectDB, saveTicketAnalysis } from './db.js';

const app = express();
app.use(express.json());

// Initialize Database Connection
connectDB();

/**
 * @route POST /api/v1/tickets/analyze
 * @desc Accepts new incoming support tickets and offloads them to the AI engine.
 * @access Private (Requires Agent Auth Token)
 */
app.post('/api/v1/tickets/analyze', authenticateAgent, async (req, res) => {
  try {
    const { ticketText } = req.body;
    
    // In production: Validate input, scrub PII (Personally Identifiable Information)
    
    // Simulate AI Processing Offload...
    const processedResponse = { status: 'success', message: 'Sent to Gemini Engine' };
    
    // Asynchronously save to database for historical analytics
    await saveTicketAnalysis(ticketText, processedResponse);

    res.status(200).json(processedResponse);
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Start Server (If running locally)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 API Layer running on port ${PORT}`));
