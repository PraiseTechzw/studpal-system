import React from 'react';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import Hero from './components/Hero';
import QuickActions from './components/QuickActions';
import Recommendations from './components/Recommendations';
import Filters from './components/Filters';
import { SidebarProvider } from './hooks/useSidebar';
import { motion, AnimatePresence } from 'framer-motion';
import './App.css';

function App() {
  return (
    <SidebarProvider>
      <div className="app-container">
        <Sidebar />
        <TopBar />
        
        <main className="main-content">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.8, 
              ease: [0.16, 1, 0.3, 1] 
            }}
          >
            <Hero />
          </motion.div>

          <div className="dashboard-grid">
            <div className="dashboard-left">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.8, 
                  delay: 0.1, 
                  ease: [0.16, 1, 0.3, 1] 
                }}
              >
                <QuickActions />
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <Filters />
              </motion.div>

              {/* Placeholder for list/table */}
              <motion.div
                className="placeholder-table"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ 
                  duration: 0.6, 
                  delay: 0.4, 
                  ease: [0.16, 1, 0.3, 1] 
                }}
              >
                <div className="empty-state">
                  <div className="empty-icon-ring">
                    <motion.div
                      animate={{ 
                        scale: [1, 1.1, 1],
                        rotate: [0, 5, -5, 0]
                      }}
                      transition={{ 
                        duration: 5, 
                        repeat: Infinity,
                        ease: "easeInOut" 
                      }}
                    >
                      🚀
                    </motion.div>
                  </div>
                  <p>No study materials matches found yet.</p>
                  <span className="add-text">Ready to organize your studies? Click 'Add Material'</span>
                </div>
              </motion.div>
            </div>

            <aside className="dashboard-right">
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ 
                  duration: 0.8, 
                  delay: 0.2, 
                  ease: [0.16, 1, 0.3, 1] 
                }}
              >
                <Recommendations />
              </motion.div>
            </aside>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}

export default App;
