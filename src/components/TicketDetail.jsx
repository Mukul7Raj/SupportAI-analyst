import React, { useState } from 'react';
import { draftReplyWithGemini } from '../gemini';

export default function TicketDetail({ ticket, autoDraft, onClose }) {
  const [draft, setDraft] = useState('');
  const [isDrafting, setIsDrafting] = useState(false);
  const [feedbackState, setFeedbackState] = useState(null); // 'agreed', 'disagreed', 'saved'
  const [correctedPriority, setCorrectedPriority] = useState('High');

  const pClass = ticket.priority.toLowerCase();

  // Handle auto-drafting from the "Draft Reply" button on the card
  React.useEffect(() => {
    if (autoDraft) {
      handleDraft();
    }
  }, [autoDraft]);

  const handleDraft = async () => {
    setIsDrafting(true);
    const reply = await draftReplyWithGemini(ticket.text, ticket.priority, ticket.sentiment);
    setDraft(reply);
    setIsDrafting(false);
  };

  const handleSaveCorrection = () => {
    const history = localStorage.getItem('ai_feedback_loop') || "";
    const newRule = `- The agent corrected a ticket describing "${ticket.text.substring(0, 50)}..." from ${ticket.priority} to ${correctedPriority}. Adjust your reasoning accordingly.\n`;
    localStorage.setItem('ai_feedback_loop', history + newRule);
    setFeedbackState('saved');
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className={`modal-content glass-panel border-${pClass}`} onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>
        
        <div className="modal-header">
          <h2>Ticket Analysis</h2>
          <div className="modal-tags">
            <span className={`badge bg-${pClass}`}>{ticket.priority} Priority</span>
            <span className="badge bg-neutral">{ticket.sentimentEmoji} {ticket.sentiment}</span>
            <span className="badge outline">{ticket.category}</span>
          </div>
        </div>

        <div className="modal-body">
          <div className="original-ticket">
            <h4>Original Message</h4>
            <p className="ticket-full-text">"{ticket.text}"</p>
          </div>

          {/* ⭐ The WOW Factor: AI Insight Box */}
          <div className="tc-ai-insight pulse-border" style={{ marginTop: '0', padding: '24px' }}>
            <div className="ai-insight-label" style={{ fontSize: '0.85rem', marginBottom: '12px' }}>
              <span style={{ fontSize: '1.2rem' }}>🧠</span> AI DETAILED INSIGHT
            </div>
            <div className="ai-insight-text" style={{ fontSize: '1rem', color: '#fff', fontWeight: '500' }}>
              {ticket.reasoning}
            </div>
            
            {/* The Learning Loop Feature */}
            <div className="feedback-section" style={{ marginTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '10px' }}>
              {!feedbackState ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.85rem', color: '#aaa' }}>Did AI get this right?</span>
                  <div>
                    <button className="btn btn-secondary text-sm" style={{ padding: '4px 8px', marginRight: '6px' }} onClick={() => setFeedbackState('agreed')}>👍 Yes</button>
                    <button className="btn outline text-sm" style={{ padding: '4px 8px' }} onClick={() => setFeedbackState('disagreed')}>👎 No (Correct AI)</button>
                  </div>
                </div>
              ) : feedbackState === 'agreed' ? (
                <span style={{ fontSize: '0.85rem', color: '#4ade80' }}>✔ Thanks for verifying. AI retains confidence.</span>
              ) : feedbackState === 'saved' ? (
                <span style={{ fontSize: '0.85rem', color: '#fbbf24' }}>🤖 Learning saved! Future tickets will reflect this correction.</span>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '0.85rem' }}>Change priority to:</span>
                  <select 
                    style={{ background: '#1e293b', color: 'white', border: '1px solid #334155', borderRadius: '4px', padding: '4px' }}
                    value={correctedPriority}
                    onChange={(e) => setCorrectedPriority(e.target.value)}
                  >
                    <option value="High">🔴 High</option>
                    <option value="Medium">🟡 Medium</option>
                    <option value="Low">🟢 Low</option>
                  </select>
                  <button className="btn btn-primary text-sm" style={{ padding: '4px 12px' }} onClick={handleSaveCorrection}>Save & Train AI</button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="modal-actions">
           {draft ? (
             <div className="draft-reply-box" style={{ width: '100%' }}>
               <h4 style={{ marginBottom: '8px' }}>📝 AI Drafted Reply</h4>
               <textarea 
                 className="ticket-textarea" 
                 style={{ minHeight: '120px', marginBottom: '8px' }}
                 value={draft} 
                 onChange={(e) => setDraft(e.target.value)} 
               />
               <button 
                 className="btn btn-primary w-full" 
                 onClick={() => {
                   navigator.clipboard.writeText(draft);
                   alert("Copied to clipboard!");
                 }}
               >
                 Copy to Clipboard
               </button>
             </div>
           ) : (
             <button 
               className="btn btn-primary w-full" 
               onClick={handleDraft} 
               disabled={isDrafting}
             >
               {isDrafting ? "Drafting..." : "Draft Reply with Gemini"}
             </button>
           )}
        </div>
      </div>
    </div>
  );
}
