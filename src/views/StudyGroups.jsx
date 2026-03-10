import React, { useState, useEffect } from 'react';
import PageHeader from '../components/PageHeader';
import { Plus, Users, Search, MessageSquare, Clock, ChevronRight, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabaseClient';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';
import { SkCardGrid } from '../components/Skeleton';
import './StudyGroups.css';

const StudyGroups = () => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newGroup, setNewGroup] = useState({ name: '', description: '', subject: '' });
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchGroups();
  }, [user]);

  const fetchGroups = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('study_groups')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setGroups(data || []);
    } catch (err) {
      console.error("Error fetching groups:", err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from('study_groups')
        .insert({
          created_by: user.id,
          name: newGroup.name,
          description: newGroup.description,
          subject: newGroup.subject
        });

      if (error) throw error;
      setShowAddModal(false);
      setNewGroup({ name: '', description: '', subject: '' });
      fetchGroups();
      toast.success('Study group created! 🎓');
    } catch (err) {
      toast.error('Error creating group: ' + err.message);
    }
  };

  return (
    <div className="view-container">
      <PageHeader 
        title="Study Groups" 
        subtitle="Collaborate with peers, share resources, and join live study sessions."
        actions={
          <>
            <button className="action-btn-secondary"><Search size={18} /> Find Group</button>
            <button className="action-btn-primary shadow-premium-btn" onClick={() => setShowAddModal(true)}>
              <Plus size={18} /> Create Group
            </button>
          </>
        }
      />

      {loading ? (
        <div style={{ padding: '24px 0' }}>
          <SkCardGrid count={6} />
        </div>
      ) : (
        <div className="groups-grid">
          <AnimatePresence>
            {groups.map((group, idx) => (
              <motion.div 
                key={group.id} 
                className="group-card"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: idx * 0.1 }}
              >
                <div className="group-card-header">
                  <div className="group-avatar-stack">
                    <div className="group-icon-main">👥</div>
                    <div className="status-indicator-dot online"></div>
                  </div>
                  <div className="group-header-info">
                    <span className="group-category-pill">{group.subject || 'General'}</span>
                    <h3>{group.name}</h3>
                  </div>
                </div>

                <p className="group-card-description">{group.description || 'No description provided.'}</p>

                <div className="group-stats-row">
                  <div className="stat-unit">
                    <Users size={14} />
                    <span>{group.member_count} Members</span>
                  </div>
                  <div className="stat-unit">
                    <Clock size={14} />
                    <span>Active Now</span>
                  </div>
                </div>

                <div className="group-card-actions">
                  <button className="join-group-btn" onClick={() => navigate(`/study-groups/${group.id}`)}>
                    Enter Workspace <ChevronRight size={16} />
                  </button>
                  <button className="chat-group-btn" onClick={() => navigate(`/study-groups/${group.id}`)}>
                    <MessageSquare size={18} />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {groups.length === 0 && (
            <div className="empty-groups-state">
              <p>No study groups found. Be the first to create one!</p>
            </div>
          )}
        </div>
      )}
      
      <div className="create-group-invite-banner">
        <div className="invite-content">
          <h2>Start a new Study Hub</h2>
          <p>Create a space for your class or project team and manage everything in one place.</p>
          <button className="action-btn-primary" onClick={() => setShowAddModal(true)}>Get Started</button>
        </div>
        <div className="invite-emoji">🚀</div>
      </div>

      {showAddModal && (
        <div className="modal-overlay">
          <motion.div className="modal-card" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
            <h2>Create New Study Group</h2>
            <form onSubmit={handleCreateGroup}>
              <div className="input-group">
                <label>Group Name</label>
                <input type="text" placeholder="e.g. Advanced Physics Study" value={newGroup.name} onChange={(e) => setNewGroup({...newGroup, name: e.target.value})} required />
              </div>
              <div className="input-group">
                <label>Subject</label>
                <input type="text" placeholder="e.g. Science, CS, English" value={newGroup.subject} onChange={(e) => setNewGroup({...newGroup, subject: e.target.value})} />
              </div>
              <div className="input-group">
                <label>Description</label>
                <textarea placeholder="What is this group about?" value={newGroup.description} onChange={(e) => setNewGroup({...newGroup, description: e.target.value})}></textarea>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowAddModal(false)}>Cancel</button>
                <button type="submit" className="btn-save">Create Group</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default StudyGroups;
