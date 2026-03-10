import React from 'react';
import { Sparkles, FileText, Upload, Globe, Users } from 'lucide-react';
import './QuickActions.css';

const QuickActions = () => {
  const actions = [
    { icon: <Sparkles size={24} color="#14b8a6" />, title: "Ask AI Assistant", desc: "Get help with your studies" },
    { icon: <FileText size={24} color="#3b82f6" />, title: "Create Note", desc: "Write a new text note" },
    { icon: <Upload size={24} color="#f59e0b" />, title: "Upload PDF", desc: "Add a new document" },
    { icon: <Globe size={24} color="#8b5cf6" />, title: "Save Link", desc: "Bookmark a web resource" },
    { icon: <Users size={24} color="#10b981" />, title: "Join Study Group", desc: "Collaborate with peers" }
  ];

  return (
    <div className="quick-actions-card">
      <div className="actions-header">
        {actions.map((action, idx) => (
          <div key={idx} className="action-item">
            <div className="action-icon-wrapper">
              {action.icon}
            </div>
            <div className="action-info">
              <h3>{action.title}</h3>
              <p>{action.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;
