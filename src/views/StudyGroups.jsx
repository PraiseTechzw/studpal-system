import React from 'react';
import PageHeader from '../components/PageHeader';
import { Plus, Users, Search, MessageSquare, BookOpen, Clock, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import './StudyGroups.css';

const StudyGroups = () => {
  const groups = [
    { title: "Med Physics A1", members: 12, category: "Science", status: "Active Now", icon: "🧬" },
    { title: "Intro to Algorithm Thinking", members: 45, category: "CS", status: "Studying Mon-Wed", icon: "💻" },
    { title: "Classic Literature Lovers", members: 8, category: "English", status: "Next Session: 4PM", icon: "📚" },
    { title: "Global Economics 101", members: 24, category: "Business", status: "Active Now", icon: "📊" },
  ];

  return (
    <div className="view-container">
      <PageHeader 
        title="Study Groups" 
        subtitle="Collaborate with peers, share resources, and join live study sessions."
        actions={
          <>
            <button className="action-btn-secondary"><Search size={18} /> Find Group</button>
            <button className="action-btn-primary"><Plus size={18} /> Create Group</button>
          </>
        }
      />

      <div className="groups-grid">
        {groups.map((group, idx) => (
          <motion.div 
            key={idx} 
            className="group-card"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1 }}
          >
            <div className="group-card-header">
              <div className="group-avatar-stack">
                <div className="group-icon-main">{group.icon}</div>
                <div className="status-indicator-dot online"></div>
              </div>
              <div className="group-header-info">
                <span className="group-category-pill">{group.category}</span>
                <h3>{group.title}</h3>
              </div>
            </div>

            <div className="group-stats-row">
              <div className="stat-unit">
                <Users size={14} />
                <span>{group.members} Members</span>
              </div>
              <div className="stat-unit">
                <Clock size={14} />
                <span>{group.status}</span>
              </div>
            </div>

            <div className="group-card-actions">
              <button className="join-group-btn">Join Group <ChevronRight size={16} /></button>
              <button className="chat-group-btn"><MessageSquare size={18} /></button>
            </div>
          </motion.div>
        ))}
      </div>
      
      <div className="create-group-invite-banner">
        <div className="invite-content">
          <h2>Start a new Study Hub</h2>
          <p>Create a space for your class or project team and manage everything in one place.</p>
          <button className="action-btn-primary">Get Started</button>
        </div>
        <div className="invite-emoji">🚀</div>
      </div>
    </div>
  );
};

export default StudyGroups;
