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
import GroupWorkspace from './views/GroupWorkspace';
import AdminDashboard from './views/AdminDashboard';
import NoteEditor from './views/NoteEditor';
import AIAssistant from './views/AIAssistant';
import SmartTools from './views/SmartTools';
import ResourceExchange from './views/ResourceExchange';
import StudyTimer from './views/StudyTimer';
import Settings from './views/Settings';
import Login from './views/Login';
import Register from './views/Register';
import { SidebarProvider } from './hooks/useSidebar';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { Toaster } from 'react-hot-toast';
import SplashScreen from './components/SplashScreen';
import './App.css';

/* Skeleton app-shell shown while a protected route's data is settling */
const AppShellSkeleton = () => (
  <div className="app-container">
    {/* Sidebar skeleton */}
    <div style={{ width: 260, background: 'white', borderRight: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: 12, padding: '24px 16px', flexShrink: 0 }}>
      <div style={{ height: 48, borderRadius: 14, background: 'linear-gradient(90deg,#e2e8f0 25%,#f1f5f9 50%,#e2e8f0 75%)', backgroundSize: '1200px 100%', animation: 'shimmer 1.6s infinite linear', marginBottom: 16 }} />
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} style={{ height: 40, borderRadius: 12, background: 'linear-gradient(90deg,#e2e8f0 25%,#f1f5f9 50%,#e2e8f0 75%)', backgroundSize: '1200px 100%', animation: 'shimmer 1.6s infinite linear', opacity: 1 - i * 0.08 }} />
      ))}
    </div>
    {/* Main area skeleton */}
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* TopBar skeleton */}
      <div style={{ height: 68, background: 'white', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', padding: '0 28px', gap: 16 }}>
        <div style={{ flex: 1, height: 38, maxWidth: 280, borderRadius: 12, background: 'linear-gradient(90deg,#e2e8f0 25%,#f1f5f9 50%,#e2e8f0 75%)', backgroundSize: '1200px 100%', animation: 'shimmer 1.6s infinite linear' }} />
        <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'linear-gradient(90deg,#e2e8f0 25%,#f1f5f9 50%,#e2e8f0 75%)', backgroundSize: '1200px 100%', animation: 'shimmer 1.6s infinite linear' }} />
        <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'linear-gradient(90deg,#e2e8f0 25%,#f1f5f9 50%,#e2e8f0 75%)', backgroundSize: '1200px 100%', animation: 'shimmer 1.6s infinite linear' }} />
        <div style={{ width: 110, height: 38, borderRadius: 20, background: 'linear-gradient(90deg,#e2e8f0 25%,#f1f5f9 50%,#e2e8f0 75%)', backgroundSize: '1200px 100%', animation: 'shimmer 1.6s infinite linear' }} />
      </div>
      {/* Content skeleton */}
      <div style={{ flex: 1, padding: '32px 28px', overflowY: 'auto', background: '#f8fafc', display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ width: 220, height: 28, borderRadius: 8, background: 'linear-gradient(90deg,#e2e8f0 25%,#f1f5f9 50%,#e2e8f0 75%)', backgroundSize: '1200px 100%', animation: 'shimmer 1.6s infinite linear' }} />
            <div style={{ width: 340, height: 14, borderRadius: 6, background: 'linear-gradient(90deg,#e2e8f0 25%,#f1f5f9 50%,#e2e8f0 75%)', backgroundSize: '1200px 100%', animation: 'shimmer 1.6s infinite linear' }} />
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            {[130, 110].map((w, i) => <div key={i} style={{ width: w, height: 44, borderRadius: 14, background: 'linear-gradient(90deg,#e2e8f0 25%,#f1f5f9 50%,#e2e8f0 75%)', backgroundSize: '1200px 100%', animation: 'shimmer 1.6s infinite linear' }} />)}
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16 }}>
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} style={{ height: 110, borderRadius: 20, background: 'linear-gradient(90deg,#e2e8f0 25%,#f1f5f9 50%,#e2e8f0 75%)', backgroundSize: '1200px 100%', animation: 'shimmer 1.6s infinite linear' }} />
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} style={{ height: 160, borderRadius: 20, background: 'linear-gradient(90deg,#e2e8f0 25%,#f1f5f9 50%,#e2e8f0 75%)', backgroundSize: '1200px 100%', animation: 'shimmer 1.6s infinite linear' }} />
          ))}
        </div>
      </div>
    </div>
  </div>
);

const ProtectedRoute = ({ children }) => {
  const { session, loading } = useAuth();
  if (loading) return <AppShellSkeleton />;
  if (!session) return <Navigate to="/login" replace />;
  return children;
};

function App() {
  const [splashDone, setSplashDone] = React.useState(false);

  // Keep splash for at least 1.8s for the progress bar
  React.useEffect(() => {
    const t = setTimeout(() => setSplashDone(true), 1900);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      <SplashScreen visible={!splashDone} />
      <Router>
      <AuthProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#0f172a',
              color: '#f8fafc',
              borderRadius: '14px',
              padding: '14px 20px',
              fontSize: '14px',
              fontWeight: '600',
              fontFamily: 'Inter, sans-serif',
              boxShadow: '0 20px 40px rgba(0,0,0,0.25), 0 0 0 1px rgba(255,255,255,0.05)',
              maxWidth: '420px',
            },
            success: {
              iconTheme: { primary: '#10b981', secondary: '#0f172a' },
              style: { borderLeft: '4px solid #10b981' },
            },
            error: {
              iconTheme: { primary: '#ef4444', secondary: '#0f172a' },
              style: { borderLeft: '4px solid #ef4444' },
            },
            loading: {
              iconTheme: { primary: '#14b8a6', secondary: '#0f172a' },
              style: { borderLeft: '4px solid #14b8a6' },
            },
          }}
        />
        <SidebarProvider>
          <Routes>
            {/* Auth Routes - No Sidebar/TopBar */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected App Routes - With Shell */}
            <Route path="/*" element={
              <ProtectedRoute>
                <div className="app-container">
                  <Sidebar />
                  <div className="main-layout">
                    <TopBar />
                    <main className="main-content">
                      <Routes>
                        <Route path="/" element={<Navigate to="/dashboard" replace />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/text-notes" element={<TextNotes />} />
                        <Route path="/notes/new" element={<NoteEditor />} />
                        <Route path="/notes/:id" element={<NoteEditor />} />
                        <Route path="/pdf-documents" element={<PDFDocuments />} />
                        <Route path="/web-links" element={<WebLinks />} />
                        <Route path="/calendar" element={<Calendar />} />
                        <Route path="/tags" element={<Tags />} />
                        <Route path="/study-groups" element={<StudyGroups />} />
                        <Route path="/study-groups/:id" element={<GroupWorkspace />} />
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
              </ProtectedRoute>
            } />
          </Routes>
        </SidebarProvider>
      </AuthProvider>
    </Router>
    </>
  );
}

export default App;
