import React from 'react';
import { Sparkles, Bell } from 'lucide-react';
import './Hero.css';

const Hero = () => {
  const stats = [
    { label: "Total Materials", value: "24" },
    { label: "Due This Week", value: "5" },
    { label: "Shared With You", value: "3" },
    { label: "AI Generations", value: "12" }
  ];

  return (
    <div className="hero">
      <div className="hero-content">
        <div className="hero-header">
          <div className="hero-text">
            <h1>Good evening, Praise! 👋</h1>
            <p className="hero-subtitle">Ready to organize your study materials?</p>
          </div>
          <div className="hero-actions">
            <button className="primary-glass-btn">
              <Sparkles size={16} />
              AI Assistant
            </button>
            <button className="secondary-glass-btn relative">
              <Bell size={18} />
              <span className="hero-notif-badge">3</span>
              Notifications
            </button>
          </div>
        </div>

        <div className="stats-grid">
          {stats.map((stat, idx) => (
            <div key={idx} className="stat-card">
              <span className="stat-label">{stat.label}</span>
              <span className="stat-value">{stat.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Hero;
