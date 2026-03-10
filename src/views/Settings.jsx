import React from 'react';
import PageHeader from '../components/PageHeader';
import { 
  User, Bell, Shield, Palette, Globe, 
  HelpCircle, LogOut, ChevronRight, Camera, 
  Mail, Phone, MapPin, Sparkles 
} from 'lucide-react';
import { motion } from 'framer-motion';
import './Settings.css';

const Settings = () => {
  const sections = [
    { title: "Account Preferences", icon: <User size={20} />, items: ["Email & Security", "Data Management", "Global Language"] },
    { title: "Notifications", icon: <Bell size={20} />, items: ["Push Notifications", "Email Summaries", "AI Alerts"] },
    { title: "Privacy & Security", icon: <Shield size={20} />, items: ["Two-Factor Auth", "Connected Apps", "Privacy Policy"] },
    { title: "Appearance", icon: <Palette size={20} />, items: ["Theme Settings", "Font Size", "Dashboard Layout"] },
  ];

  return (
    <div className="view-container">
      <PageHeader 
        title="Settings & Profile" 
        subtitle="Manage your personal information, security, and notification preferences."
      />

      <div className="settings-grid">
        <div className="settings-left-pane">
          <div className="profile-hero-card">
            <div className="profile-avatar-wrapper">
              <div className="profile-avatar">P</div>
              <button className="avatar-edit-btn"><Camera size={14} /></button>
            </div>
            <div className="profile-info">
              <h2>Praise Johnson</h2>
              <p>Student at University of Technology</p>
              <div className="profile-badges">
                <span className="premium-badge"><Sparkles size={12} /> Pro Member</span>
              </div>
            </div>
          </div>

          <div className="profile-details-list">
            <div className="detail-item">
              <Mail size={18} />
              <div className="detail-content">
                <span className="detail-label">Email</span>
                <span className="detail-val">praise.j@edu.io</span>
              </div>
            </div>
            <div className="detail-item">
              <Phone size={18} />
              <div className="detail-content">
                <span className="detail-label">Phone</span>
                <span className="detail-val">+1 (555) 000-1111</span>
              </div>
            </div>
            <div className="detail-item">
              <MapPin size={18} />
              <div className="detail-content">
                <span className="detail-label">Location</span>
                <span className="detail-val">San Francisco, CA</span>
              </div>
            </div>
          </div>
        </div>

        <div className="settings-right-pane">
          <div className="settings-sections">
            {sections.map((section, idx) => (
              <motion.div 
                key={idx} 
                className="setting-section-card"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <div className="section-title">
                  <div className="section-icon">{section.icon}</div>
                  <h3>{section.title}</h3>
                </div>
                <div className="setting-items">
                  {section.items.map((item, i) => (
                    <div key={i} className="setting-row">
                      <span>{item}</span>
                      <ChevronRight size={16} />
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}

            <button className="logout-btn">
              <LogOut size={18} /> Sign Out of All Devices
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
