import React, { useState } from 'react';
import PageHeader from '../components/PageHeader';
import { Send, Sparkles, User, Brain, MessageSquare, Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import './AIAssistant.css';

const AIAssistant = () => {
  const [messages, setMessages] = useState([
    { role: 'assistant', text: "Hello Praise! I'm your AI Study Assistant. How can I help you organize your materials today?", time: "09:41 AM" },
  ]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages([...messages, { role: 'user', text: input, time: "Just now" }]);
    setInput("");
    // Simulate response
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        text: "That sounds like a great study plan. I can help you summarize those Biology notes or extract key terms from your PDF.", 
        time: "Just now" 
      }]);
    }, 1500);
  };

  return (
    <div className="view-container">
      <PageHeader 
        title="AI Assistant" 
        subtitle="Your personalized AI tutor and organization expert."
      />

      <div className="ai-chat-container">
        <div className="chat-sidebar">
          <button className="new-chat-btn"><Plus size={18} /> New Conversation</button>
          <div className="recent-chats">
            <h3>Recent Sessions</h3>
            <div className="recent-item active">
              <MessageSquare size={16} />
              <span>Biology Exam Prep</span>
            </div>
            <div className="recent-item">
              <MessageSquare size={16} />
              <span>History Summary</span>
            </div>
          </div>
        </div>

        <div className="chat-main">
          <div className="messages-list">
            {messages.map((msg, idx) => (
              <motion.div 
                key={idx} 
                className={`message-wrapper ${msg.role}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className={`message-avatar ${msg.role}`}>
                  {msg.role === 'assistant' ? <Sparkles size={16} /> : <User size={16} />}
                </div>
                <div className="message-bubble">
                  <p>{msg.text}</p>
                  <span className="message-time">{msg.time}</span>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="chat-input-area">
            <div className="chat-input-wrapper">
              <input 
                type="text" 
                placeholder="Ask me anything about your studies..." 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              />
              <button className="send-btn" onClick={handleSend}>
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;
