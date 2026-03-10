import React from 'react';
import PageHeader from '../components/PageHeader';
import { Wand2, Zap, FileText, Layout, Copy, Brain, Layers, Share2 } from 'lucide-react';
import { motion } from 'framer-motion';
import './SmartTools.css';

const SmartTools = () => {
  const tools = [
    { title: "Smart Summary", desc: "Extract key concepts from long notes or PDFs instantly.", icon: <FileText size={24} />, color: "#3b82f6" },
    { title: "Quiz Generator", desc: "Turn your study materials into interactive quiz sessions.", icon: <Zap size={24} />, color: "#f59e0b" },
    { title: "Mind Map AI", desc: "Visualize connections between your complex study topics.", icon: <Layout size={24} />, color: "#8b5cf6" },
    { title: "Flashcard Creator", desc: "Automatically generate digital flashcards for revision.", icon: <Copy size={24} />, color: "#ef4444" },
    { title: "Plagiarism Check", desc: "Ensure your research and reports are original and properly cited.", icon: <Brain size={24} />, color: "#10b981" },
    { title: "Format Converter", desc: "Switch between different file formats effortlessly.", icon: <Layers size={24} />, color: "#6366f1" },
  ];

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
            <button className="tool-launch-btn">Launch Tool</button>
          </motion.div>
        ))}
      </div>

      <div className="smart-results-placeholder">
        <div className="results-header">
          <Wand2 size={24} color="var(--accent-teal)" />
          <span>Recent Extractions & AI Generations</span>
        </div>
        <div className="results-empty-state">
          <p>No active tool sessions found. Launch a tool to start generating smart results.</p>
        </div>
      </div>
    </div>
  );
};

export default SmartTools;
