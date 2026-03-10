import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import Dashboard from './views/Dashboard';
import TextNotes from './views/TextNotes';
import PDFDocuments from './views/PDFDocuments';
import WebLinks from './views/WebLinks';
import Calendar from './views/Calendar';
import Tags from './views/Tags';
import StudyGroups from './views/StudyGroups';
import AIAssistant from './views/AIAssistant';
import SmartTools from './views/SmartTools';
import ResourceExchange from './views/ResourceExchange';
import StudyTimer from './views/StudyTimer';
import { SidebarProvider } from './hooks/useSidebar';
import './App.css';

// Placeholder for missing views
const PlaceholderView = ({ title }) => (
  <div className="view-container">
    <div className="empty-state" style={{ marginTop: '100px' }}>
      <div className="empty-icon-ring" style={{ width: '120px', height: '120px', fontSize: '48px' }}>🚧</div>
      <h2 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '12px' }}>{title}</h2>
      <p style={{ color: 'var(--text-secondary)', fontSize: '18px', fontWeight: 500 }}>
        This page is currently under construction.
      </p>
      <span className="add-text" style={{ marginTop: '20px' }}>Coming soon in the next update! 🚀</span>
    </div>
  </div>
);

function App() {
  return (
    <Router>
      <SidebarProvider>
        <div className="app-container">
          <Sidebar />
          <TopBar />
          
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/text-notes" element={<TextNotes />} />
              <Route path="/pdf-documents" element={<PDFDocuments />} />
              <Route path="/web-links" element={<WebLinks />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/tags" element={<Tags />} />
              <Route path="/study-groups" element={<StudyGroups />} />
              
              <Route path="/ai-assistant" element={<AIAssistant />} />
              <Route path="/smart-tools" element={<SmartTools />} />
              <Route path="/resource-exchange" element={<ResourceExchange />} />
              
              <Route path="/study-timer" element={<StudyTimer />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </main>
        </div>
      </SidebarProvider>
    </Router>
  );
}

export default App;
