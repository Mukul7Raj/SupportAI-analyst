import React from 'react';

export default function TicketCard({ ticket, onClick, onDraft, onResolve }) {
  const pClass = ticket.priority.toLowerCase();

  const priorityText = {
    'High': '🚨 High Priority Issue',
    'Medium': '🕒 Medium Priority',
    'Low': '✅ Low Priority'
  };

  const sentimentText = {
    'Negative': 'Negative Sentiment Detected',
    'Neutral': 'Neutral Sentiment',
    'Positive': 'Positive Sentiment detected'
  };

  return (
    <div className={`ticket-card glass-panel priority-border-${pClass}`} onClick={onClick}>
      <div className="tc-header">
        <span className={`badge bg-${pClass}`}>
          {priorityText[ticket.priority] || ticket.priority}
        </span>
        <span className="tc-sentiment">{ticket.sentimentEmoji} {sentimentText[ticket.sentiment] || ticket.sentiment}</span>
      </div>
      
      <div className="tc-body">
        <h4 className="tc-title">{ticket.category}</h4>
        <p className="tc-text-preview">"{ticket.text.substring(0, 80)}{ticket.text.length > 80 ? '...' : ''}"</p>
      </div>

      <div className="tc-ai-insight">
        <div className="ai-insight-label flex-between" style={{ width: '100%' }}>
          <span>🧠 AI DETAILED INSIGHT</span>
          <span className="confidence-chip">Confidence: {ticket.confidence || 96}%</span>
        </div>
        <div className="ai-insight-text">
          {ticket.reasoning}
        </div>
      </div>

      <div className="tc-tags">
        <span className="tag-pill">🏷️ {ticket.category}</span>
      </div>
      
      <div className="tc-actions">
        <button className="card-btn btn-draft" onClick={(e) => { e.stopPropagation(); onDraft(); }}>Draft Reply</button>
        <button className="card-btn btn-resolve" onClick={onResolve}>Mark Resolved</button>
      </div>
    </div>
  );
}
