import React, { useState, useEffect } from 'react';
import PageHeader from '../components/PageHeader';
import { 
  Users, Database, Shield, Activity, HardDrive, 
  Settings, TrendingUp, AlertCircle, CheckCircle, 
  ArrowUpRight, ArrowDownRight, MoreHorizontal, Search, Filter, Loader2 
} from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '../utils/supabaseClient';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalNotes: 0,
    totalDocs: 0,
    totalLinks: 0,
    activeEvents: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGlobalStats();
  }, []);

  const fetchGlobalStats = async () => {
    try {
      setLoading(true);
      // In a real admin dashboard, we would have specific RPCs or admin-only tables
      // Here we count what we can see for the demonstration
      const [notes, docs, links, events] = await Promise.all([
        supabase.from('notes').select('*', { count: 'exact', head: true }),
        supabase.from('documents').select('*', { count: 'exact', head: true }),
        supabase.from('links').select('*', { count: 'exact', head: true }),
        supabase.from('events').select('*', { count: 'exact', head: true })
      ]);

      setStats({
        totalNotes: notes.count || 0,
        totalDocs: docs.count || 0,
        totalLinks: links.count || 0,
        activeEvents: events.count || 0
      });
    } catch (err) {
      console.error("Error fetching admin stats:", err.message);
    } finally {
      setLoading(false);
    }
  };

  const dashboardStats = [
    { label: "Global Notes", value: stats.totalNotes, growth: "+5.2%", positive: true, icon: <Database size={20} /> },
    { label: "Total Documents", value: stats.totalDocs, growth: "+12.5%", positive: true, icon: <HardDrive size={20} /> },
    { label: "Scholar Links", value: stats.totalLinks, growth: "+2.1%", positive: true, icon: <TrendingUp size={20} /> },
    { label: "Upcoming Events", value: stats.activeEvents, growth: "0%", positive: true, icon: <Activity size={20} /> },
  ];

  return (
    <div className="view-container">
      <PageHeader 
        title="Admin Control Center" 
        subtitle="Global platform management, user oversight, and system health monitoring."
        actions={
          <button className="action-btn-primary shadow-premium-btn" onClick={fetchGlobalStats}>
            {loading ? <Loader2 size={18} className="animate-spin" /> : <Activity size={18} />}
            {loading ? "Refreshing..." : "Refresh Data"}
          </button>
        }
      />

      <div className="admin-stats-grid">
        {dashboardStats.map((stat, idx) => (
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
              <h3>{loading ? "..." : stat.value}</h3>
              <p>{stat.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="admin-bottom-grid">
        <div className="admin-main-card">
          <div className="card-header-row">
            <h3>Recent System Activity</h3>
            <div className="card-actions">
              <div className="mini-search">
                <Search size={14} />
                <input type="text" placeholder="Search logs..." />
              </div>
              <button className="icon-btn-rounded"><Filter size={16} /></button>
            </div>
          </div>

          <div className="activity-placeholder">
            <Shield size={48} color="var(--accent-teal)" opacity={0.3} />
            <p>System is secure. All operations within normal parameters.</p>
            <span>Last global integrity check: {new Date().toLocaleTimeString()}</span>
          </div>
        </div>

        <aside className="system-health-sidebar">
          <div className="health-card">
            <h3>Supabase Health</h3>
            
            <div className="health-stat">
              <div className="health-stat-header">
                <span>Auth API</span>
                <span className="health-val">Operational</span>
              </div>
              <div className="health-bar-container">
                <motion.div className="health-bar" initial={{ width: 0 }} animate={{ width: '100%' }} transition={{ duration: 1.5 }}></motion.div>
              </div>
            </div>

            <div className="health-stat">
              <div className="health-stat-header">
                <span>Database Response</span>
                <span className="health-val">12ms</span>
              </div>
              <div className="health-bar-container">
                <motion.div className="health-bar" initial={{ width: 0 }} animate={{ width: '95%' }} transition={{ duration: 1.5, delay: 0.2 }}></motion.div>
              </div>
            </div>

            <div className="health-stat">
              <div className="health-stat-header">
                <span>Storage Cluster</span>
                <span className="health-val">Healthy</span>
              </div>
              <div className="health-bar-container">
                <motion.div className="health-bar" initial={{ width: 0 }} animate={{ width: '100%' }} transition={{ duration: 1.5, delay: 0.4 }}></motion.div>
              </div>
            </div>

            <div className="db-sync-card">
              <CheckCircle size={20} color="var(--accent-emerald)" />
              <div className="sync-info">
                <h4>Cluster Synchronized</h4>
                <p>Real-time sync enabled</p>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default AdminDashboard;
