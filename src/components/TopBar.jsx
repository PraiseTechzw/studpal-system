import React from 'react';
import { Search, Bell, Sun, UserCircle } from 'lucide-react';
import './TopBar.css';

const TopBar = () => {
  return (
    <div className="top-bar">
      <div className="search-container">
        <Search size={18} className="search-icon" />
        <input type="text" placeholder="Search all resources..." className="search-input" />
      </div>

      <div className="top-bar-right">
        <button className="utility-btn">
          <Sun size={20} />
        </button>
        <button className="utility-btn relative">
          <Bell size={20} />
          <span className="notification-badge">3</span>
        </button>
        <div className="user-profile">
          <div className="avatar">P</div>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
