import React, { useState, useEffect } from 'react';
import PageHeader from '../components/PageHeader';
import { Send, Sparkles, User, Brain, MessageSquare, Plus, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../utils/supabaseClient';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';
import './AIAssistant.css';

const AIAssistant = () => {
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    fetchConversations();
  }, [user]);

  useEffect(() => {
    if (activeConversation) {
      fetchMessages(activeConversation.id);
    }
  }, [activeConversation]);

  const fetchConversations = async () => {
    try {
      const { data, error } = await supabase
        .from('conversations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setConversations(data || []);
      if (data && data.length > 0 && !activeConversation) {
        setActiveConversation(data[0]);
      }
    } catch (err) {
      console.error("Error fetching conversations:", err.message);
    }
  };

  const fetchMessages = async (convId) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', convId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages(data || []);
    } catch (err) {
      console.error("Error fetching messages:", err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || sending) return;

    let convId = activeConversation?.id;

    try {
      setSending(true);
      
      // 1. Create conversation if none active
      if (!convId) {
        const { data, error } = await supabase
          .from('conversations')
          .insert({ user_id: user.id, title: input.substring(0, 30), last_message: input })
          .select()
          .single();
        if (error) throw error;
        convId = data.id;
        setActiveConversation(data);
        setConversations([data, ...conversations]);
      }

      // 2. Insert user message
      const { error: msgError } = await supabase
        .from('messages')
        .insert({ conversation_id: convId, role: 'user', content: input });
      
      if (msgError) throw msgError;

      const userMsg = { role: 'user', content: input, created_at: new Date().toISOString() };
      setMessages(prev => [...prev, userMsg]);
      setInput("");

      // 3. Simulate AI Response (In a real app, this would call an Edge Function or API)
      const aiResponse = "I've analyzed your request. I can help you summarize those Biology notes or extract key terms from your PDF.";
      
      const { error: aiError } = await supabase
        .from('messages')
        .insert({ conversation_id: convId, role: 'assistant', content: aiResponse });

      if (aiError) throw aiError;

      setMessages(prev => [...prev, { role: 'assistant', content: aiResponse, created_at: new Date().toISOString() }]);

      // Update conversation last message
      await supabase.from('conversations').update({ last_message: aiResponse }).eq('id', convId);

    } catch (err) {
      toast.error('Error sending message: ' + err.message);
    } finally {
      setSending(false);
    }
  };

  const startNewChat = () => {
    setActiveConversation(null);
    setMessages([]);
    setInput("");
  };

  return (
    <div className="view-container">
      <PageHeader 
        title="AI Assistant" 
        subtitle="Your personalized AI tutor and organization expert."
      />

      <div className="ai-chat-container">
        <div className="chat-sidebar">
          <button className="new-chat-btn" onClick={startNewChat}><Plus size={18} /> New Conversation</button>
          <div className="recent-chats">
            <h3>Recent Sessions</h3>
            {conversations.map(conv => (
              <div 
                key={conv.id} 
                className={`recent-item ${activeConversation?.id === conv.id ? 'active' : ''}`}
                onClick={() => setActiveConversation(conv)}
              >
                <MessageSquare size={16} />
                <span>{conv.title}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="chat-main">
          <div className="messages-list">
            <AnimatePresence>
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
                    <p>{msg.content}</p>
                    <span className="message-time">{new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {loading && <div className="flex-center-p"><Loader2 className="animate-spin" color="var(--accent-teal)" /></div>}
          </div>

          <div className="chat-input-area">
            <div className="chat-input-wrapper">
              <input 
                type="text" 
                placeholder="Ask me anything about your studies..." 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                disabled={sending}
              />
              <button className="send-btn" onClick={handleSend} disabled={sending || !input.trim()}>
                {sending ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;
