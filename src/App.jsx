import React from 'react';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import Hero from './components/Hero';
import QuickActions from './components/QuickActions';
import Recommendations from './components/Recommendations';
import Filters from './components/Filters';
import { motion } from 'framer-motion';
import './App.css';

function App() {
  return (
    <div className="app-container">
      <Sidebar />
      <TopBar />
      
      <main className="main-content">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Hero />
        </motion.div>

        <div className="dashboard-grid">
          <div className="dashboard-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <QuickActions />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Filters />
            </motion.div>

            {/* Placeholder for list/table */}
            <motion.div
              className="placeholder-table"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <div className="empty-state">
                <p>No materials found matching your filters.</p>
                <span className="add-text">Time to organize your studies! 🚀</span>
              </div>
            </motion.div>
          </div>

          <aside className="dashboard-right">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Recommendations />
            </motion.div>
          </aside>
        </div>
      </main>
    </div>
  );
}

export default App;
