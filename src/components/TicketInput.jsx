import React, { useState } from 'react';
import { analyzeTicketText } from '../gemini';

export default function TicketInput({ onAnalyzeComplete }) {
  const [text, setText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const handleAnalyze = async () => {
    if (!text.trim()) return;
    setIsAnalyzing(true);
    setIsTyping(false);
    
    // Add perceived intelligence delay (1s-1.5s)
    await new Promise(resolve => setTimeout(resolve, 1200));

    try {
      // Analyze text via Gemini API
      const result = await analyzeTicketText(text);
      onAnalyzeComplete({ text, ...result });
      setText(''); // clear after success
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const loadExample = (example) => {
    const examples = {
      payment: "My payment failed and I’m being charged twice! I need my money back ASAP!",
      technical: "The dashboard is showing a 500 server error when I try to export my monthly reports. Production is blocked.",
      access: "I've been locked out of my account for 3 days and haven't received the password reset email yet. Please help!"
    };
    setText(examples[example]);
  };

  return (
    <div className="ticket-input-container glass-panel">
      <div className="input-header">
        <div className="flex-center">
          <span className="ai-status-dot"></span>
          <h3>New Support Ticket</h3>
        </div>
        <span className="text-xs text-muted">V2.5 Engine</span>
      </div>

      <div className={`textarea-wrapper ${isTyping ? 'typing-glow' : ''}`}>
        <div className="textarea-icon">🧠</div>
        <textarea 
          className="ticket-textarea"
          placeholder="Paste customer email or support ticket here..."
          value={text}
          onFocus={() => setIsTyping(true)}
          onBlur={() => setIsTyping(false)}
          onChange={(e) => setText(e.target.value)}
          disabled={isAnalyzing}
        />
      </div>

      <div className="example-chips">
        <span className="chip-label">Try:</span>
        <button className="example-chip" onClick={() => loadExample('payment')}>💳 Payment</button>
        <button className="example-chip" onClick={() => loadExample('technical')}>🛠️ Technical</button>
        <button className="example-chip" onClick={() => loadExample('access')}>🔐 Access</button>
      </div>

      <div className="ai-hints-box">
        <p className="ai-hint-title">✨ AI will analyze:</p>
        <div className="ai-hint-grid">
          <div className="ai-hint-item"><span>•</span> Urgency</div>
          <div className="ai-hint-item"><span>•</span> Sentiment</div>
          <div className="ai-hint-item"><span>•</span> Business Impact</div>
        </div>
      </div>

      <button 
        className={`btn btn-primary-powerful w-full ${isAnalyzing ? 'analyzing' : ''}`}
        onClick={handleAnalyze}
        disabled={!text.trim() || isAnalyzing}
      >
        {isAnalyzing ? (
          <span className="flex-center">
            <div className="spinner-mini"></div>
            ⚡ Analyzing ticket with AI...
          </span>
        ) : (
          <>⚡ Analyze Ticket</>
        )}
      </button>
    </div>
  );
}
