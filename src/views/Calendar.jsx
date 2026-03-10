import React from 'react';
import PageHeader from '../components/PageHeader';
import { ChevronLeft, ChevronRight, Plus, Calendar as CalIcon, Search, Clock, MapPin, Sparkles, Filter } from 'lucide-react';
import { motion } from 'framer-motion';
import './Calendar.css';

const Calendar = () => {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const calendarDays = Array.from({ length: 31 }, (_, i) => i + 1);
  const events = [
    { day: 12, title: "Bio Exam", time: "10:00 AM", color: "#f43f5e", category: "Science" },
    { day: 15, title: "Study Group", time: "4:00 PM", color: "#10b981", category: "Shared" },
    { day: 20, title: "Project Due", time: "11:59 PM", color: "#3b82f6", category: "Urgent" },
    { day: 10, title: "Morning Review", time: "8:30 AM", color: "#14b8a6", category: "Personal" },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { 
        staggerChildren: 0.1,
        ease: [0.16, 1, 0.3, 1]
      } 
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 10 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <div className="view-container">
      <PageHeader 
        title="Calendar" 
        subtitle="Schedule your study sessions, exams, and deadlines."
        actions={
          <>
            <button className="action-btn-secondary"><Search size={18} /> Filter</button>
            <button className="action-btn-primary shadow-premium-btn"><Plus size={18} /> Create Event</button>
          </>
        }
      />

      <div className="calendar-main-layout">
        <motion.div 
          className="calendar-content-section"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants} className="calendar-glass-card">
            <div className="cal-premium-header">
              <div className="cal-title-group">
                <h3>March 2026</h3>
                <span className="cal-badge-pill">This Month</span>
              </div>
              <div className="cal-nav-controls">
                <button className="nav-ctrl-btn"><ChevronLeft size={20} /></button>
                <button className="nav-ctrl-btn active">Today</button>
                <button className="nav-ctrl-btn"><ChevronRight size={20} /></button>
              </div>
            </div>
            
            <div className="cal-premium-grid">
              {days.map(day => <div key={day} className="cal-header-label">{day}</div>)}
              {calendarDays.map(day => {
                const dayEvents = events.filter(e => e.day === day);
                const isToday = day === 10;
                
                return (
                  <motion.div 
                    key={day} 
                    className={`cal-premium-cell ${isToday ? 'current' : ''} ${dayEvents.length > 0 ? 'has-events' : ''}`}
                    whileHover={{ scale: 1.02, zIndex: 10 }}
                  >
                    <div className="cell-num-wrapper">
                      <span className="premium-day-num">{day}</span>
                    </div>
                    <div className="cell-events-stack">
                      {dayEvents.map((e, idx) => (
                        <div key={idx} className="premium-event-pill" style={{ '--event-color': e.color }}>
                          <div className="pill-dot"></div>
                          {!isToday && <span className="pill-title">{e.title}</span>}
                          {isToday && <span className="pill-title">Exam Review</span>} 
                        </div>
                      ))}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </motion.div>

        <aside className="calendar-sidebar-section">
          <motion.div 
            className="ai-insights-card"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="insight-header">
              <Sparkles size={18} color="var(--accent-teal)" />
              <h4>Study Schedule Insight</h4>
            </div>
            <p>Your Bio Exam is approaching. I've cleared 3 sessions on the 12th for deep-focus study.</p>
          </motion.div>

          <div className="upcoming-events-glass">
            <div className="upcoming-header">
              <h3>Upcoming</h3>
              <button className="view-all-link">View All</button>
            </div>
            <div className="premium-event-list">
              {events.slice(0, 3).map((e, idx) => (
                <motion.div 
                  key={idx} 
                  className="premium-event-card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + (idx * 0.1) }}
                >
                  <div className="event-date-block">
                    <span className="ev-month">MAR</span>
                    <span className="ev-day">{e.day}</span>
                  </div>
                  <div className="event-info-block">
                    <h5>{e.title}</h5>
                    <div className="ev-meta-row">
                      <Clock size={12} />
                      <span>{e.time}</span>
                      <span className="dot-separator">•</span>
                      <span>{e.category}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Calendar;
