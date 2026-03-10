import React from 'react';
import PageHeader from '../components/PageHeader';
import { Upload, File, FileText, Download, MoreVertical, Search, Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import './PDFDocuments.css';

const PDFDocuments = () => {
  const documents = [
    { name: "Biology_Chapter_4.pdf", size: "2.4 MB", date: "Mar 10, 2026", type: "PDF" },
    { name: "Math_Homework_Set_2.pdf", size: "1.1 MB", date: "Mar 09, 2026", type: "PDF" },
    { name: "Chemistry_Lab_Report.pdf", size: "4.8 MB", date: "Mar 07, 2026", type: "PDF" },
    { name: "Introduction_to_Psychology.pdf", size: "12.2 MB", date: "Mar 05, 2026", type: "PDF" },
  ];

  return (
    <div className="view-container">
      <PageHeader 
        title="PDF Documents" 
        subtitle="Manage and view your PDF study materials and e-books."
        actions={
          <button className="action-btn-primary"><Upload size={18} /> Upload PDF</button>
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
            <span></span>
          </div>
          {documents.map((doc, idx) => (
            <motion.div 
              key={idx} 
              className="doc-row"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <div className="doc-name-cell">
                <div className="doc-icon-small">
                  <FileText size={18} color="var(--accent-red)" />
                </div>
                <span>{doc.name}</span>
              </div>
              <div className="doc-date-cell">{doc.date}</div>
              <div className="doc-size-cell">{doc.size}</div>
              <div className="doc-action-cell">
                <button className="icon-btn"><Download size={16} /></button>
                <button className="icon-btn"><MoreVertical size={16} /></button>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="doc-list-empty-invite">
          <div className="plus-icon-ring"><Plus size={20} /></div>
          <span>Drag more PDF files here to upload instantly.</span>
        </div>
      </div>
    </div>
  );
};

export default PDFDocuments;
