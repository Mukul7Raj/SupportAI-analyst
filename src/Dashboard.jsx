import React, { useState, useEffect, useRef } from 'react';
import { generateRandomTicket, analyzeTicket, URGENCY, SENTIMENTS } from './mockData';
import { ShieldAlert, CheckCircle2, AlertTriangle, Clock, Activity, Target } from 'lucide-react';
import './index.css';

export default function Dashboard() {
  const [tickets, setTickets] = useState([]);
  const [metrics, setMetrics] = useState({
    analyzed: 0,
    critical: 0,
    avgSentiment: 85
  });
  
  // Simulation loop
  useEffect(() => {
    // Initial tickets
    setTickets([
      analyzeTicket(generateRandomTicket()),
      analyzeTicket(generateRandomTicket()),
    ]);

    const interval = setInterval(() => {
      // Add a new raw ticket
      const newTicket = generateRandomTicket(false);
      setTickets(prev => [newTicket, ...prev].slice(0, 15));

      // Simulate AI analyzing the ticket after 1.5 seconds
      setTimeout(() => {
        setTickets(currentTickets => 
          currentTickets.map(t => {
            if (t.id === newTicket.id) {
              const analyzed = analyzeTicket(t);
              setMetrics(prev => ({
                analyzed: prev.analyzed + 1,
                critical: prev.critical + (analyzed.urgency === URGENCY.CRITICAL ? 1 : 0),
                avgSentiment: prev.avgSentiment // Mock dynamic sentiment later
              }));
              return analyzed;
            }
            return t;
          })
        );
      }, 1500);
    }, 4000); // New ticket every 4s

    return () => clearInterval(interval);
  }, []);

  const criticalEscalations = tickets.filter(t => t.isAnalyzed && t.urgency === URGENCY.CRITICAL);
  const feedTickets = tickets;

  return (
    <div className="dashboard-content">
      <div className="metrics-row">
        <MetricCard 
          icon={<Target className="text-blue" />}
          title="Tickets Analyzed"
          value={1248 + metrics.analyzed}
          trend="+12% this hour"
        />
        <MetricCard 
          icon={<Activity className="text-green" />}
          title="Avg Sentiment"
          value="Positive"
          trend="Stable"
        />
        <MetricCard 
          icon={<ShieldAlert className="text-red" />}
          title="Critical Escalations"
          value={metrics.critical}
          trend="Needs attention"
        />
      </div>

      <div className="main-grid">
        <div className="feed-column">
          <div className="section-header">
            <h3>Live Analysis Feed</h3>
            <span className="live-badge"><span className="dot"></span> Live</span>
          </div>
          <div className="ticket-list">
            {feedTickets.map(ticket => (
              <TicketItem key={ticket.id} ticket={ticket} />
            ))}
          </div>
        </div>

        <div className="escalation-column">
          <div className="section-header">
            <h3>Critical Escalations</h3>
            <span className="count-badge">{criticalEscalations.length}</span>
          </div>
          <div className="escalation-list">
            {criticalEscalations.length === 0 ? (
              <div className="empty-state">
                <CheckCircle2 size={32} />
                <p>No critical escalations at the moment.</p>
              </div>
            ) : (
              criticalEscalations.map(ticket => (
                <EscalationCard key={ticket.id} ticket={ticket} />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ icon, title, value, trend }) {
  return (
    <div className="metric-card glass-panel">
      <div className="metric-icon">{icon}</div>
      <div className="metric-info">
        <h4>{title}</h4>
        <div className="metric-value">{value}</div>
        <div className="metric-trend">{trend}</div>
      </div>
    </div>
  );
}

function TicketItem({ ticket }) {
  if (!ticket.isAnalyzed) {
    return (
      <div className="ticket-item analyzing">
        <div className="loading-pulse"></div>
        <div className="ticket-core">
          <span className="ticket-id">{ticket.id}</span>
          <p className="ticket-text blurred">{ticket.text}</p>
        </div>
        <div className="analyzing-badge"><Clock size={14}/> Analyzing...</div>
      </div>
    );
  }

  const urgencyClass = `urgency-${ticket.urgency.toLowerCase()}`;
  const sentimentClass = `sentiment-${ticket.sentiment.toLowerCase()}`;

  return (
    <div className="ticket-item analyzed glass-panel slide-in">
      <div className="ticket-category">{ticket.category} · {ticket.author}</div>
      <p className="ticket-text">{ticket.text}</p>
      <div className="ticket-tags">
        <span className={`tag ${urgencyClass}`}>
          {ticket.urgency === URGENCY.CRITICAL && <AlertTriangle size={12}/>}
          Priority: {ticket.urgency}
        </span>
        <span className={`tag ${sentimentClass}`}>
          Sentiment: {ticket.sentiment}
        </span>
      </div>
    </div>
  );
}

function EscalationCard({ ticket }) {
  const [typedResponse, setTypedResponse] = useState('');
  
  useEffect(() => {
    if (!ticket.suggestedResponse) return;
    let i = 0;
    setTypedResponse('');
    const text = ticket.suggestedResponse;
    const interval = setInterval(() => {
      setTypedResponse(text.slice(0, i));
      i += 3;
      if (i > text.length) clearInterval(interval);
    }, 15);
    return () => clearInterval(interval);
  }, [ticket.suggestedResponse]);

  return (
    <div className="escalation-card glass-panel border-red pulse">
      <div className="escalation-header">
        <ShieldAlert className="text-red" size={20} />
        <span>Critical: {ticket.category}</span>
        <span className="time-ago">Just now</span>
      </div>
      <p className="escalation-text">"{ticket.text}"</p>
      <div className="response-box">
        <div className="response-header">✨ AI Suggested Response</div>
        <div className="response-body">
          {typedResponse}
          <span className="cursor blink">|</span>
        </div>
        <div className="response-actions">
           <button className="btn btn-primary">Approve & Send</button>
           <button className="btn btn-secondary">Edit</button>
        </div>
      </div>
    </div>
  );
}
