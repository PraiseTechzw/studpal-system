import React, { useState, useEffect, useRef } from 'react';
import PageHeader from '../components/PageHeader';
import { Store, Tag, Search, Download, Star, Filter, MessageSquare, TrendingUp, Plus, Loader2, UploadCloud } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../utils/supabaseClient';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';
import { SkCardGrid } from '../components/Skeleton';
import './ResourceExchange.css';

const ResourceExchange = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newItem, setNewItem] = useState({ title: '', price: 'Free', description: '' });
  const [resourceFile, setResourceFile] = useState(null);
  const fileInputRef = useRef(null);
  const { user } = useAuth();

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('market_items')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setItems(data || []);
    } catch (err) {
      console.error("Error fetching market items:", err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateItem = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      let filePath = null;

      if (resourceFile) {
        const fileExt = resourceFile.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        filePath = `${user.id}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('market_resources')
          .upload(filePath, resourceFile);

        if (uploadError) throw uploadError;
      }

      const { error } = await supabase
        .from('market_items')
        .insert({
          seller_id: user.id,
          title: newItem.title,
          price: newItem.price,
          description: newItem.description,
          icon: "📚",
          file_path: filePath
        });

      if (error) throw error;
      setShowAddModal(false);
      setNewItem({ title: '', price: 'Free', description: '' });
      setResourceFile(null);
      fetchItems();
      toast.success('Resource listed successfully! 🛒');
    } catch (err) {
      toast.error('Error listing resource: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const downloadResource = async (item) => {
    if (!item.file_path) {
      toast('This resource has no downloadable file.', { icon: 'ℹ️' });
      return;
    }
    try {
      const { data, error } = await supabase.storage
        .from('market_resources')
        .download(item.file_path);

      if (error) throw error;

      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = item.title;
      a.click();
      
      // Update download count
      await supabase.from('market_items').update({ downloads: (item.downloads || 0) + 1 }).eq('id', item.id);
      toast.success('Download started! 📥');
    } catch (err) {
      toast.error('Error downloading resource: ' + err.message);
    }
  };

  return (
    <div className="view-container">
      <PageHeader 
        title="Resource Exchange" 
        subtitle="Buy, sell, or share high-quality study materials with the StudPal community."
        actions={
          <button className="action-btn-primary shadow-premium-btn" onClick={() => setShowAddModal(true)}>
            <Tag size={18} /> Sell Resource
          </button>
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
              <h2>Marketplace Resources</h2>
            </div>
            
            {loading ? (
              <div style={{ padding: '24px 0' }}><SkCardGrid count={6} /></div>
            ) : (
              <div className="trending-grid">
                <AnimatePresence>
                  {items.map((item, idx) => (
                    <motion.div 
                      key={item.id} 
                      className="exchange-card"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: idx * 0.1 }}
                    >
                      <div className="exchange-card-header">
                        <span className="card-emoji">{item.icon}</span>
                        <span className="card-price">{item.price}</span>
                      </div>
                      <h3>{item.title}</h3>
                      <p className="card-author">Community Resource</p>
                      <div className="card-meta">
                        <div className="meta-unit"><Star size={14} fill="#f59e0b" color="#f59e0b" /> {item.rating}</div>
                        <div className="meta-unit"><Download size={14} /> {item.downloads}</div>
                      </div>
                      <button className="card-view-btn" onClick={() => downloadResource(item)}>Download Now</button>
                    </motion.div>
                  ))}
                </AnimatePresence>
                {items.length === 0 && <p className="empty-state-text">No resources listed yet. Be the first to share one!</p>}
              </div>
            )}
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
            <p>Join students from across the globe sharing their knowledge.</p>
            <button className="cta-secondary-btn">Join Discord Hub</button>
          </div>
        </aside>
      </div>

      {showAddModal && (
        <div className="modal-overlay">
          <motion.div className="modal-card" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
            <h2>List New Resource</h2>
            <form onSubmit={handleCreateItem}>
              <div className="input-group">
                <label>Title</label>
                <input type="text" placeholder="e.g. Advanced Calculus Summary" value={newItem.title} onChange={(e) => setNewItem({...newItem, title: e.target.value})} required />
              </div>
              <div className="input-grid">
                <div className="input-group">
                  <label>Price</label>
                  <input type="text" placeholder="Free or $5" value={newItem.price} onChange={(e) => setNewItem({...newItem, price: e.target.value})} />
                </div>
              </div>
              <div className="input-group">
                <label>Resource File (PDF / Doc)</label>
                <div 
                  className={`file-upload-zone ${resourceFile ? 'has-file' : ''}`}
                  onClick={() => fileInputRef.current.click()}
                >
                  <UploadCloud size={24} />
                  <span>{resourceFile ? resourceFile.name : "Click to select study material"}</span>
                  <input type="file" ref={fileInputRef} style={{ display: 'none' }} onChange={(e) => setResourceFile(e.target.files[0])} />
                </div>
              </div>
              <div className="input-group">
                <label>Description</label>
                <textarea placeholder="Describe your material..." value={newItem.description} onChange={(e) => setNewItem({...newItem, description: e.target.value})}></textarea>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowAddModal(false)}>Cancel</button>
                <button type="submit" className="btn-save" disabled={loading}>
                  {loading ? <Loader2 size={18} className="animate-spin" /> : "List Material"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default ResourceExchange;
