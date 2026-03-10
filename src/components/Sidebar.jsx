import React from 'react';
import { 
  Home, FileText, BookOpen, Globe, Calendar, Hash, Users, 
  Sparkles, Wand2, Store, Clock, ChevronLeft, ChevronRight, Menu
} from 'lucide-react';
import { useSidebar } from '../hooks/useSidebar';
import { motion, AnimatePresence } from 'framer-motion';
import './Sidebar.css';

const Sidebar = () => {
  const { isCollapsed, toggleSidebar } = useSidebar();

  const sections = [
    {
      title: "RESOURCES",
      items: [
        { icon: <Home size={22} />, label: "Dashboard", active: true },
        { icon: <FileText size={22} />, label: "Text Notes" },
        { icon: <BookOpen size={22} />, label: "PDF Documents" },
        { icon: <Globe size={22} />, label: "Web Links" },
        { icon: <Calendar size={22} />, label: "Calendar" },
        { icon: <Hash size={22} />, label: "Tags" },
        { icon: <Users size={22} />, label: "Study Groups" },
      ]
    },
    {
      title: "AI FEATURES",
      items: [
        { icon: <Sparkles size={22} />, label: "AI Assistant", badge: "New" },
        { icon: <Wand2 size={22} />, label: "Smart Tools" },
        { icon: <Store size={22} />, label: "Resource Exchange" },
      ]
    },
    {
      title: "PRODUCTIVITY",
      items: [
        { icon: <Clock size={22} />, label: "Study Timer", badge: "Live" },
      ]
    }
  ];

  return (
    <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <div className="logo">
          <div className="logo-icon">
            <Sparkles size={20} fill="white" />
          </div>
          {!isCollapsed && (
            <motion.span 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
            >
              StudPal
            </motion.span>
          )}
        </div>
        <button className="sidebar-toggle" onClick={toggleSidebar}>
          {isCollapsed ? <Menu size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      <nav className="sidebar-nav">
        {sections.map((section, idx) => (
          <div key={idx} className="nav-section">
            {!isCollapsed && (
              <motion.h3 
                className="nav-section-title"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                {section.title}
              </motion.h3>
            )}
            <ul className="nav-list">
              {section.items.map((item, i) => (
                <li key={i}>
                  <a 
                    href="#" 
                    className={`nav-item ${item.active ? 'active' : ''} ${isCollapsed ? 'item-collapsed' : ''}`}
                    title={isCollapsed ? item.label : ''}
                  >
                    <span className="nav-item-icon">{item.icon}</span>
                    {!isCollapsed && (
                      <motion.span 
                        className="nav-item-label"
                        initial={{ opacity: 0, x: -5 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        {item.label}
                      </motion.span>
                    )}
                    {!isCollapsed && item.badge && (
                      <span className={`nav-item-badge ${item.badge.toLowerCase()}`}>
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

      <div className="sidebar-footer">
        {/* Can add user profile here or premium pill */}
      </div>
    </aside>
  );
};

export default Sidebar;
