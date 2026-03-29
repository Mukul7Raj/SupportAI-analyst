import React, { useState } from 'react';
import TicketInput from './components/TicketInput';
import Dashboard from './components/Dashboard';
import './index.css';
import './demo.css';

function App() {
  const [tickets, setTickets] = useState([{
    text: "My payment failed and I’m being charged twice! I need my money back ASAP!",
    priority: "High",
    sentiment: "Negative",
    sentimentEmoji: "😡",
    category: "Payment Failure Issue",
    reasoning: "• Keywords: 'failed', 'charged twice'\n• Negative sentiment detected\n• Financial impact/Loss of trust risk",
    confidence: 94
  }]);

  const handleNewTicket = (analyzedTicket) => {
    setTickets([analyzedTicket, ...tickets]);
  };

  return (
    <div className="app-container">
      <header className="navbar flex-between">
        <div className="logo cursor-pointer">
          <img src="/favicon.png" className="logo-img" alt="SupportAI Logo" />
          <h1>SupportAI Analyst</h1>
        </div>
      </header>
      
      <main className="demo-layout">
        <div className="input-column">
          <TicketInput onAnalyzeComplete={handleNewTicket} />
        </div>
        <div className="dashboard-column">
          <Dashboard tickets={tickets} />
        </div>
      </main>
    </div>
  );
}

export default App;
