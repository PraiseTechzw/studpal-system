import React, { useState, useEffect } from 'react';
import PageHeader from '../components/PageHeader';
import { Plus, Hash, Tag, Search, MoreVertical, Loader2, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../utils/supabaseClient';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';
import { SkCardGrid } from '../components/Skeleton';
import './Tags.css';

const Tags = () => {
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTag, setNewTag] = useState({ name: '', color: '#14b8a6' });
  const { user } = useAuth();

  useEffect(() => {
    fetchTags();
  }, [user]);

  const fetchTags = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('tags')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;
      setTags(data || []);
    } catch (err) {
      console.error("Error fetching tags:", err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTag = async (e) => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from('tags')
        .insert({
          user_id: user.id,
          name: newTag.name,
          color: newTag.color
        });

      if (error) throw error;
      setShowAddModal(false);
      setNewTag({ name: '', color: '#14b8a6' });
      fetchTags();
      toast.success('Tag created!');
    } catch (err) {
      toast.error('Error creating tag: ' + err.message);
    }
  };

  const deleteTag = async (id) => {
    try {
      const { error } = await supabase
        .from('tags')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setTags(tags.filter(t => t.id !== id));
      toast.success('Tag deleted.');
    } catch (err) {
      toast.error('Error deleting tag: ' + err.message);
    }
  };

  return (
    <div className="view-container">
      <PageHeader 
        title="Tags & Organization" 
        subtitle="Organize your resources across different subjects and topics using tags."
        actions={
          <button className="action-btn-primary shadow-premium-btn" onClick={() => setShowAddModal(true)}>
            <Plus size={18} /> Create Tag
          </button>
        }
      />

      <div className="tags-management-grid">
        <div className="tags-list-section">
          <div className="search-tags-bar">
            <Search size={18} />
            <input type="text" placeholder="Search tags..." />
          </div>

          {loading ? (
            <div style={{ padding: '24px 0' }}>
              <SkCardGrid count={9} />
            </div>
          ) : (
            <div className="tags-grid-display">
              <AnimatePresence>
                {tags.map((tag, idx) => (
                  <motion.div 
                    key={tag.id} 
                    className="tag-management-card"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <div className="tag-card-top">
                      <div className="tag-color-indicator" style={{ backgroundColor: tag.color }}></div>
                      <button className="tag-delete-btn" onClick={() => deleteTag(tag.id)}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <div className="tag-card-content">
                      <Hash size={18} className="tag-hash-icon" />
                      <h3>{tag.name}</h3>
                      <p>Used in resources</p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              
              <button className="add-tag-placeholder-card" onClick={() => setShowAddModal(true)}>
                <Plus size={24} />
                <span>Add New Tag</span>
              </button>
            </div>
          )}
        </div>

        <aside className="tags-sidebar">
          <div className="tag-stats-premium-card">
            <h3>Tag Insights</h3>
            <div className="insight-stat">
              <span className="insight-label">Unique Tags</span>
              <span className="insight-value">{tags.length}</span>
            </div>
            <div className="insight-stat">
              <span className="insight-label">System Default</span>
              <span className="insight-value">Active</span>
            </div>
          </div>
        </aside>
      </div>

      {showAddModal && (
        <div className="modal-overlay">
          <motion.div className="modal-card" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
            <h2>Create New Tag</h2>
            <form onSubmit={handleCreateTag}>
              <div className="input-group">
                <label>Tag Name</label>
                <input type="text" placeholder="e.g. Organic Chemistry" value={newTag.name} onChange={(e) => setNewTag({...newTag, name: e.target.value})} required />
              </div>
              <div className="input-group">
                <label>Tag Color</label>
                <div className="color-presets">
                  {['#14b8a6', '#ef4444', '#3b82f6', '#f59e0b', '#8b5cf6', '#10b981'].map(c => (
                    <div 
                      key={c} 
                      className={`color-preset ${newTag.color === c ? 'active' : ''}`}
                      style={{ backgroundColor: c }}
                      onClick={() => setNewTag({...newTag, color: c})}
                    ></div>
                  ))}
                </div>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowAddModal(false)}>Cancel</button>
                <button type="submit" className="btn-save">Create Tag</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Tags;
