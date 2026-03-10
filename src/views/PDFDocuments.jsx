import React, { useState, useEffect, useRef } from 'react';
import PageHeader from '../components/PageHeader';
import { Upload, FileText, Download, Trash2, Search, Plus, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../utils/supabaseClient';
import { useAuth } from '../hooks/useAuth';
import './PDFDocuments.css';

const PDFDocuments = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);
  const { user } = useAuth();

  useEffect(() => {
    fetchDocuments();
  }, [user]);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDocuments(data || []);
    } catch (err) {
      console.error("Error fetching documents:", err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (event) => {
    try {
      setUploading(true);
      const file = event.target.files[0];
      if (!file) return;

      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      // 1. Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // 2. Save metadata to DB
      const { error: dbError } = await supabase
        .from('documents')
        .insert({
          user_id: user.id,
          file_name: file.name,
          file_path: filePath,
          file_size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
          file_type: file.type,
          category: 'General'
        });

      if (dbError) throw dbError;

      fetchDocuments();
    } catch (err) {
      alert("Error uploading document: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  const deleteDocument = async (doc) => {
    try {
      // 1. Delete from Storage
      const { error: storageError } = await supabase.storage
        .from('documents')
        .remove([doc.file_path]);

      if (storageError) throw storageError;

      // 2. Delete from DB
      const { error: dbError } = await supabase
        .from('documents')
        .delete()
        .eq('id', doc.id);

      if (dbError) throw dbError;

      setDocuments(documents.filter(d => d.id !== doc.id));
    } catch (err) {
      alert("Error deleting document: " + err.message);
    }
  };

  const downloadFile = async (filePath, originalName) => {
    try {
      const { data, error } = await supabase.storage
        .from('documents')
        .download(filePath);

      if (error) throw error;

      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = originalName;
      a.click();
    } catch (err) {
      alert("Error downloading file: " + err.message);
    }
  };

  return (
    <div className="view-container">
      <input 
        type="file" 
        ref={fileInputRef} 
        style={{ display: 'none' }} 
        accept=".pdf"
        onChange={handleUpload}
      />
      <PageHeader 
        title="PDF Documents" 
        subtitle="Manage and view your PDF study materials and e-books."
        actions={
          <button 
            className="action-btn-primary shadow-premium-btn" 
            onClick={() => fileInputRef.current.click()}
            disabled={uploading}
          >
            {uploading ? <Loader2 size={18} className="animate-spin" /> : <Upload size={18} />}
            {uploading ? "Uploading..." : "Upload PDF"}
          </button>
        }
      />

      <div className="documents-list-card">
        <div className="doc-list-header">
          <div className="doc-search-mini">
            <Search size={16} />
            <input type="text" placeholder="Filter documents..." />
          </div>
        </div>

        <div className="doc-table">
          <div className="doc-table-header">
            <span>Name</span>
            <span>Date Added</span>
            <span>Size</span>
            <span>Actions</span>
          </div>
          
          {loading ? (
            <div className="flex-center-p">
              <Loader2 size={32} className="animate-spin" color="var(--accent-teal)" />
            </div>
          ) : (
            <AnimatePresence>
              {documents.map((doc, idx) => (
                <motion.div 
                  key={doc.id} 
                  className="doc-row"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <div className="doc-name-cell">
                    <div className="doc-icon-small">
                      <FileText size={18} color="var(--accent-red)" />
                    </div>
                    <span>{doc.file_name}</span>
                  </div>
                  <div className="doc-date-cell">{new Date(doc.created_at).toLocaleDateString()}</div>
                  <div className="doc-size-cell">{doc.file_size}</div>
                  <div className="doc-action-cell">
                    <button className="icon-btn-p" onClick={() => downloadFile(doc.file_path, doc.file_name)}>
                      <Download size={16} />
                    </button>
                    <button className="icon-btn-p delete" onClick={() => deleteDocument(doc)}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>

        {!loading && documents.length === 0 && (
          <div className="doc-list-empty-invite" onClick={() => fileInputRef.current.click()}>
            <div className="plus-icon-ring"><Plus size={20} /></div>
            <span>No documents found. Click here to upload your first study guide.</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default PDFDocuments;
