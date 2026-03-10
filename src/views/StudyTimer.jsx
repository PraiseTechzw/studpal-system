import React, { useState, useEffect } from 'react';
import PageHeader from '../components/PageHeader';
import { Play, Pause, RotateCcw, Coffee, Book, Brain } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './StudyTimer.css';

const StudyTimer = () => {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState('focus'); // focus, short-break, long-break

  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

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
    </div>
  );
};

export default StudyTimer;
