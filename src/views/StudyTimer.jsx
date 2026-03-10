import React, { useState, useEffect } from 'react';
import PageHeader from '../components/PageHeader';
import { Play, Pause, RotateCcw, Coffee, Book, Brain, History, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../utils/supabaseClient';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';
import { SkList } from '../components/Skeleton';
import './StudyTimer.css';

const StudyTimer = () => {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState('focus'); // focus, short-break, long-break
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchSessions();
  }, [user]);

  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      setIsActive(false);
      saveSession();
      toast.success(
        mode === 'focus' ? '🎯 Focus session complete! Time for a break.' : '☕ Break over! Ready to focus?',
        { duration: 6000 }
      );
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('timer_sessions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      setSessions(data || []);
    } catch (err) {
      console.error("Error fetching sessions:", err.message);
    } finally {
      setLoading(false);
    }
  };

  const saveSession = async () => {
    try {
      const duration = mode === 'focus' ? 25 * 60 : 5 * 60;
      await supabase.from('timer_sessions').insert({
        user_id: user.id,
        duration: duration,
        mode: mode
      });
      fetchSessions();
    } catch (err) {
      console.error("Error saving session:", err.message);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleTimer = () => setIsActive(!isActive);
  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(mode === 'focus' ? 25 * 60 : 5 * 60);
  };

  return (
    <div className="view-container">
      <PageHeader 
        title="Study Timer" 
        subtitle="Boost your productivity using the Pomodoro technique."
      />

      <div className="timer-layout-premium">
        <div className="timer-display-card">
          <div className="timer-modes">
            <button 
              className={`mode-btn ${mode === 'focus' ? 'active' : ''}`}
              onClick={() => { setMode('focus'); setTimeLeft(25 * 60); setIsActive(false); }}
            >
              <Brain size={18} /> Focus
            </button>
            <button 
              className={`mode-btn ${mode === 'short-break' ? 'active' : ''}`}
              onClick={() => { setMode('short-break'); setTimeLeft(5 * 60); setIsActive(false); }}
            >
              <Coffee size={18} /> Short Break
            </button>
          </div>

          <div className="timer-circle-container">
            <svg className="timer-svg" viewBox="0 0 100 100">
              <circle className="timer-bg" cx="50" cy="50" r="45" />
              <motion.circle 
                className="timer-progress" 
                cx="50" cy="50" r="45" 
                initial={{ pathLength: 1 }}
                animate={{ pathLength: timeLeft / (mode === 'focus' ? 25*60 : 5*60) }}
                transition={{ duration: 1, ease: "linear" }}
              />
            </svg>
            <div className="timer-text">
              <h2>{formatTime(timeLeft)}</h2>
              <span>{mode === 'focus' ? 'STAY FOCUSED' : 'TAKE A BREAK'}</span>
            </div>
          </div>

          <div className="timer-controls">
            <button className="timer-control-btn reset" onClick={resetTimer}>
              <RotateCcw size={24} />
            </button>
            <button className={`timer-control-btn main ${isActive ? 'playing' : ''}`} onClick={toggleTimer}>
              {isActive ? <Pause size={32} fill="white" /> : <Play size={32} fill="white" style={{ marginLeft: '4px' }} />}
            </button>
            <div className="timer-control-btn spacer"></div>
          </div>
        </div>

        <aside className="timer-history-sidebar">
          <div className="history-card-glass">
            <div className="history-header">
              <History size={18} color="var(--accent-teal)" />
              <h3>Recent Sessions</h3>
            </div>
            {loading ? (
              <div style={{ marginTop: 16 }}><SkList count={3} /></div>
            ) : (
              <div className="session-list">
                {sessions.map(s => (
                  <div key={s.id} className="session-item">
                    <div className="session-mode-icon">
                      {s.mode === 'focus' ? <Brain size={14} /> : <Coffee size={14} />}
                    </div>
                    <div className="session-info">
                      <span className="session-mode-text">{s.mode.toUpperCase()}</span>
                      <span className="session-date">{new Date(s.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <span className="session-duration">{Math.floor(s.duration / 60)}m</span>
                  </div>
                ))}
                {sessions.length === 0 && <p className="empty-history">No sessions logged yet.</p>}
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
};

export default StudyTimer;
