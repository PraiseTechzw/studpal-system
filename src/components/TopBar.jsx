import { Search, Bell, Sun, Menu, Moon, Command, LogOut } from 'lucide-react';
import { useSidebar } from '../hooks/useSidebar';
import { useAuth } from '../hooks/useAuth';
import './TopBar.css';

const TopBar = () => {
  const { isCollapsed, toggleSidebar } = useSidebar();
  const { user, signOut } = useAuth();
  const [isDark, setIsDark] = React.useState(false);

  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || "User";
  const initials = userName.split(' ').map(n => n[0]).join('').toUpperCase();

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
          <div className="avatar">{initials}</div>
          <div className="user-info">
            <span className="user-name">{userName}</span>
            <span className="user-role">Student</span>
          </div>
          <button className="utility-btn ml-2" onClick={signOut} title="Sign Out">
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
