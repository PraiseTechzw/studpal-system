import React from 'react';
import PageHeader from '../components/PageHeader';
import { 
  Users, Database, Shield, Activity, HardDrive, 
  Settings, TrendingUp, AlertCircle, CheckCircle, 
  ArrowUpRight, ArrowDownRight, MoreHorizontal, Search, Filter 
} from 'lucide-react';
import { motion } from 'framer-motion';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const stats = [
    { label: "Total Users", value: "1,284", growth: "+12.5%", positive: true, icon: <Users size={20} /> },
    { label: "Active Sessions", value: "482", growth: "+5.2%", positive: true, icon: <Activity size={20} /> },
    { label: "DB Usage", value: "84.2 GB", growth: "-2.1%", positive: true, icon: <Database size={20} /> },
    { label: "Security Alerts", value: "0", growth: "0%", positive: true, icon: <Shield size={20} /> },
  ];

  const recentUsers = [
    { name: "Sarah Johnson", email: "sarah@edu.com", role: "Student", status: "Active", joined: "2h ago" },
    { name: "Robert Fox", email: "robert@university.com", role: "Instructor", status: "Active", joined: "5h ago" },
    { name: "Emily Chen", email: "emily.c@school.org", role: "Student", status: "Pending", joined: "1d ago" },
    { name: "Michael Page", email: "m.page@studpal.io", role: "Admin", status: "Active", joined: "3d ago" },
  ];

  return (
    <div className="view-container">
      <PageHeader 
        title="Admin Control Center" 
        subtitle="Global platform management, user oversight, and system health monitoring."
        actions={
          <button className="action-btn-primary shadow-premium-btn"><Settings size={18} /> System Config</button>
        }
      />

      <div className="admin-stats-grid">
        {stats.map((stat, idx) => (
          <motion.div 
            key={idx} 
            className="admin-stat-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <div className="stat-card-top">
              <div className="stat-icon-box">{stat.icon}</div>
              <div className={`growth-pill ${stat.positive ? 'positive' : 'negative'}`}>
                {stat.positive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                {stat.growth}
              </div>
            </div>
            <div className="stat-card-bottom">
              <h3>{stat.value}</h3>
              <p>{stat.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="admin-bottom-grid">
        <div className="admin-main-card">
          <div className="card-header-row">
            <h3>Recent User Registrations</h3>
            <div className="card-actions">
              <div className="mini-search">
                <Search size={14} />
                <input type="text" placeholder="Search users..." />
              </div>
              <button className="icon-btn-rounded"><Filter size={16} /></button>
            </div>
          </div>

          <div className="admin-table">
            <div className="admin-table-header">
              <span>User</span>
              <span>Role</span>
              <span>Status</span>
              <span>Joined</span>
              <span></span>
            </div>
            {recentUsers.map((user, idx) => (
              <div key={idx} className="admin-table-row">
                <div className="user-cell">
                  <div className="user-initials">{user.name.split(' ').map(n => n[0]).join('')}</div>
                  <div className="user-details">
                    <span className="user-name">{user.name}</span>
                    <span className="user-email">{user.email}</span>
                  </div>
                </div>
                <div className="role-cell">
                  <span className={`role-badge ${user.role.toLowerCase()}`}>{user.role}</span>
                </div>
                <div className="status-cell">
                  <span className={`status-pill ${user.status.toLowerCase()}`}>
                    <div className="dot"></div> {user.status}
                  </span>
                </div>
                <div className="joined-cell">{user.joined}</div>
                <div className="action-cell">
                  <button className="icon-btn-rounded"><MoreHorizontal size={16} /></button>
                </div>
              </div>
            ))}
          </div>
          
          <button className="view-all-table-btn">View All Management Records</button>
        </div>

        <aside className="system-health-sidebar">
          <div className="health-card">
            <h3>System Health</h3>
            
            <div className="health-stat">
              <div className="health-stat-header">
                <span>API Real-time</span>
                <span className="health-val">99.9%</span>
              </div>
              <div className="health-bar-container">
                <motion.div className="health-bar" initial={{ width: 0 }} animate={{ width: '99%' }} transition={{ duration: 1.5, delay: 0.5 }}></motion.div>
              </div>
            </div>

            <div className="health-stat">
              <div className="health-stat-header">
                <span>Database Load</span>
                <span className="health-val">24%</span>
              </div>
              <div className="health-bar-container">
                <motion.div className="health-bar warning" initial={{ width: 0 }} animate={{ width: '24%' }} transition={{ duration: 1.5, delay: 0.7 }}></motion.div>
              </div>
            </div>

            <div className="health-stat">
              <div className="health-stat-header">
                <span>Storage Capacity</span>
                <span className="health-val">68%</span>
              </div>
              <div className="health-bar-container">
                <motion.div className="health-bar danger" initial={{ width: 0 }} animate={{ width: '68%' }} transition={{ duration: 1.5, delay: 0.9 }}></motion.div>
              </div>
            </div>

            <div className="db-sync-card">
              <CheckCircle size={20} color="var(--accent-emerald)" />
              <div className="sync-info">
                <h4>Database Synchronized</h4>
                <p>Last sync with Supabase: 2 mins ago</p>
              </div>
            </div>
          </div>

          <div className="quick-management-card">
            <h3>Management Tasks</h3>
            <ul className="mgmt-tasks">
              <li><HardDrive size={16} /> Data Refresh</li>
              <li><AlertCircle size={16} /> View Error Logs</li>
              <li><Users size={16} /> Bulk User Invite</li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default AdminDashboard;
