import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Mail, Lock, User, ArrowRight, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import './Auth.css';

const Register = () => {
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
            <h1>Create your StudPal Account</h1>
            <p>Join over 10,000 students achieving more today.</p>
          </div>

          <form className="auth-form" onSubmit={(e) => e.preventDefault()}>
            <div className="auth-input-group">
              <label>Full Name</label>
              <div className="auth-input-wrapper">
                <User size={18} />
                <input type="text" placeholder="Praise Johnson" />
              </div>
            </div>

            <div className="auth-input-group">
              <label>University Email</label>
              <div className="auth-input-wrapper">
                <Mail size={18} />
                <input type="email" placeholder="praise@university.edu" />
              </div>
            </div>

            <div className="auth-input-group">
              <label>Create Password</label>
              <div className="auth-input-wrapper">
                <Lock size={18} />
                <input type="password" placeholder="••••••••" />
              </div>
            </div>

            <div className="auth-input-group">
              <div className="auth-input-wrapper">
                <CheckCircle size={18} />
                <input type="password" placeholder="Confirm Password" />
              </div>
            </div>

            <button className="auth-submit-btn">
              Get Started <ArrowRight size={18} />
            </button>
          </form>

          <p className="auth-terms">
            By creating an account, you agree to our <a href="#">Terms & Conditions</a>.
          </p>

          <p className="auth-footer">
            Already have an account? <Link to="/login">Sign in here</Link>
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

export default Register;
