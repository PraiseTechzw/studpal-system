import React from 'react';
import PageHeader from '../components/PageHeader';
import { Store, Tag, Search, Download, Star, Filter, MessageSquare, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import './ResourceExchange.css';

const ResourceExchange = () => {
  const trending = [
    { title: "Med Physics Summaries", author: "Dr. Mike", price: "$4.99", rating: 4.8, downloads: 1.2, icon: "🩺" },
    { title: "CS Algorithm Cheat Sheet", author: "CoderX", price: "Free", rating: 4.9, downloads: 8.5, icon: "💻" },
    { title: "Organic Chem Lab Guide", author: "ChemistryGuru", price: "$9.99", rating: 4.7, downloads: 0.8, icon: "🧪" },
    { title: "World History Timeline", author: "HistoryBuff", price: "Free", rating: 4.6, downloads: 2.1, icon: "🌍" },
  ];

  return (
    <div className="view-container">
      <PageHeader 
        title="Resource Exchange" 
        subtitle="Buy, sell, or share high-quality study materials with the StudPal community."
        actions={
          <button className="action-btn-primary"><Tag size={18} /> Sell Resource</button>
        }
      />

      <div className="exchange-main">
        <div className="exchange-left-grid">
          <div className="exchange-search-hero">
            <Search size={22} className="search-hero-icon" />
            <input type="text" placeholder="Find study guides, summaries, or flashcards..." />
            <button className="search-trigger">Search Hub</button>
          </div>

          <div className="trending-section">
            <div className="section-header">
              <TrendingUp size={20} color="var(--accent-teal)" />
              <h2>Trending Resources</h2>
            </div>
            <div className="trending-grid">
              {trending.map((item, idx) => (
                <motion.div 
                  key={idx} 
                  className="exchange-card"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.02 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <div className="exchange-card-header">
                    <span className="card-emoji">{item.icon}</span>
                    <span className="card-price">{item.price}</span>
                  </div>
                  <h3>{item.title}</h3>
                  <p className="card-author">by {item.author}</p>
                  <div className="card-meta">
                    <div className="meta-unit"><Star size={14} fill="#f59e0b" color="#f59e0b" /> {item.rating}</div>
                    <div className="meta-unit"><Download size={14} /> {item.downloads}k</div>
                  </div>
                  <button className="card-view-btn">View Details</button>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        <aside className="exchange-sidebar">
          <div className="categories-list-card">
            <h3>Featured Hubs</h3>
            <div className="hub-item active"><Star size={16} /> All Materials</div>
            <div className="hub-item"><Star size={16} /> STEM Hub</div>
            <div className="hub-item"><Star size={16} /> Humanities</div>
            <div className="hub-item"><Star size={16} /> Language Arts</div>
          </div>

          <div className="community-cta-card">
            <div className="cta-header">
              <MessageSquare size={24} color="white" />
              <h3>StudPal Community</h3>
            </div>
            <p>Join over 10k students sharing their knowledge. Earn rewards for every download of your shared materials.</p>
            <button className="cta-secondary-btn">Join Discord Hub</button>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default ResourceExchange;
