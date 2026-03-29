/**
 * SECURITY & AUTHENTICATION MIDDLEWARE
 * 
 * SECURITY: Protects the API layer from unauthorized access.
 * AUTH: Validates JWT (JSON Web Tokens) to ensure only verified Support Agents 
 * can interact with the Gemini backend and modify ticket priorities.
 */

export const authenticateAgent = (req, res, next) => {
  const token = req.headers.authorization;

  // Simulate token validation
  // In production: Verify JWT via Auth0 / Firebase / NextAuth
  if (!token) {
    return res.status(401).json({ error: "Unauthorized access: Missing Authentication Token." });
  }

  // Inject agent details into request
  req.user = { id: 101, role: 'support_agent' };
  
  next();
};
