import React from 'react';
import { Search, Bell, Sun, UserCircle, Menu, Moon, Command } from 'lucide-react';
import { useSidebar } from '../hooks/useSidebar';
import './TopBar.css';

const TopBar = () => {
  const { isCollapsed, toggleSidebar } = useSidebar();
  const [isDark, setIsDark] = React.useState(false);

  return (
    <div className="top-bar">
      <div className="top-bar-left">
        {isCollapsed && (
          <button className="sidebar-expand-btn" onClick={toggleSidebar}>
            <Menu size={22} />
          </button>
        )}
        <div className="search-container">
          <Search size={18} className="search-icon" />
          <input type="text" placeholder="Search resources..." className="search-input" />
          <div className="search-kbd">
            <Command size={10} />
            <span>K</span>
          </div>
        </div>
      </div>

      <div className="top-bar-right">
        <button className="utility-btn" onClick={() => setIsDark(!isDark)}>
          {isDark ? <Sun size={20} /> : <Moon size={20} />}
        </button>
        <button className="utility-btn relative">
          <Bell size={20} />
          <span className="notification-badge pulse">3</span>
        </button>
        <div className="user-profile">
          <div className="avatar">P</div>
          <div className="user-info">
            <span className="user-name">Praise</span>
            <span className="user-role">Student</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
