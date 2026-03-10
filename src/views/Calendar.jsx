import React from 'react';
import PageHeader from '../components/PageHeader';
import { ChevronLeft, ChevronRight, Plus, Calendar as CalIcon, Search, Clock, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import './Calendar.css';

const Calendar = () => {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const calendarDays = Array.from({ length: 31 }, (_, i) => i + 1);
  const events = [
    { day: 12, title: "Bio Exam", time: "10:00 AM", color: "#f43f5e" },
    { day: 15, title: "Study Group", time: "4:00 PM", color: "#10b981" },
    { day: 20, title: "Project Due", time: "11:59 PM", color: "#3b82f6" },
  ];

  return (
    <div className="view-container">
      <PageHeader 
        title="Calendar" 
        subtitle="Schedule your study sessions, exams, and deadlines."
        actions={
          <>
            <button className="action-btn-secondary"><CalIcon size={18} /> Today</button>
            <button className="action-btn-primary"><Plus size={18} /> Add Event</button>
          </>
        }
      />

      <div className="calendar-main">
        <div className="calendar-left-pane">
          <div className="calendar-card">
            <div className="cal-card-header">
              <div className="cal-month-nav">
                <h3>March 2026</h3>
                <div className="nav-buttons">
                  <button><ChevronLeft size={18} /></button>
                  <button><ChevronRight size={18} /></button>
                </div>
              </div>
            </div>
            
            <div className="cal-grid">
              {days.map(day => <div key={day} className="cal-day-label">{day}</div>)}
              {calendarDays.map(day => (
                <div key={day} className={`cal-cell ${day === 10 ? 'today' : ''}`}>
                  <span className="day-num">{day}</span>
                  {events.filter(e => e.day === day).map((e, idx) => (
                    <div 
                      key={idx} 
                      className="event-dot" 
                      style={{ backgroundColor: e.color }}
                      title={e.title}
                    ></div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="calendar-right-pane">
          <div className="upcoming-events">
            <h3>Upcoming Events</h3>
            <div className="event-list">
              {events.map((e, idx) => (
                <motion.div 
                  key={idx} 
                  className="event-item"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <div className="event-time-bar" style={{ backgroundColor: e.color }}></div>
                  <div className="event-content">
                    <h4>{e.title}</h4>
                    <div className="event-meta">
                      <span><Clock size={12} /> {e.time}</span>
                      <span><MapPin size={12} /> Online</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar;
