import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, MessageSquare, Bot } from 'lucide-react';

const ECO_CHAT_KNOWLEDGE = [
  { keywords: ['car', 'drive', 'driving', 'ev', 'vehicle'], reply: "Commuting by gasoline cars generates approximately 0.4kg of CO2 per mile. By switching to an electric vehicle (EV) or hybrid, you lower this coefficient by 50% to 80%. Consider pooling rides or using transit to avoid single-driver vehicle footprints!" },
  { keywords: ['flight', 'fly', 'plane', 'airplane', 'travel'], reply: "A single short-haul flight adds around 250kg of CO2e, while long-haul flights add over 1,200kg. The high altitude releases radiative forcing agents, amplifying warming. Try matching travel schedules, avoiding layovers, or offsetting via certified credit projects." },
  { keywords: ['electricity', 'utility', 'energy', 'heating', 'cooling', 'power'], reply: "Household energy accounts for 20% of emissions. Turning down the thermostat by just 2°F saves ~1.5kg CO2e hourly. Replaced bulbs with LED bulbs? Reaching out to your utility provider to switch to wind/solar renewable energy tariffs drops utility carbon to zero!" },
  { keywords: ['meat', 'diet', 'food', 'vegan', 'vegetarian', 'eat'], reply: "Red meat production releases large amounts of methane and requires land clearings. Vegans average 1.5 tons of food carbon per year, compared to 5.5 tons for heavy meat eaters. Committing to vegetarian meals or reducing food waste has massive immediate reductions." },
  { keywords: ['points', 'eco points', 'rewards', 'offset market'], reply: "You earn Eco Points by completing habits in the Action Center or logging clean transit (like biking/walking). Spend these points in the Virtual Offset Market to purchase Carbon Credits, support reforestation, and lower your net footprint!" },
  { keywords: ['gcp', 'cloud', 'deployment', 'docker', 'deploy'], reply: "This AetherEco app includes containerization config (Dockerfile + Nginx) optimized for Google Cloud Run! To deploy it on GCP, build the container image, push it to Artifact Registry, and trigger a Cloud Run service setup." }
];

export default function EcoChat() {
  const [messages, setMessages] = useState([
    { id: '1', sender: 'bot', text: "Hello! I am your AI Eco-Consultant. Ask me anything about driving footprints, diet changes, home energy saving, or how to deploy this container to Google Cloud Run (GCP)." }
  ]);
  const [inputText, setInputText] = useState('');
  const chatHistoryEndRef = useRef(null);

  // Auto-scroll chat history
  useEffect(() => {
    chatHistoryEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMessage = { id: Date.now().toString(), sender: 'user', text: inputText };
    setMessages(prev => [...prev, userMessage]);
    
    const query = inputText.toLowerCase();
    setInputText('');

    // Formulate reply after 600ms
    setTimeout(() => {
      let botResponse = "That is a great question! Reducing carbon footprints relies on simple daily habits: switching to LEDs, choosing plant-based meals, or switching to public transit. Type words like 'EV', 'flight', 'diet', or 'GCP' for detailed metrics.";
      
      for (const entry of ECO_CHAT_KNOWLEDGE) {
        if (entry.keywords.some(word => query.includes(word))) {
          botResponse = entry.reply;
          break;
        }
      }

      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: botResponse
      }]);
    }, 600);
  };

  return (
    <div className="glass-panel chat-container" style={{ maxWidth: '640px', margin: '0 auto', background: 'var(--panel-bg)' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingBottom: '16px', borderBottom: '1px solid var(--panel-border)', textAlign: 'left' }}>
        <div style={{ background: 'var(--gradient-eco)', padding: '8px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Bot size={20} color="#050609" />
        </div>
        <div>
          <h3 style={{ fontSize: '16px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            EcoAI Chat Advisor <Sparkles size={14} color="var(--accent-yellow)" fill="var(--accent-yellow)" />
          </h3>
          <span style={{ fontSize: '11px', color: 'var(--accent-green)' }}>● Online | Specialized Ecological intelligence</span>
        </div>
      </div>

      {/* Messages list */}
      <div className="chat-history">
        {messages.map(msg => (
          <div key={msg.id} className={`chat-msg ${msg.sender}`}>
            {msg.text}
          </div>
        ))}
        <div ref={chatHistoryEndRef} />
      </div>

      {/* Chat input box */}
      <form onSubmit={handleSend} className="chat-input-area">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Ask about flights, EV savings, diet, GCP..."
          className="form-input"
          style={{ borderRadius: '24px' }}
        />
        <button 
          type="submit" 
          className="btn btn-primary" 
          style={{ width: '48px', height: '48px', borderRadius: '50%', padding: '0', flexShrink: '0' }}
        >
          <Send size={16} />
        </button>
      </form>
    </div>
  );
}
