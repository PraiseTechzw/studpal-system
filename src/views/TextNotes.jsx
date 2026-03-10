import React, { useState, useEffect } from 'react';
import PageHeader from '../components/PageHeader';
import { Plus, Search, FileEdit, Clock, Calendar, Loader2, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../utils/supabaseClient';
import { useAuth } from '../hooks/useAuth';
import './TextNotes.css';

const TextNotes = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    fetchNotes();
  }, [user]);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setNotes(data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteNote = async (id) => {
    try {
      const { error } = await supabase
        .from('notes')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setNotes(notes.filter(note => note.id !== id));
    } catch (err) {
      alert("Failed to delete note: " + err.message);
    }
  };

  return (
    <div className="view-container">
      <PageHeader 
        title="Text Notes" 
        subtitle="Write and organize your handwritten or digital study notes."
        actions={
          <>
            <button className="action-btn-secondary"><Search size={18} /> Search</button>
            <button className="action-btn-primary shadow-premium-btn"><Plus size={18} /> New Note</button>
          </>
        }
      />

      {loading ? (
        <div className="flex-center-full">
          <Loader2 size={40} className="animate-spin" color="var(--accent-teal)" />
        </div>
      ) : (
        <div className="notes-grid">
          <AnimatePresence>
            {notes.map((note, idx) => (
              <motion.div 
                key={note.id} 
                className="note-card"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="note-card-header">
                  <div className="note-icon-wrapper">
                    <FileEdit size={16} color="var(--accent-teal)" />
                  </div>
                  <span className="note-category">{note.category}</span>
                  <button className="delete-note-btn" onClick={() => deleteNote(note.id)}>
                    <Trash2 size={16} />
                  </button>
                </div>
                <h3 className="note-title">{note.title}</h3>
                <div className="note-meta">
                  <div className="meta-item">
                    <Calendar size={12} /> 
                    {new Date(note.created_at).toLocaleDateString()}
                  </div>
                  <div className="meta-item">
                    <Clock size={12} /> 
                    {note.word_count || 0} words
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          <button className="note-card-placeholder">
            <Plus size={32} />
            <span>Create New Note</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default TextNotes;
