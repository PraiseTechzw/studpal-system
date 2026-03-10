import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Mail, Lock, Eye, EyeOff, ArrowRight, Github, Chrome, AlertCircle, Loader2, BookOpen, Users, Brain, Trophy } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';
import './Auth.css';

const FEATURES = [
  { icon: <Brain size={20} />, title: "AI Study Assistant", desc: "Get smart summaries and instant answers." },
  { icon: <Users size={20} />, title: "Study Groups", desc: "Collaborate with peers in real-time." },
  { icon: <BookOpen size={20} />, title: "Resource Hub", desc: "PDFs, notes & links in one place." },
  { icon: <Trophy size={20} />, title: "Track Progress", desc: "Focus timers and productivity stats." },
];

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error } = await signIn({ email, password });

    if (error) {
      setError(error.message);
      toast.error(error.message);
      setLoading(false);
    } else {
      toast.success('Welcome back! 🎉');
      navigate('/dashboard');
    }
  };

  return (
    <div className="auth-page">
      {/* Left Panel – Branding */}
      <div className="auth-brand-panel">
        <motion.div
          className="auth-brand-content"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="auth-brand-logo">
            <Sparkles size={28} fill="white" color="white" />
            <span>StudPal</span>
          </div>
          <h2>Your AI-powered<br />study companion</h2>
          <p>Join thousands of students who study smarter, not harder.</p>

          <div className="auth-features-list">
            {FEATURES.map((f, i) => (
              <motion.div
                key={i}
                className="auth-feature-item"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.1, duration: 0.6 }}
              >
                <div className="auth-feature-icon">{f.icon}</div>
                <div>
                  <strong>{f.title}</strong>
                  <span>{f.desc}</span>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="auth-brand-stats">
            <div className="auth-stat"><strong>10K+</strong><span>Students</span></div>
            <div className="auth-stat-divider" />
            <div className="auth-stat"><strong>98%</strong><span>Satisfaction</span></div>
            <div className="auth-stat-divider" />
            <div className="auth-stat"><strong>4.9★</strong><span>Rating</span></div>
          </div>
        </motion.div>
        {/* Background blobs */}
        <div className="brand-blob blob-1" />
        <div className="brand-blob blob-2" />
      </div>

      {/* Right Panel – Form */}
      <div className="auth-form-panel">
        <motion.div
          className="auth-form-inner"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
        >
          <div className="auth-form-header">
            <h1>Welcome back</h1>
            <p>Sign in to continue to your dashboard</p>
          </div>

          {error && (
            <motion.div
              className="auth-error-banner"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <AlertCircle size={16} />
              <span>{error}</span>
            </motion.div>
          )}

          <form className="auth-form" onSubmit={handleLogin}>
            <div className="auth-input-group">
              <label>Email Address</label>
              <div className="auth-input-wrapper">
                <Mail size={17} className="input-icon" />
                <input
                  type="email"
                  placeholder="name@university.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="auth-input-group">
              <div className="label-row">
                <label>Password</label>
                <a href="#" className="forgot-pass">Forgot password?</a>
              </div>
              <div className="auth-input-wrapper">
                <Lock size={17} className="input-icon" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button type="button" className="toggle-pw-btn" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button className="auth-submit-btn" disabled={loading} type="submit">
              {loading ? (
                <><Loader2 size={18} className="animate-spin" /> Signing in...</>
              ) : (
                <>Sign In <ArrowRight size={18} /></>
              )}
            </button>
          </form>

          <div className="auth-divider"><span>or continue with</span></div>

          <div className="social-auth-grid">
            <button className="social-btn"><Chrome size={19} /> Google</button>
            <button className="social-btn"><Github size={19} /> GitHub</button>
          </div>

          <p className="auth-footer">
            Don't have an account? <Link to="/register">Create one free →</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
