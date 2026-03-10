import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../../utils/supabaseClient';
import { useAuth } from '../../hooks/useAuth';
import toast from 'react-hot-toast';
import { MessageSquare, Users, BookOpen, Clock, Settings, ArrowLeft, Loader2, Send, CheckCircle, UploadCloud, FileText, Video, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { SkPageContent } from '../../components/Skeleton';
import './GroupWorkspace.css';

const GroupWorkspace = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [group, setGroup] = useState(null);
  const [activeTab, setActiveTab] = useState('chat');
  const [loading, setLoading] = useState(true);

  // Chat State
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [sendingMsg, setSendingMsg] = useState(false);

  // Resources State
  const [resources, setResources] = useState([]);
  const [uploadingFile, setUploadingFile] = useState(false);

  // Sessions State
  const [sessions, setSessions] = useState([]);

  // Auto-scroll ref
  const messagesEndRef = useRef(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    fetchGroupDetails();
    fetchMessages();

    // Subscribe to new messages
    const channel = supabase
      .channel(`group_chat_${id}`)
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'group_messages', filter: `group_id=eq.${id}` },
        async (payload) => {
          // Fetch the profile of the sender to display their name
          const { data: profile } = await supabase.from('profiles').select('full_name, avatar_url').eq('id', payload.new.user_id).single();
          const enhancedMsg = { ...payload.new, profiles: profile };
          setMessages(prev => [...prev, enhancedMsg]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [id]);

  const fetchGroupDetails = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('study_groups')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      setGroup(data);
    } catch (err) {
      console.error("Error fetching group:", err.message);
      navigate('/study-groups'); // Go back if group not found
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('group_messages')
        .select('*, profiles(full_name, avatar_url)')
        .eq('group_id', id)
        .order('created_at', { ascending: true });
      
      if (error && error.code !== '42P01') throw error; // Ignore missing relation error temporarily
      setMessages(data || []);
    } catch (err) {
      console.error("Error fetching messages:", err.prompt);
    }
  };

  const fetchResources = async () => {
    try {
      const { data, error } = await supabase
        .from('group_resources')
        .select('*')
        .eq('group_id', id)
        .order('created_at', { ascending: false });
      
      if (error && error.code !== '42P01') throw error;
      setResources(data || []);
    } catch (err) {
      console.error("Error fetching resources:", err.message);
    }
  };

  const fetchSessions = async () => {
    try {
      const { data, error } = await supabase
        .from('study_sessions')
        .select('*')
        .eq('group_id', id)
        .order('start_time', { ascending: true });
      
      if (error && error.code !== '42P01') throw error;
      setSessions(data || []);
    } catch (err) {
      console.error("Error fetching sessions:", err.message);
    }
  };

  useEffect(() => {
    if (activeTab === 'resources') fetchResources();
    if (activeTab === 'sessions') fetchSessions();
  }, [activeTab]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      setSendingMsg(true);
      
      // Temporary Insert just generic message if table exists
      const { error } = await supabase
        .from('group_messages')
        .insert({
          group_id: id,
          user_id: user.id,
          content: newMessage
        });

      if (error) throw error;
      setNewMessage('');
    } catch (err) {
      console.error("Error sending message:", err.message);
      // Fallback local append if DB not fully setup yet
      setMessages(prev => [...prev, { id: Date.now(), user_id: user.id, content: newMessage, created_at: new Date().toISOString() }]);
      setNewMessage('');
    } finally {
      setSendingMsg(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploadingFile(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      // Upload to storage
      const { error: uploadError } = await supabase.storage
        .from('group_resources')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Create database record
      const { error: dbError } = await supabase
        .from('group_resources')
        .insert({
          group_id: id,
          uploader_id: user.id,
          title: file.name,
          resource_type: 'pdf',
          file_path: filePath
        });

      if (dbError) throw dbError;
      
      fetchResources(); // Refresh list
      toast.success('File uploaded to group! 📂');
    } catch (error) {
      console.error("Error uploading file:", error.message);
      toast.error('Error uploading file: ' + error.message);
    } finally {
      setUploadingFile(false);
    }
  };

  const handleDownload = async (filePath, title) => {
    try {
      const { data, error } = await supabase.storage.from('group_resources').download(filePath);
      if (error) throw error;
      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = title;
      a.click();
      URL.revokeObjectURL(url);
      toast.success('Download started!');
    } catch (err) {
      toast.error('Error downloading file: ' + err.message);
    }
  };

  if (loading) return <div className="view-container"><SkPageContent variant="cards" /></div>;
  if (!group) return null;

  return (
    <div className="view-container workspace-container">
      {/* Workspace Header */}
      <div className="workspace-header">
        <button className="icon-btn-p workspace-back-btn" onClick={() => navigate('/study-groups')}>
          <ArrowLeft size={20} />
        </button>
        <div className="workspace-title-area">
          <div className="workspace-icon">🚀</div>
          <div className="workspace-meta">
            <h1>{group.name}</h1>
            <span className="workspace-subject">{group.subject || 'General Studies'} • {group.member_count} Members</span>
          </div>
        </div>
      </div>

      <div className="workspace-main">
        {/* Workspace Sidebar */}
        <div className="workspace-sidebar">
          <nav className="workspace-nav">
            <button className={`ws-nav-item ${activeTab === 'chat' ? 'active' : ''}`} onClick={() => setActiveTab('chat')}>
              <MessageSquare size={18} /> Live Chat
            </button>
            <button className={`ws-nav-item ${activeTab === 'resources' ? 'active' : ''}`} onClick={() => setActiveTab('resources')}>
              <BookOpen size={18} /> Shared Resources
            </button>
            <button className={`ws-nav-item ${activeTab === 'sessions' ? 'active' : ''}`} onClick={() => setActiveTab('sessions')}>
              <Clock size={18} /> Study Sessions
            </button>
            <div className="ws-nav-divider"></div>
            <button className="ws-nav-item">
              <Users size={18} /> Members
            </button>
            <button className="ws-nav-item">
              <Settings size={18} /> Settings
            </button>
          </nav>

          <div className="ws-sidebar-stats">
            <h4>Group Activity</h4>
            <div className="ws-stat"><CheckCircle size={14} color="var(--accent-emerald)" /> 2 Members Online</div>
            <div className="ws-stat"><BookOpen size={14} color="var(--text-secondary)" /> 5 Resources</div>
          </div>
        </div>

        {/* Workspace Content Area */}
        <div className="workspace-content">
          {activeTab === 'chat' && (
            <div className="ws-chat-module">
              <div className="ws-chat-messages">
                {messages.length === 0 && (
                  <div className="ws-chat-empty">
                    <MessageSquare size={40} color="var(--text-tertiary)" />
                    <p>No messages yet. Start the conversation!</p>
                  </div>
                )}
                {messages.map((msg, i) => {
                  const isMe = msg.user_id === user.id;
                  return (
                    <div key={msg.id || i} className={`chat-message-row ${isMe ? 'is-me' : ''}`}>
                      {!isMe && <div className="chat-avatar">{msg.profiles?.full_name?.charAt(0) || 'U'}</div>}
                      <div className="chat-message-bubble">
                        <div className="chat-message-content">{msg.content}</div>
                        <span className="chat-message-time">
                          {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>
              <form className="ws-chat-input-area" onSubmit={handleSendMessage}>
                <input 
                  type="text" 
                  placeholder="Message the group..." 
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  disabled={sendingMsg}
                />
                <button type="submit" disabled={sendingMsg || !newMessage.trim()} className="ws-send-btn">
                  {sendingMsg ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                </button>
              </form>
            </div>
          )}

          {activeTab === 'resources' && (
            <div className="ws-resources-module p-6" style={{ padding: '32px', overflowY: 'auto' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h2>Group Documents & Links</h2>
                <div>
                  <input type="file" id="group-file-upload" style={{ display: 'none' }} onChange={handleFileUpload} />
                  <label htmlFor="group-file-upload" className="action-btn-primary shadow-premium-btn" style={{ cursor: 'pointer', display: 'inline-flex', padding: '10px 16px', borderRadius: '12px' }}>
                    {uploadingFile ? <Loader2 size={18} className="animate-spin" /> : <UploadCloud size={18} />}
                    {uploadingFile ? 'Uploading...' : 'Upload File'}
                  </label>
                </div>
              </div>

              {resources.length === 0 ? (
                <div className="ws-placeholder-module">
                  <BookOpen size={48} color="var(--text-tertiary)" />
                  <h2>No Shared Resources</h2>
                  <p>Upload and share PDFs, notes, and links with your group.</p>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '20px' }}>
                  {resources.map((res) => (
                    <motion.div key={res.id} whileHover={{ y: -4 }} style={{ padding: '20px', backgroundColor: '#f8fafc', border: '1px solid var(--border-sidebar)', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <div style={{ padding: '12px', backgroundColor: 'var(--accent-teal-light)', color: 'var(--accent-teal)', borderRadius: '12px', width: 'fit-content' }}>
                        <FileText size={20} />
                      </div>
                      <h4 style={{ fontSize: '15px', fontWeight: '700', wordBreak: 'break-word', margin: 0 }}>{res.title}</h4>
                      <div style={{ marginTop: 'auto', display: 'flex', gap: '8px' }}>
                        <button onClick={() => handleDownload(res.file_path, res.title)} className="action-btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '8px', fontSize: '13px' }}>Download</button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'sessions' && (
            <div className="ws-resources-module p-6" style={{ padding: '32px', overflowY: 'auto' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h2>Upcoming Sessions</h2>
                <button className="action-btn-primary shadow-premium-btn"><Plus size={18} /> Schedule Session</button>
              </div>

              {sessions.length === 0 ? (
                <div className="ws-placeholder-module">
                  <Clock size={48} color="var(--text-tertiary)" />
                  <h2>No Upcoming Sessions</h2>
                  <p>Schedule and join live collaborative video calls.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {sessions.map((session) => (
                    <div key={session.id} style={{ padding: '24px', backgroundColor: '#f8fafc', border: '1px solid var(--border-sidebar)', borderRadius: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <h4 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '4px' }}>{session.title}</h4>
                        <p style={{ color: 'var(--text-tertiary)', fontSize: '14px', fontWeight: '500' }}>
                          {new Date(session.start_time).toLocaleString()}
                        </p>
                      </div>
                      <button className="action-btn-primary" onClick={() => window.open(session.meeting_link, '_blank')}>
                        <Video size={16} /> Join Call
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GroupWorkspace;
