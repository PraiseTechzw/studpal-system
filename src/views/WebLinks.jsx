import React from 'react';
import PageHeader from '../components/PageHeader';
import { Plus, Globe, ExternalLink, Trash2, Search, Link as LinkIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import './WebLinks.css';

const WebLinks = () => {
  const links = [
    { title: "Khan Academy - Biology", url: "https://khanacademy.org", type: "Tutorial", date: "Mar 08" },
    { title: "MDN Web Docs", url: "https://developer.mozilla.org", type: "Docs", date: "Mar 05" },
    { title: "Crash Course History", url: "https://youtube.com/crashcourse", type: "Video", date: "Mar 02" },
    { title: "Research Gate - Mitochondria", url: "https://researchgate.net", type: "Academic", date: "Feb 28" },
  ];

  return (
    <div className="view-container">
      <PageHeader 
        title="Web Links" 
        subtitle="Save and categorize important research articles and study websites."
        actions={
          <button className="action-btn-primary"><Plus size={18} /> Add Link</button>
        }
      />

      <div className="links-grid">
        {links.map((link, idx) => (
          <motion.div 
            key={idx} 
            className="link-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <div className="link-card-body">
              <div className="link-icon-bg">
                <Globe size={24} color="var(--accent-teal)" />
              </div>
              <div className="link-info">
                <h3>{link.title}</h3>
                <p className="link-url">{link.url}</p>
                <div className="link-tags">
                  <span className="link-tag">{link.type}</span>
                  <span className="link-date">{link.date}</span>
                </div>
              </div>
            </div>
            <div className="link-actions">
              <a href={link.url} target="_blank" rel="noopener noreferrer" className="link-btn-visit">
                <ExternalLink size={16} /> Visit
              </a>
              <button className="link-btn-delete"><Trash2 size={16} /></button>
            </div>
          </motion.div>
        ))}
        {/* Placeholder for new link */}
        <div className="link-card-add">
          <LinkIcon size={32} />
          <span>Save a new URL</span>
        </div>
      </div>
    </div>
  );
};

export default WebLinks;
