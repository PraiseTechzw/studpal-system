import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Mail, Lock, User as UserIcon, ArrowRight, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import './Auth.css';

const Register = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    const { error } = await signUp({ 
      email, 
      password,
      options: {
        data: {
          full_name: fullName,
        }
      }
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      // Supabase sends a confirmation email by default
      setError("Check your email for a confirmation link!");
      setLoading(false);
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
            <h1>Create your StudPal Account</h1>
            <p>Join over 10,000 students achieving more today.</p>
          </div>

          {error && (
            <motion.div 
              className={`auth-error-banner ${error.includes('email') ? 'info' : ''}`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              {error.includes('email') ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
              <span>{error}</span>
            </motion.div>
          )}

          <form className="auth-form" onSubmit={handleRegister}>
            <div className="auth-input-group">
              <label>Full Name</label>
              <div className="auth-input-wrapper">
                <UserIcon size={18} />
                <input 
                  type="text" 
                  placeholder="Praise Johnson" 
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="auth-input-group">
              <label>University Email</label>
              <div className="auth-input-wrapper">
                <Mail size={18} />
                <input 
                  type="email" 
                  placeholder="praise@university.edu" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="auth-input-group">
              <label>Create Password</label>
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

            <div className="auth-input-group">
              <div className="auth-input-wrapper">
                <CheckCircle size={18} />
                <input 
                  type="password" 
                  placeholder="Confirm Password" 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button className="auth-submit-btn" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" /> Creating Account...
                </>
              ) : (
                <>
                  Get Started <ArrowRight size={18} />
                </>
              )}
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
