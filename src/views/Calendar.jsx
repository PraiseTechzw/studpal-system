import React, { useState, useEffect } from 'react';
import PageHeader from '../components/PageHeader';
import { ChevronLeft, ChevronRight, Plus, Calendar as CalIcon, Search, Clock, Trash2, Sparkles, Loader2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../utils/supabaseClient';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';
import './Calendar.css';

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: '', type: 'Class', startTime: '', description: '' });
  const { user } = useAuth();

  const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const monthName = currentDate.toLocaleString('default', { month: 'long' });

  useEffect(() => {
    fetchEvents();
  }, [user, currentDate]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const startOfMonth = new Date(year, month, 1).toISOString();
      const endOfMonth = new Date(year, month + 1, 0).toISOString();

      const { data, error } = await supabase
        .from('events')
        .select('*')
        .gte('start_time', startOfMonth)
        .lte('start_time', endOfMonth);

      if (error) throw error;
      setEvents(data || []);
    } catch (err) {
      console.error("Error fetching events:", err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddEvent = async (e) => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from('events')
        .insert({
          user_id: user.id,
          title: newEvent.title,
          type: newEvent.type,
          start_time: new Date(`${year}-${month + 1}-${newEvent.startTime}`).toISOString(), // Simplified for demo
          description: newEvent.description
        });

      if (error) throw error;
      setShowAddModal(false);
      setNewEvent({ title: '', type: 'Class', startTime: '', description: '' });
      fetchEvents();
      toast.success('Event added to calendar! 📅');
    } catch (err) {
      toast.error('Error adding event: ' + err.message);
    }
  };

  const deleteEvent = async (id) => {
    try {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setEvents(events.filter(e => e.id !== id));
      toast.success('Event removed.');
    } catch (err) {
      toast.error('Error deleting event: ' + err.message);
    }
  };

  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const calendarDays = Array.from({ length: daysInMonth(year, month) }, (_, i) => i + 1);
  const paddingDays = Array.from({ length: firstDayOfMonth(year, month) }, (_, i) => null);

  const getEventColor = (type) => {
    switch (type) {
      case 'Exam': return '#f43f5e';
      case 'Study': return '#10b981';
      case 'Class': return '#3b82f6';
      case 'Deadline': return '#f59e0b';
      default: return '#14b8a6';
    }
  };

  return (
    <div className="view-container">
      <PageHeader 
        title="Calendar" 
        subtitle="Schedule your study sessions, exams, and deadlines."
        actions={
          <>
            <button className="action-btn-secondary"><Search size={18} /> Filter</button>
            <button className="action-btn-primary shadow-premium-btn" onClick={() => setShowAddModal(true)}>
              <Plus size={18} /> Create Event
            </button>
          </>
        }
      />

      <div className="calendar-main-layout">
        <div className="calendar-content-section">
          <div className="calendar-glass-card">
            <div className="cal-premium-header">
              <div className="cal-title-group">
                <h3>{monthName} {year}</h3>
                <span className="cal-badge-pill">This Month</span>
              </div>
              <div className="cal-nav-controls">
                <button className="nav-ctrl-btn" onClick={() => setCurrentDate(new Date(year, month - 1))}><ChevronLeft size={20} /></button>
                <button className="nav-ctrl-btn active" onClick={() => setCurrentDate(new Date())}>Today</button>
                <button className="nav-ctrl-btn" onClick={() => setCurrentDate(new Date(year, month + 1))}><ChevronRight size={20} /></button>
              </div>
            </div>
            
            <div className="cal-premium-grid">
              {days.map(day => <div key={day} className="cal-header-label">{day}</div>)}
              {paddingDays.map((_, i) => <div key={`pad-${i}`} className="cal-premium-cell disabled"></div>)}
              {calendarDays.map(day => {
                const dayEvents = events.filter(e => new Date(e.start_time).getDate() === day);
                const isToday = day === new Date().getDate() && month === new Date().getMonth() && year === new Date().getFullYear();
                
                return (
                  <div key={day} className={`cal-premium-cell ${isToday ? 'current' : ''} ${dayEvents.length > 0 ? 'has-events' : ''}`}>
                    <div className="cell-num-wrapper">
                      <span className="premium-day-num">{day}</span>
                    </div>
                    <div className="cell-events-stack">
                      {dayEvents.map((e, idx) => (
                        <div key={idx} className="premium-event-pill" style={{ '--event-color': getEventColor(e.type) }}>
                          <div className="pill-dot"></div>
                          <span className="pill-title">{e.title}</span>
                          <button className="delete-ev-tiny" onClick={() => deleteEvent(e.id)}><X size={10} /></button>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <aside className="calendar-sidebar-section">
          <div className="ai-insights-card">
            <div className="insight-header">
              <Sparkles size={18} color="var(--accent-teal)" />
              <h4>Study Schedule Insight</h4>
            </div>
            <p>You have {events.filter(e => e.type === 'Exam').length} exams coming up. I've optimized your schedule for maximum retention.</p>
          </div>

          <div className="upcoming-events-glass">
            <div className="upcoming-header">
              <h3>Upcoming</h3>
            </div>
            {loading ? (
              <div className="flex-center-p"><Loader2 className="animate-spin" /></div>
            ) : (
              <div className="premium-event-list">
                {events.slice(0, 4).map((e, idx) => (
                  <div key={idx} className="premium-event-card">
                    <div className="event-date-block">
                      <span className="ev-month">{monthName.slice(0, 3).toUpperCase()}</span>
                      <span className="ev-day">{new Date(e.start_time).getDate()}</span>
                    </div>
                    <div className="event-info-block">
                      <h5>{e.title}</h5>
                      <div className="ev-meta-row">
                        <Clock size={12} />
                        <span>{new Date(e.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        <span className="dot-separator">•</span>
                        <span>{e.type}</span>
                      </div>
                    </div>
                  </div>
                ))}
                {events.length === 0 && <p className="empty-ev-text">No events scheduled.</p>}
              </div>
            )}
          </div>
        </aside>
      </div>

      {showAddModal && (
        <div className="modal-overlay">
          <motion.div className="modal-card" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
            <h2>Create New Event</h2>
            <form onSubmit={handleAddEvent}>
              <div className="input-group">
                <label>Event Title</label>
                <input type="text" placeholder="e.g. Bio Exam Review" value={newEvent.title} onChange={(e) => setNewEvent({...newEvent, title: e.target.value})} required />
              </div>
              <div className="input-grid">
                <div className="input-group">
                  <label>Type</label>
                  <select value={newEvent.type} onChange={(e) => setNewEvent({...newEvent, type: e.target.value})}>
                    <option value="Class">Class</option>
                    <option value="Exam">Exam</option>
                    <option value="Study">Study Session</option>
                    <option value="Deadline">Deadline</option>
                  </select>
                </div>
                <div className="input-group">
                  <label>Day (March)</label>
                  <input type="number" min="1" max="31" value={newEvent.startTime} onChange={(e) => setNewEvent({...newEvent, startTime: e.target.value})} required />
                </div>
              </div>
              <div className="input-group">
                <label>Description</label>
                <textarea placeholder="Any additional notes..." value={newEvent.description} onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}></textarea>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowAddModal(false)}>Cancel</button>
                <button type="submit" className="btn-save">Create Event</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Calendar;
