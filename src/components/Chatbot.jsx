import React, { useState } from 'react';
import { MessageSquare, X, Send } from 'lucide-react';
import './Chatbot.css';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Hi! How can I help you with your 3D printing needs today?", sender: "bot" }
  ]);
  const [input, setInput] = useState("");

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    const userMsg = { text: input, sender: "user" };
    setMessages(prev => [...prev, userMsg]);
    setInput("");

    // Mock bot reply
    setTimeout(() => {
      setMessages(prev => [...prev, { text: "Thanks for reaching out! A human agent will address this shortly. In the meantime, check out our Custom Print tab for quotes.", sender: "bot" }]);
    }, 1000);
  };

  return (
    <div className="chatbot-container">
      {isOpen && (
        <div className="chat-window glass-panel">
          <div className="chat-header">
            <h4>Anantam Assistant</h4>
            <button className="close-btn" onClick={() => setIsOpen(false)}>
              <X size={18} />
            </button>
          </div>
          
          <div className="chat-messages">
            {messages.map((msg, idx) => (
              <div key={idx} className={`chat-bubble ${msg.sender}`}>
                {msg.text}
              </div>
            ))}
          </div>

          <form className="chat-input-area" onSubmit={handleSend}>
            <input 
              type="text" 
              placeholder="Type your message..." 
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button type="submit" className="send-btn">
              <Send size={18} />
            </button>
          </form>
        </div>
      )}

      {!isOpen && (
        <button className="chat-toggle-btn shadow-glow" onClick={() => setIsOpen(true)}>
          <MessageSquare size={24} />
        </button>
      )}
    </div>
  );
};

export default Chatbot;
