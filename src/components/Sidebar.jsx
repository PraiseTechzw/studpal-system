import React from 'react';
import { 
  Home, FileText, BookOpen, Globe, Calendar, Hash, Users, 
  Sparkles, Wand2, Store, Clock, ChevronLeft, Search 
} from 'lucide-react';
import './Sidebar.css';

const Sidebar = () => {
  const sections = [
    {
      title: "RESOURCES",
      items: [
        { icon: <Home size={20} />, label: "Dashboard", active: true },
        { icon: <FileText size={20} />, label: "Text Notes" },
        { icon: <BookOpen size={20} />, label: "PDF Documents" },
        { icon: <Globe size={20} />, label: "Web Links" },
        { icon: <Calendar size={20} />, label: "Calendar" },
        { icon: <Hash size={20} />, label: "Tags" },
        { icon: <Users size={20} />, label: "Study Groups" },
      ]
    },
    {
      title: "AI FEATURES",
      items: [
        { icon: <Sparkles size={20} />, label: "AI Assistant", badge: "New", color: "var(--accent-teal)" },
        { icon: <Wand2 size={20} />, label: "Smart Tools" },
        { icon: <Store size={20} />, label: "Resource Exchange" },
      ]
    },
    {
      title: "PRODUCTIVITY",
      items: [
        { icon: <Clock size={20} />, label: "Study Timer", badge: "New" },
      ]
    }
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="logo">
          <div className="logo-icon">
            <Sparkles size={18} fill="white" />
          </div>
          <span>StudPal</span>
        </div>
        <button className="sidebar-toggle">
          <ChevronLeft size={20} />
        </button>
      </div>

      <nav className="sidebar-nav">
        {sections.map((section, idx) => (
          <div key={idx} className="nav-section">
            <h3 className="nav-section-title">{section.title}</h3>
            <ul className="nav-list">
              {section.items.map((item, i) => (
                <li key={i}>
                  <a href="#" className={`nav-item ${item.active ? 'active' : ''}`}>
                    <span className="nav-item-icon">{item.icon}</span>
                    <span className="nav-item-label">{item.label}</span>
                    {item.badge && (
                      <span className={`nav-item-badge ${item.badge === 'New' ? 'new' : ''}`}>
                        {item.badge}
                      </span>
                    )}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
