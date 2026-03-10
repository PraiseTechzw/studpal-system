import React from 'react';
import { Sparkles, FileText, Plus } from 'lucide-react';
import './Recommendations.css';

const Recommendations = () => {
  const items = [
    { 
      title: "Cell Biology Fundam...", 
      subtitle: "Based on your recent Bio studies",
      icon: <FileText size={18} color="#14b8a6" />
    },
    { 
      title: "Advanced Mitochond... Research", 
      subtitle: "Chapter 4: Energy conversion",
      icon: <FileText size={18} color="#3b82f6" />
    }
  ];

  return (
    <div className="recommendations-card">
      <div className="recommend-header">
        <div className="recommend-title">
          <Sparkles size={18} color="#14b8a6" />
          <h2>AI Recommendations</h2>
        </div>
        <p>Personalized resources based on study patterns</p>
      </div>

      <div className="recommend-list">
        {items.map((item, idx) => (
          <div key={idx} className="recommend-item">
            <div className="recommend-icon">
              {item.icon}
            </div>
            <div className="recommend-info">
              <h3>{item.title}</h3>
              <p>{item.subtitle}</p>
            </div>
          </div>
        ))}
      </div>

      <button className="add-material-btn">
        <Plus size={18} />
        Add Material
      </button>
    </div>
  );
};

export default Recommendations;
