import React, { useState, useEffect } from 'react';
import PageHeader from '../components/PageHeader';
import { ExternalLink, Plus, Globe, Search, Trash2, Loader2, Link2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../utils/supabaseClient';
import { useAuth } from '../hooks/useAuth';
import './WebLinks.css';

const WebLinks = () => {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newLink, setNewLink] = useState({ title: '', url: '', description: '' });
  const { user } = useAuth();

  useEffect(() => {
    fetchLinks();
  }, [user]);

  const fetchLinks = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('links')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setLinks(data || []);
    } catch (err) {
      console.error("Error fetching links:", err.message);
    } finally {
      setLoading(false);
    }
  };

  const addLink = async (e) => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from('links')
        .insert({
          ...newLink,
          user_id: user.id
        });

      if (error) throw error;
      setShowAddModal(false);
      setNewLink({ title: '', url: '', description: '' });
      fetchLinks();
    } catch (err) {
      alert("Error adding link: " + err.message);
    }
  };

  const deleteLink = async (id) => {
    try {
      const { error } = await supabase
        .from('links')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setLinks(links.filter(link => link.id !== id));
    } catch (err) {
      alert("Error deleting link: " + err.message);
    }
  };

  return (
    <div className="view-container">
      <PageHeader 
        title="Scholar Web Links" 
        subtitle="Curated academic resources, research papers, and helpful study websites."
        actions={
          <button className="action-btn-primary shadow-premium-btn" onClick={() => setShowAddModal(true)}>
            <Plus size={18} /> Add Web Link
          </button>
        }
      />

      {loading ? (
        <div className="flex-center-p">
          <Loader2 size={32} className="animate-spin" color="var(--accent-teal)" />
        </div>
      ) : (
        <div className="links-grid">
          <AnimatePresence>
            {links.map((link, idx) => (
              <motion.div 
                key={link.id} 
                className="link-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: idx * 0.1 }}
              >
                <div className="link-card-header">
                  <div className="link-icon-wrapper">
                    <Globe size={20} color="var(--accent-teal)" />
                  </div>
                  <button className="delete-link-btn" onClick={() => deleteLink(link.id)}>
                    <Trash2 size={16} />
                  </button>
                </div>
                <div className="link-content">
                  <h3 className="link-title">{link.title}</h3>
                  <p className="link-description">{link.description || 'No description provided.'}</p>
                </div>
                <div className="link-card-footer">
                  <a href={link.url} target="_blank" rel="noopener noreferrer" className="visit-link-btn">
                    Visit Resource <ExternalLink size={14} />
                  </a>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          <button className="link-card-placeholder" onClick={() => setShowAddModal(true)}>
            <div className="plus-icon-ring"><Plus size={24} /></div>
            <span>Add New Bookmark</span>
          </button>
        </div>
      )}

      {showAddModal && (
        <div className="modal-overlay">
          <motion.div 
            className="modal-card"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <h2>Add New Resource</h2>
            <form onSubmit={addLink}>
              <div className="input-group">
                <label>Title</label>
                <input 
                  type="text" 
                  placeholder="e.g. Stanford Encyclopedia of Philosophy" 
                  value={newLink.title}
                  onChange={(e) => setNewLink({...newLink, title: e.target.value})}
                  required
                />
              </div>
              <div className="input-group">
                <label>URL</label>
                <input 
                  type="url" 
                  placeholder="https://..." 
                  value={newLink.url}
                  onChange={(e) => setNewLink({...newLink, url: e.target.value})}
                  required
                />
              </div>
              <div className="input-group">
                <label>Description</label>
                <textarea 
                  placeholder="What is this resource for?" 
                  value={newLink.description}
                  onChange={(e) => setNewLink({...newLink, description: e.target.value})}
                ></textarea>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowAddModal(false)}>Cancel</button>
                <button type="submit" className="btn-save">Add Link</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default WebLinks;
