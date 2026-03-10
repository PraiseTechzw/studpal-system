import React, { useState, useEffect } from 'react';
import PageHeader from '../components/PageHeader';
import { Save, ArrowLeft, Trash2, Tag, Calendar, Loader2 } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../utils/supabaseClient';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';
import { SkPageContent } from '../components/Skeleton';
import './NoteEditor.css';

const NoteEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('General');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    if (id && id !== 'new') {
      fetchNote();
    }
  }, [id]);

  const fetchNote = async () => {
    try {
      setFetching(true);
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setTitle(data.title);
      setContent(data.content);
      setCategory(data.category);
    } catch (err) {
      toast.error('Error fetching note: ' + err.message);
      navigate('/text-notes');
    } finally {
      setFetching(false);
    }
  };

  const handleSave = async () => {
    if (!title.trim()) {
      toast.error('Please enter a title for your note.');
      return;
    }

    try {
      setLoading(true);
      const wordCount = content.split(/\s+/).filter(w => w.length > 0).length;
      
      const noteData = {
        user_id: user.id,
        title,
        content,
        category,
        word_count: wordCount
      };

      if (id && id !== 'new') {
        const { error } = await supabase
          .from('notes')
          .update(noteData)
          .eq('id', id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('notes')
          .insert(noteData);
        if (error) throw error;
      }

      navigate('/text-notes');
      toast.success('Note saved! ✍️');
    } catch (err) {
      toast.error('Error saving note: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="view-container">
        <SkPageContent variant="cards" cardCount={1} statCount={0} />
      </div>
    );
  }

  return (
    <div className="view-container">
      <PageHeader 
        title={id === 'new' ? "New Study Note" : "Edit Note"} 
        subtitle="Write down your thoughts, research, and reflections."
        actions={
          <>
            <button className="action-btn-secondary" onClick={() => navigate('/text-notes')}>
              <ArrowLeft size={18} /> Back
            </button>
            <button className="action-btn-primary shadow-premium-btn" onClick={handleSave} disabled={loading}>
              {loading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
              {loading ? "Saving..." : "Save Note"}
            </button>
          </>
        }
      />

      <div className="editor-layout">
        <div className="editor-main-card">
          <input 
            type="text" 
            className="note-title-input" 
            placeholder="Note Title" 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <div className="editor-toolbar">
            <span className="editor-word-count">{content.split(/\s+/).filter(w => w.length > 0).length} words</span>
          </div>
          <textarea 
            className="note-content-area"
            placeholder="Start writing..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          ></textarea>
        </div>

        <aside className="editor-sidebar">
          <div className="editor-settings-card">
            <h3>Note Settings</h3>
            <div className="editor-input-group">
              <label><Tag size={14} /> Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="General">General</option>
                <option value="Science">Science</option>
                <option value="History">History</option>
                <option value="CS">CS</option>
                <option value="Math">Math</option>
              </select>
            </div>
            <div className="editor-input-group">
              <label><Calendar size={14} /> Last Modified</label>
              <input type="text" disabled value={new Date().toLocaleDateString()} />
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default NoteEditor;
