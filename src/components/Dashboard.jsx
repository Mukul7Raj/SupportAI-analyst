import React, { useState } from 'react';
import TicketCard from './TicketCard';
import TicketDetail from './TicketDetail';

// Simple CountUp animation component
const CountUp = ({ count, className }) => {
  const [displayCount, setDisplayCount] = React.useState(0);
  const [isUpdating, setIsUpdating] = React.useState(false);

  React.useEffect(() => {
    if (displayCount === count) return;
    
    setIsUpdating(true);
    const timeout = setTimeout(() => setIsUpdating(false), 800);

    let start = displayCount;
    const durationCount = 800;
    const step = Math.ceil((count - start) / 10) || (count > start ? 1 : -1);
    
    const interval = setInterval(() => {
      start += step;
      if ((step > 0 && start >= count) || (step < 0 && start <= count)) {
        setDisplayCount(count);
        clearInterval(interval);
      } else {
        setDisplayCount(start);
      }
    }, durationCount / 20);
    
    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [count, displayCount]);

  return <div className={`${className} ${isUpdating ? 'updating' : ''}`}>{displayCount}</div>;
};

export default function Dashboard({ tickets }) {
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [autoDraft, setAutoDraft] = useState(false);
  const [sortByPriority, setSortByPriority] = useState(false);

  // Counts for Top Section
  const highCount = tickets.filter(t => t.priority === 'High').length;
  const medCount = tickets.filter(t => t.priority === 'Medium').length;
  const lowCount = tickets.filter(t => t.priority === 'Low').length;

  // Sorting Logic (WOW Factor Toggle)
  const displayTickets = [...tickets];
  if (sortByPriority) {
    const priorityWeight = { 'High': 3, 'Medium': 2, 'Low': 1 };
    displayTickets.sort((a, b) => priorityWeight[b.priority] - priorityWeight[a.priority]);
  }

  // Handle ticket resolution
  const handleResolve = (index) => {
    const updatedTickets = [...tickets];
    updatedTickets.splice(index, 1);
    // Note: Since 'tickets' comes from props in this structure, 
    // real app would need a callback to the parent (App.jsx).
    // For this hackathon demo, we will simulate it.
    alert("Ticket marked as Resolved and archived.");
  };

  const openModal = (ticket, draftFirst = false) => {
    setSelectedTicket(ticket);
    setAutoDraft(draftFirst);
  };

  return (
    <div className="dashboard-layout">
      {/* Mini Analytics Header Bar */}
      <div className="mini-analytics-bar glass-panel">
        <div className="analytics-item">
          <span className="analytics-icon">📊</span>
          <span className="analytics-label">Today's Volume:</span>
          <span className="analytics-value">12 Tickets</span>
        </div>
        <div className="analytics-divider"></div>
        <div className="analytics-item">
          <span className="analytics-icon text-red">🔥</span>
          <span className="analytics-label">Critical:</span>
          <span className="analytics-value">3 Active</span>
        </div>
        <div className="analytics-divider"></div>
        <div className="analytics-item">
          <span className="analytics-icon text-blue">⏱️</span>
          <span className="analytics-label">Avg Response:</span>
          <span className="analytics-value">1.8 min</span>
        </div>
        <div className="analytics-status-tag">
          <span className="status-pulse"></span>
          System Optimized
        </div>
      </div>

      {/* Top Section Summary Cards */}
      <div className="summary-cards">
        <div className="summary-card high pulse-red">
          <div className="sc-header">🔴 High Priority</div>
          <CountUp count={highCount} className="sc-value text-red" />
          <div className="sc-micro-label text-red">⚠ Needs Immediate Action</div>
        </div>
        <div className="summary-card med">
          <div className="sc-header">🟡 Medium</div>
          <CountUp count={medCount} className="sc-value text-yellow" />
          <div className="sc-micro-label text-yellow">🕒 Triage within 1hr</div>
        </div>
        <div className="summary-card low">
          <div className="sc-header">🟢 Low</div>
          <CountUp count={lowCount} className="sc-value text-green" />
          <div className="sc-micro-label text-green">✅ Monitor Sentiment</div>
        </div>
      </div>

      {/* Main Section */}
      <div className="ticket-list-header flex-between">
        <div className="flex-center">
          <h3>Ticket Queue</h3>
          <span className="live-badge" style={{ marginLeft: '12px' }}>
            LIVE
          </span>
        </div>
        <label className="toggle-switch-pro">
          <span className="toggle-label-pro">Sort by Priority (High → Low)</span>
          <div className="switch-wrapper">
            <input 
              type="checkbox" 
              checked={sortByPriority} 
              onChange={(e) => setSortByPriority(e.target.checked)}
            />
            <span className="slider-pro"></span>
          </div>
        </label>
      </div>

      <div className="ticket-grid">
        {displayTickets.length === 0 ? (
          <div className="empty-state glass-panel" style={{ textAlign: 'center', padding: '3rem 2rem', marginTop: '1rem' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📭</div>
            <h3 style={{ marginBottom: '0.5rem' }}>No Tickets Yet</h3>
            <p style={{ color: '#94a3b8', marginBottom: '1.5rem' }}>Your support queue is clear.</p>
            
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1.25rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', textAlign: 'left', display: 'inline-block', maxWidth: '400px' }}>
              <p style={{ fontSize: '0.9rem', marginBottom: '8px', color: '#cbd5e1' }}>💡 <strong>Try pasting a sample like:</strong></p>
              <p style={{ fontStyle: 'italic', marginBottom: '12px', color: '#f8fafc' }}>"My payment failed and I’m being charged twice!"</p>
              
              <div style={{ fontSize: '0.85rem', color: '#94a3b8', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                 <span>→ AI will analyze urgency</span>
                 <span>→ AI will detect sentiment</span>
                 <span>→ AI will generate a draft reply</span>
              </div>
            </div>
          </div>
        ) : (
          displayTickets.map((ticket, index) => (
            <TicketCard 
              key={index} 
              ticket={ticket} 
              onClick={() => openModal(ticket)}
              onDraft={() => openModal(ticket, true)}
              onResolve={(e) => {
                e.stopPropagation();
                handleResolve(index);
              }}
            />
          ))
        )}
      </div>

      {/* The Detail Modal overlay */}
      {selectedTicket && (
        <TicketDetail 
          ticket={selectedTicket} 
          autoDraft={autoDraft}
          onClose={() => {
            setSelectedTicket(null);
            setAutoDraft(false);
          }} 
        />
      )}
    </div>
  );
}
