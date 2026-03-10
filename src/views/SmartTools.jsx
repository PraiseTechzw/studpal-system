import React, { useState, useEffect } from 'react';
import PageHeader from '../components/PageHeader';
import { Wand2, Zap, FileText, Layout, Copy, Brain, Layers, Share2, Loader2, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../utils/supabaseClient';
import { useAuth } from '../hooks/useAuth';
import './SmartTools.css';

const SmartTools = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(null);
  const { user } = useAuth();

  const tools = [
    { id: 'summary', title: "Smart Summary", desc: "Extract key concepts from long notes or PDFs instantly.", icon: <FileText size={24} />, color: "#3b82f6" },
    { id: 'quiz', title: "Quiz Generator", desc: "Turn your study materials into interactive quiz sessions.", icon: <Zap size={24} />, color: "#f59e0b" },
    { id: 'mindmap', title: "Mind Map AI", desc: "Visualize connections between your complex study topics.", icon: <Layout size={24} />, color: "#8b5cf6" },
    { id: 'flashcard', title: "Flashcard Creator", desc: "Automatically generate digital flashcards for revision.", icon: <Copy size={24} />, color: "#ef4444" },
    { id: 'plagiarism', title: "Plagiarism Check", desc: "Ensure your research and reports are original and properly cited.", icon: <Brain size={24} />, color: "#10b981" },
    { id: 'convert', title: "Format Converter", desc: "Switch between different file formats effortlessly.", icon: <Layers size={24} />, color: "#6366f1" },
  ];

  useEffect(() => {
    fetchResults();
  }, [user]);

  const fetchResults = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('smart_results')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setResults(data || []);
    } catch (err) {
      console.error("Error fetching tool results:", err.message);
    } finally {
      setLoading(false);
    }
  };

  const launchTool = async (tool) => {
    try {
      setRunning(tool.id);
      
      // Simulate Tool Execution
      await new Promise(resolve => setTimeout(resolve, 2000));

      const mockResponse = `AI generated ${tool.title} results for your latest study materials.`;

      const { error } = await supabase
        .from('smart_results')
        .insert({
          user_id: user.id,
          tool_name: tool.title,
          output_result: mockResponse
        });

      if (error) throw error;
      fetchResults();
    } catch (err) {
      alert("Error running tool: " + err.message);
    } finally {
      setRunning(null);
    }
  };

  const deleteResult = async (id) => {
    try {
      const { error } = await supabase.from('smart_results').delete().eq('id', id);
      if (error) throw error;
      setResults(results.filter(r => r.id !== id));
    } catch (err) {
      alert("Error deleting result: " + err.message);
    }
  };

  return (
    <div className="view-container">
      <PageHeader 
        title="Smart Tools" 
        subtitle="AI-powered utilities to accelerate your study and research workflow."
        actions={
          <button className="action-btn-primary"><Share2 size={18} /> Share Results</button>
        }
      />

      <div className="smart-tools-grid">
        {tools.map((tool, idx) => (
          <motion.div 
            key={idx} 
            className="smart-tool-card"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.05 }}
          >
            <div className="tool-card-icon" style={{ backgroundColor: tool.color + '15', color: tool.color }}>
              {tool.icon}
            </div>
            <div className="tool-card-content">
              <h3>{tool.title}</h3>
              <p>{tool.desc}</p>
            </div>
            <button 
              className="tool-launch-btn" 
              onClick={() => launchTool(tool)}
              disabled={running === tool.id}
            >
              {running === tool.id ? <Loader2 size={18} className="animate-spin" /> : "Launch Tool"}
            </button>
          </motion.div>
        ))}
      </div>

      <div className="smart-results-placeholder">
        <div className="results-header">
          <Wand2 size={24} color="var(--accent-teal)" />
          <span>Recent Extractions & AI Generations</span>
        </div>
        
        {loading ? (
          <div className="flex-center-p"><Loader2 className="animate-spin" /></div>
        ) : (
          <div className="results-list">
            <AnimatePresence>
              {results.map(res => (
                <motion.div 
                  key={res.id} 
                  className="smart-result-item"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                >
                  <div className="res-info">
                    <h4>{res.tool_name}</h4>
                    <p>{res.output_result}</p>
                    <span className="res-date">{new Date(res.created_at).toLocaleString()}</span>
                  </div>
                  <button className="delete-res-btn" onClick={() => deleteResult(res.id)}>
                    <Trash2 size={16} />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
            {results.length === 0 && (
              <div className="results-empty-state">
                <p>No active tool sessions found. Launch a tool to start generating smart results.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SmartTools;
