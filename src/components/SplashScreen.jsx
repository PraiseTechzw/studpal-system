import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import './SplashScreen.css';

const TIPS = [
  'Organizing your study materials...',
  'Loading your AI assistant...',
  'Syncing your notes...',
  'Getting everything ready...',
];

const SplashScreen = ({ visible }) => {
  const [tipIndex, setTipIndex] = useState(0);

  useEffect(() => {
    if (!visible) return;
    const interval = setInterval(() => {
      setTipIndex(prev => (prev + 1) % TIPS.length);
    }, 900);
    return () => clearInterval(interval);
  }, [visible]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="splash-screen"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.04 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Background ambience */}
          <div className="splash-bg">
            <div className="splash-blob sb-1" />
            <div className="splash-blob sb-2" />
            <div className="splash-blob sb-3" />
          </div>

          <div className="splash-content">
            {/* Logo */}
            <motion.div
              className="splash-logo"
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="splash-logo-ring">
                <Sparkles size={36} fill="white" color="white" />
              </div>
              <motion.span
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                StudPal
              </motion.span>
            </motion.div>

            {/* Tagline */}
            <motion.p
              className="splash-tagline"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.5 }}
            >
              Your AI-powered study companion
            </motion.p>

            {/* Progress Bar */}
            <motion.div
              className="splash-progress-track"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <motion.div
                className="splash-progress-fill"
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: 1.8, ease: 'easeInOut' }}
              />
            </motion.div>

            {/* Rotating tips */}
            <motion.div
              className="splash-tip"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <AnimatePresence mode="wait">
                <motion.span
                  key={tipIndex}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.3 }}
                >
                  {TIPS[tipIndex]}
                </motion.span>
              </AnimatePresence>
            </motion.div>
          </div>

          {/* Version */}
          <motion.div
            className="splash-version"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            transition={{ delay: 0.8 }}
          >
            v1.0.0 — StudPal
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SplashScreen;
