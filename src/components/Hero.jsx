import React, { useState, useEffect } from 'react';
import { Sparkles, Bell, Loader2 } from 'lucide-react';
import { supabase } from '../utils/supabaseClient';
import { useAuth } from '../hooks/useAuth';
import './Hero.css';

const Hero = () => {
  const { user } = useAuth();
  const [counts, setCounts] = useState({ notes: 0, docs: 0, links: 0, events: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchCounts();
    }
  }, [user]);

  const fetchCounts = async () => {
    try {
      setLoading(true);
      const [notes, docs, links, events] = await Promise.all([
        supabase.from('notes').select('*', { count: 'exact', head: true }),
        supabase.from('documents').select('*', { count: 'exact', head: true }),
        supabase.from('links').select('*', { count: 'exact', head: true }),
        supabase.from('events').select('*', { count: 'exact', head: true })
      ]);

      setCounts({
        notes: notes.count || 0,
        docs: docs.count || 0,
        links: links.count || 0,
        events: events.count || 0
      });
    } catch (err) {
      console.error("Error fetching hero stats:", err.message);
    } finally {
      setLoading(false);
    }
  };

  const userName = user?.user_metadata?.full_name?.split(' ')[0] || user?.email?.split('@')[0] || "Scholar";
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  const stats = [
    { label: "Study Notes", value: counts.notes },
    { label: "PDF Documents", value: counts.docs },
    { label: "Web Bookmarks", value: counts.links },
    { label: "Upcoming Events", value: counts.events }
  ];

  return (
    <div className="hero">
      <div className="hero-content">
        <div className="hero-header">
          <div className="hero-text">
            <h1>{greeting}, {userName}! 👋</h1>
            <p className="hero-subtitle">You have {counts.events} events to focus on today.</p>
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
              <span className="stat-value">{loading ? <Loader2 size={16} className="animate-spin" /> : stat.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Hero;
