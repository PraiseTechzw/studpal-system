import React from 'react';
import Hero from '../components/Hero';
import QuickActions from '../components/QuickActions';
import Recommendations from '../components/Recommendations';
import Filters from '../components/Filters';
import { motion } from 'framer-motion';

const Dashboard = () => {
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
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="dashboard-view"
    >
      <motion.div variants={itemVariants}>
        <Hero />
      </motion.div>

      <div className="dashboard-grid">
        <div className="dashboard-left">
          <motion.div variants={itemVariants}>
            <QuickActions />
          </motion.div>

          <motion.div variants={itemVariants}>
            <Filters />
          </motion.div>

          <motion.div variants={itemVariants} className="placeholder-table">
            <div className="empty-state">
              <div className="empty-icon-ring">🚀</div>
              <p>No study materials matches found yet.</p>
              <span className="add-text">Ready to organize your studies? Click 'Add Material'</span>
            </div>
          </motion.div>
        </div>

        <aside className="dashboard-right">
          <motion.div variants={itemVariants}>
            <Recommendations />
          </motion.div>
        </aside>
      </div>
    </motion.div>
  );
};

export default Dashboard;
