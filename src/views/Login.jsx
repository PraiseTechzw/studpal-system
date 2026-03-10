import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Mail, Lock, ArrowRight, Github, Chrome } from 'lucide-react';
import { Link } from 'react-router-dom';
import './Auth.css';

const Login = () => {
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

          <form className="auth-form" onSubmit={(e) => e.preventDefault()}>
            <div className="auth-input-group">
              <label>Email Address</label>
              <div className="auth-input-wrapper">
                <Mail size={18} />
                <input type="email" placeholder="name@university.edu" />
              </div>
            </div>

            <div className="auth-input-group">
              <div className="label-row">
                <label>Password</label>
                <a href="#" className="forgot-pass">Forgot?</a>
              </div>
              <div className="auth-input-wrapper">
                <Lock size={18} />
                <input type="password" placeholder="••••••••" />
              </div>
            </div>

            <button className="auth-submit-btn">
              Sign In <ArrowRight size={18} />
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
