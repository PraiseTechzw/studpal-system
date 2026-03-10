import React from 'react';
import { 
  Sparkles, Wand2, Store, Clock, ChevronLeft, Menu, Shield, BarChart2,
  Settings, LogOut, Home, FileText, BookOpen, Globe, Calendar, Hash, Users
} from 'lucide-react';
import { useSidebar } from '../hooks/useSidebar';
import { useAuth } from '../hooks/useAuth';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  const { isCollapsed, toggleSidebar } = useSidebar();
  const { signOut } = useAuth();
  const location = useLocation();

  const sections = [
    {
      title: "RESOURCES",
      items: [
        { icon: <Home size={22} />, label: "Dashboard", path: "/dashboard" },
        { icon: <FileText size={22} />, label: "Text Notes", path: "/text-notes" },
        { icon: <BookOpen size={22} />, label: "PDF Documents", path: "/pdf-documents" },
        { icon: <Globe size={22} />, label: "Web Links", path: "/web-links" },
        { icon: <Calendar size={22} />, label: "Calendar", path: "/calendar" },
        { icon: <Hash size={22} />, label: "Tags", path: "/tags" },
        { icon: <Users size={22} />, label: "Study Groups", path: "/study-groups" },
      ]
    },
    {
      title: "AI FEATURES",
      items: [
        { icon: <Sparkles size={22} />, label: "AI Assistant", path: "/ai-assistant", badge: "New" },
        { icon: <Wand2 size={22} />, label: "Smart Tools", path: "/smart-tools" },
        { icon: <Store size={22} />, label: "Resource Exchange", path: "/resource-exchange" },
      ]
    },
    {
      title: "ADMIN PORTAL",
      items: [
        { icon: <Shield size={22} />, label: "Admin Center", path: "/admin" },
        { icon: <BarChart2 size={22} />, label: "System Analytics", path: "/admin" },
      ]
    },
    {
      title: "PRODUCTIVITY",
      items: [
        { icon: <Clock size={22} />, label: "Study Timer", path: "/study-timer", badge: "Live" },
      ]
    }
  ];

  return (
    <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <Link to="/dashboard" className="logo">
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
        </Link>
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
              {section.items.map((item, i) => {
                const isActive = location.pathname === item.path;
                return (
                  <li key={i}>
                    <Link 
                      to={item.path} 
                      className={`nav-item ${isActive ? 'active' : ''} ${isCollapsed ? 'item-collapsed' : ''}`}
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
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="sidebar-footer">
        <Link 
          to="/settings" 
          className={`nav-item footer-item ${location.pathname === '/settings' ? 'active' : ''}`}
          title={isCollapsed ? "Settings" : ""}
        >
          <span className="nav-item-icon"><Settings size={22} /></span>
          {!isCollapsed && <span className="nav-item-label">Settings</span>}
        </Link>
        <button 
          onClick={signOut}
          className="nav-item footer-item logout"
          style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer' }}
          title={isCollapsed ? "Logout" : ""}
        >
          <span className="nav-item-icon"><LogOut size={22} /></span>
          {!isCollapsed && <span className="nav-item-label">Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
