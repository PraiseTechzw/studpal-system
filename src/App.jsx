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
import AdminDashboard from './views/AdminDashboard';
import AIAssistant from './views/AIAssistant';
import SmartTools from './views/SmartTools';
import ResourceExchange from './views/ResourceExchange';
import StudyTimer from './views/StudyTimer';
import Settings from './views/Settings';
import Login from './views/Login';
import Register from './views/Register';
import { SidebarProvider } from './hooks/useSidebar';
import './App.css';

function App() {
  return (
    <Router>
      <SidebarProvider>
        <Routes>
          {/* Auth Routes - No Sidebar/TopBar */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected App Routes - With Shell */}
          <Route path="/*" element={
            <div className="app-container">
              <Sidebar />
              <div className="main-layout">
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
                    <Route path="/admin" element={<AdminDashboard />} />
                    <Route path="/study-timer" element={<StudyTimer />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="*" element={<Navigate to="/dashboard" replace />} />
                  </Routes>
                </main>
              </div>
            </div>
          } />
        </Routes>
      </SidebarProvider>
    </Router>
  );
}

export default App;
