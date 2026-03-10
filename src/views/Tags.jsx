import React from 'react';
import PageHeader from '../components/PageHeader';
import { Plus, Hash, Tag, Search, Filter, MoreVertical } from 'lucide-react';
import { motion } from 'framer-motion';
import './Tags.css';

const Tags = () => {
  const tags = [
    { name: "Biology", count: 12, color: "#14b8a6" },
    { name: "Organic Chem", count: 8, color: "#ef4444" },
    { name: "Final Exams", count: 24, color: "#3b82f6" },
    { name: "World History", count: 5, color: "#f59e0b" },
    { name: "CS Basics", count: 15, color: "#8b5cf6" },
    { name: "Research", count: 3, color: "#10b981" },
  ];

  return (
    <div className="view-container">
      <PageHeader 
        title="Tags" 
        subtitle="Organize your resources across different subjects and topics using tags."
        actions={
          <button className="action-btn-primary"><Plus size={18} /> Create Tag</button>
        }
      />

      <div className="tags-management-grid">
        <div className="tags-list-section">
          <div className="search-tags-bar">
            <Search size={18} />
            <input type="text" placeholder="Search tags..." />
          </div>

          <div className="tags-grid-display">
            {tags.map((tag, idx) => (
              <motion.div 
                key={idx} 
                className="tag-management-card"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05 }}
              >
                <div className="tag-card-top">
                  <div className="tag-color-indicator" style={{ backgroundColor: tag.color }}></div>
                  <button className="tag-more-btn"><MoreVertical size={16} /></button>
                </div>
                <div className="tag-card-content">
                  <Hash size={18} className="tag-hash-icon" />
                  <h3>{tag.name}</h3>
                  <p>{tag.count} resources tagged</p>
                </div>
              </motion.div>
            ))}
            
            <button className="add-tag-placeholder-card">
              <Plus size={24} />
              <span>Add New Tag</span>
            </button>
          </div>
        </div>

        <aside className="tags-sidebar">
          <div className="tag-stats-premium-card">
            <h3>Tag Insights</h3>
            <div className="insight-stat">
              <span className="insight-label">Most Used</span>
              <span className="insight-value">Final Exams</span>
            </div>
            <div className="insight-stat">
              <span className="insight-label">Total Unique Tags</span>
              <span className="insight-value">28</span>
            </div>
            <div className="insight-stat">
              <span className="insight-label">Untagged Items</span>
              <span className="insight-value">14</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Tags;
