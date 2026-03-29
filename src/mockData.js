export const SENTIMENTS = {
  POSITIVE: 'Positive',
  NEUTRAL: 'Neutral',
  NEGATIVE: 'Negative',
  ANGRY: 'Angry'
};

export const URGENCY = {
  LOW: 'Low',
  MEDIUM: 'Medium',
  HIGH: 'High',
  CRITICAL: 'Critical'
};

export const CATEGORIES = [
  'Billing Issue',
  'Account Lockout',
  'Feature Request',
  'Bug Report',
  'Performance',
  'Authentication'
];

const mockTickets = [
  { text: "My card was charged twice for the monthly subscription! Need a refund ASAP.", category: 'Billing Issue', sentiment: SENTIMENTS.ANGRY, urgency: URGENCY.CRITICAL },
  { text: "How do I change my profile picture?", category: 'Feature Request', sentiment: SENTIMENTS.NEUTRAL, urgency: URGENCY.LOW },
  { text: "The app crashes every time I try to export my data. Have been trying for 2 hours.", category: 'Bug Report', sentiment: SENTIMENTS.NEGATIVE, urgency: URGENCY.HIGH },
  { text: "Just wanted to say I love the new update! Looks fantastic.", category: 'Feature Request', sentiment: SENTIMENTS.POSITIVE, urgency: URGENCY.LOW },
  { text: "I can't log in, it says my password is wrong but I literally just reset it.", category: 'Authentication', sentiment: SENTIMENTS.NEGATIVE, urgency: URGENCY.HIGH },
  { text: "I need an invoice for the last 3 months for my accounting team.", category: 'Billing Issue', sentiment: SENTIMENTS.NEUTRAL, urgency: URGENCY.MEDIUM },
  { text: "API is returning 500 internal server errors consistently for the past hour. Our system is down.", category: 'Performance', sentiment: SENTIMENTS.ANGRY, urgency: URGENCY.CRITICAL },
  { text: "Is there a dark mode coming soon?", category: 'Feature Request', sentiment: SENTIMENTS.NEUTRAL, urgency: URGENCY.LOW }
];

let idCounter = 1000;

export function generateRandomTicket(isAnalyzed = false) {
  const template = mockTickets[Math.floor(Math.random() * mockTickets.length)];
  const nameFirst = ['Alex', 'Jordan', 'Sam', 'Casey', 'Taylor', 'Morgan', 'Riley', 'Jamie'];
  const nameLast = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis'];
  const author = `${nameFirst[Math.floor(Math.random() * nameFirst.length)]} ${nameLast[Math.floor(Math.random() * nameLast.length)]}`;
  
  return {
    id: `TCK-${idCounter++}`,
    text: template.text,
    author: author,
    time: new Date().toISOString(),
    isAnalyzed: isAnalyzed,
    // AI fields (initially null if not analyzed)
    category: isAnalyzed ? template.category : null,
    sentiment: isAnalyzed ? template.sentiment : null,
    urgency: isAnalyzed ? template.urgency : null,
    suggestedResponse: isAnalyzed && template.urgency === URGENCY.CRITICAL 
      ? `Hi ${author.split(' ')[0]}, we are investigating this issue with the highest priority...` 
      : null
  };
}

export function analyzeTicket(ticket) {
  // Find matching template to assign correct mocked AI data
  const template = mockTickets.find(t => t.text === ticket.text) || mockTickets[0];
  
  return {
    ...ticket,
    isAnalyzed: true,
    category: template.category,
    sentiment: template.sentiment,
    urgency: template.urgency,
    suggestedResponse: template.urgency === URGENCY.CRITICAL 
      ? `Hi ${ticket.author.split(' ')[0]},\n\nWe apologize for the inconvenience. Our engineering team has been alerted and is investigating this ${template.category.toLowerCase()} with highest priority.\n\nWe will update you as soon as this is resolved.` 
      : null
  };
}
