import React, { useState, useEffect, useRef } from 'react';
import PageHeader from '../components/PageHeader';
import { 
  User, Bell, Shield, Palette, Globe, 
  HelpCircle, LogOut, ChevronRight, Camera, 
  Mail, Phone, MapPin, Sparkles, Loader2, Save
} from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '../utils/supabaseClient';
import { useAuth } from '../hooks/useAuth';
import './Settings.css';

const Settings = () => {
  const { user, signOut } = useAuth();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState({
    full_name: '',
    university: '',
    bio: '',
    location: '',
    phone: '',
    avatar_url: ''
  });
  const [saving, setSaving] = useState(false);
  const avatarInputRef = useRef(null);

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error; // PGRST116 is 'no rows found'

      if (data) {
        setProfile(data);
      } else {
        // Fallback to auth metadata if profile doesn't exist yet
        setProfile({
          full_name: user?.user_metadata?.full_name || '',
          university: 'University Student',
          bio: '',
          location: 'San Francisco, CA',
          phone: '',
          avatar_url: ''
        });
      }
    } catch (err) {
      console.error("Error fetching profile:", err.message);
    } finally {
      setLoading(false);
    }
  };

  const saveProfile = async () => {
    try {
      setSaving(true);
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          ...profile,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;
      alert("Profile updated successfully!");
    } catch (err) {
      alert("Error saving profile: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarUpload = async (event) => {
    try {
      setSaving(true);
      const file = event.target.files[0];
      if (!file) return;

      const fileExt = file.name.split('.').pop();
      const filePath = `${user.id}/avatar.${fileExt}`;

      // Upload/Replace in Storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      setProfile(prev => ({ ...prev, avatar_url: publicUrl }));
      
      // Update DB immediately for avatar
      await supabase.from('profiles').update({ avatar_url: publicUrl }).eq('id', user.id);

    } catch (err) {
      alert("Error uploading avatar: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const sections = [
    { title: "Account Preferences", icon: <User size={20} />, items: ["Email & Security", "Data Management", "Global Language"] },
    { title: "Notifications", icon: <Bell size={20} />, items: ["Push Notifications", "Email Summaries", "AI Alerts"] },
    { title: "Privacy & Security", icon: <Shield size={20} />, items: ["Two-Factor Auth", "Connected Apps", "Privacy Policy"] },
    { title: "Appearance", icon: <Palette size={20} />, items: ["Theme Settings", "Font Size", "Dashboard Layout"] },
  ];

  if (loading) return <div className="view-container flex-center-p"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="view-container">
      <input 
        type="file" 
        ref={avatarInputRef} 
        style={{ display: 'none' }} 
        accept="image/*" 
        onChange={handleAvatarUpload} 
      />
      <PageHeader 
        title="Settings & Profile" 
        subtitle="Manage your personal information, security, and notification preferences."
        actions={
          <button className="action-btn-primary shadow-premium-btn" onClick={saveProfile} disabled={saving}>
            {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
            {saving ? "Saving..." : "Save Profile"}
          </button>
        }
      />

      <div className="settings-grid">
        <div className="settings-left-pane">
          <div className="profile-hero-card">
            <div className="profile-avatar-wrapper">
              {profile.avatar_url ? (
                <img src={profile.avatar_url} className="profile-avatar-img" alt="Avatar" />
              ) : (
                <div className="profile-avatar">{profile.full_name?.charAt(0) || 'P'}</div>
              )}
              <button className="avatar-edit-btn" onClick={() => avatarInputRef.current.click()}><Camera size={14} /></button>
            </div>
            <div className="profile-info">
              <input 
                className="profile-name-input"
                value={profile.full_name}
                onChange={(e) => setProfile({...profile, full_name: e.target.value})}
                placeholder="Your Name"
              />
              <input 
                className="profile-bio-input"
                value={profile.university}
                onChange={(e) => setProfile({...profile, university: e.target.value})}
                placeholder="University"
              />
              <div className="profile-badges">
                <span className="premium-badge"><Sparkles size={12} /> Pro Member</span>
              </div>
            </div>
          </div>

          <div className="profile-details-list">
            <div className="detail-item">
              <Mail size={18} />
              <div className="detail-content">
                <span className="detail-label">Email</span>
                <span className="detail-val">{user?.email}</span>
              </div>
            </div>
            <div className="detail-item">
              <Phone size={18} />
              <div className="detail-content">
                <span className="detail-label">Phone</span>
                <input 
                  className="detail-input"
                  value={profile.phone}
                  onChange={(e) => setProfile({...profile, phone: e.target.value})}
                  placeholder="Add phone number"
                />
              </div>
            </div>
            <div className="detail-item">
              <MapPin size={18} />
              <div className="detail-content">
                <span className="detail-label">Location</span>
                <input 
                  className="detail-input"
                  value={profile.location}
                  onChange={(e) => setProfile({...profile, location: e.target.value})}
                  placeholder="Add location"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="settings-right-pane">
          <div className="settings-sections">
            {sections.map((section, idx) => (
              <motion.div 
                key={idx} 
                className="setting-section-card"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <div className="section-title">
                  <div className="section-icon">{section.icon}</div>
                  <h3>{section.title}</h3>
                </div>
                <div className="setting-items">
                  {section.items.map((item, i) => (
                    <div key={i} className="setting-row">
                      <span>{item}</span>
                      <ChevronRight size={16} />
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}

            <button className="logout-btn" onClick={signOut}>
              <LogOut size={18} /> Sign Out of All Devices
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
