import React from 'react';
import PageHeader from '../components/PageHeader';
import { Plus, Search, FileEdit, Clock, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import './TextNotes.css';

const TextNotes = () => {
  const notes = [
    { title: "Organic Chemistry Intro", date: "2026-03-08", length: "1.2k words", category: "Science" },
    { title: "World History: Middle Ages", date: "2026-03-05", length: "800 words", category: "History" },
    { title: "Algorithm Efficiency (O-notation)", date: "2026-03-01", length: "2.5k words", category: "CS" },
  ];

  return (
    <div className="view-container">
      <PageHeader 
        title="Text Notes" 
        subtitle="Write and organize your handwritten or digital study notes."
        actions={
          <>
            <button className="action-btn-secondary"><Search size={18} /> Search</button>
            <button className="action-btn-primary"><Plus size={18} /> New Note</button>
          </>
        }
      />

      <div className="notes-grid">
        {notes.map((note, idx) => (
          <motion.div 
            key={idx} 
            className="note-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <div className="note-card-header">
              <div className="note-icon-wrapper">
                <FileEdit size={20} color="var(--accent-teal)" />
              </div>
              <span className="note-category">{note.category}</span>
            </div>
            <h3 className="note-title">{note.title}</h3>
            <div className="note-meta">
              <div className="meta-item"><Calendar size={14} /> {note.date}</div>
              <div className="meta-item"><Clock size={14} /> {note.length}</div>
            </div>
          </motion.div>
        ))}
        {/* Add more placeholder slots */}
        {[1, 2, 3].map((_, i) => (
          <div key={`empty-${i}`} className="note-card-placeholder">
            <Plus size={24} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default TextNotes;
