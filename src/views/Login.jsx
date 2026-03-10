import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Mail, Lock, ArrowRight, Github, Chrome, AlertCircle, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import './Auth.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
      setLoading(false);
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <motion.div 
          className="auth-card"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="auth-header">
            <div className="auth-logo">
              <Sparkles size={32} fill="var(--accent-teal)" color="var(--accent-teal)" />
            </div>
            <h1>Welcome back to StudPal</h1>
            <p>Your AI-powered study companion is waiting.</p>
          </div>

          {error && (
            <motion.div 
              className="auth-error-banner"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <AlertCircle size={18} />
              <span>{error}</span>
            </motion.div>
          )}

          <form className="auth-form" onSubmit={handleLogin}>
            <div className="auth-input-group">
              <label>Email Address</label>
              <div className="auth-input-wrapper">
                <Mail size={18} />
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
                <a href="#" className="forgot-pass">Forgot?</a>
              </div>
              <div className="auth-input-wrapper">
                <Lock size={18} />
                <input 
                  type="password" 
                  placeholder="••••••••" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button className="auth-submit-btn" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" /> Signing in...
                </>
              ) : (
                <>
                  Sign In <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <div className="auth-divider">
            <span>or continue with</span>
          </div>

          <div className="social-auth-grid">
            <button className="social-btn"><Chrome size={20} /> Google</button>
            <button className="social-btn"><Github size={20} /> GitHub</button>
          </div>

          <p className="auth-footer">
            Don't have an account? <Link to="/register">Create one for free</Link>
          </p>
        </motion.div>
      </div>
      <div className="auth-bg-ornaments">
        <div className="orb orb-1"></div>
        <div className="orb orb-2"></div>
      </div>
    </div>
  );
};

export default Login;
