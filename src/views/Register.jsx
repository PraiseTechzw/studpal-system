import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Mail, Lock, Eye, EyeOff, User as UserIcon, ArrowRight, CheckCircle2, AlertCircle, Loader2, Shield, BookOpen, Brain, Users } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';
import './Auth.css';

const PERKS = [
  { icon: <Brain size={20} />, title: "AI Study Assistant", desc: "Smart summaries & instant Q&A." },
  { icon: <Users size={20} />, title: "Live Study Groups", desc: "Real-time chat with classmates." },
  { icon: <BookOpen size={20} />, title: "Resource Library", desc: "All your notes & docs organized." },
  { icon: <Shield size={20} />, title: "100% Secure", desc: "Your data stays private." },
];

const Register = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();

  // Password strength indicator
  const strength = password.length === 0 ? 0 : password.length < 6 ? 1 : password.length < 10 ? 2 : 3;
  const strengthLabel = ['', 'Weak', 'Good', 'Strong'];
  const strengthColor = ['', '#ef4444', '#f59e0b', '#10b981'];

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);

    const { error } = await signUp({
      email,
      password,
      options: { data: { full_name: fullName } }
    });

    if (error) {
      setError(error.message);
      toast.error(error.message);
      setLoading(false);
    } else {
      setSuccess(true);
      toast.success('Account created! Please check your email. 📬');
      setLoading(false);
    }
  };

  return (
    <div className="auth-page auth-page-register">
      {/* Left Panel – Form */}
      <div className="auth-form-panel">
        <motion.div
          className="auth-form-inner"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="auth-form-header">
            <div className="auth-mini-logo">
              <Sparkles size={18} fill="var(--accent-teal)" color="var(--accent-teal)" />
              <span>StudPal</span>
            </div>
            <h1>Create your account</h1>
            <p>Join over 10,000 students achieving more today.</p>
          </div>

          {success ? (
            <motion.div
              className="auth-success-card"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <div className="success-icon-ring">
                <CheckCircle2 size={40} color="#10b981" />
              </div>
              <h3>Check your inbox!</h3>
              <p>We've sent a confirmation link to <strong>{email}</strong>. Click the link to activate your account.</p>
              <Link to="/login" className="auth-submit-btn" style={{ textDecoration: 'none', justifyContent: 'center' }}>
                Back to Sign In
              </Link>
            </motion.div>
          ) : (
            <>
              {error && (
                <motion.div className="auth-error-banner" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <AlertCircle size={16} />
                  <span>{error}</span>
                </motion.div>
              )}

              <form className="auth-form" onSubmit={handleRegister}>
                <div className="auth-input-group">
                  <label>Full Name</label>
                  <div className="auth-input-wrapper">
                    <UserIcon size={17} className="input-icon" />
                    <input type="text" placeholder="Praise Johnson" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
                  </div>
                </div>

                <div className="auth-input-group">
                  <label>University Email</label>
                  <div className="auth-input-wrapper">
                    <Mail size={17} className="input-icon" />
                    <input type="email" placeholder="praise@university.edu" value={email} onChange={(e) => setEmail(e.target.value)} required />
                  </div>
                </div>

                <div className="auth-input-group">
                  <label>Create Password</label>
                  <div className="auth-input-wrapper">
                    <Lock size={17} className="input-icon" />
                    <input type={showPassword ? 'text' : 'password'} placeholder="Min. 8 characters" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    <button type="button" className="toggle-pw-btn" onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {password && (
                    <div className="pw-strength-bar">
                      <div className="pw-strength-track">
                        <div className="pw-strength-fill" style={{ width: `${(strength / 3) * 100}%`, backgroundColor: strengthColor[strength] }} />
                      </div>
                      <span style={{ color: strengthColor[strength] }}>{strengthLabel[strength]}</span>
                    </div>
                  )}
                </div>

                <div className="auth-input-group">
                  <label>Confirm Password</label>
                  <div className={`auth-input-wrapper ${confirmPassword && confirmPassword !== password ? 'error-ring' : ''}`}>
                    <CheckCircle2 size={17} className="input-icon" />
                    <input type={showConfirm ? 'text' : 'password'} placeholder="Repeat your password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                    <button type="button" className="toggle-pw-btn" onClick={() => setShowConfirm(!showConfirm)}>
                      {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <button className="auth-submit-btn" disabled={loading} type="submit">
                  {loading ? <><Loader2 size={18} className="animate-spin" /> Creating Account...</> : <>Get Started Free <ArrowRight size={18} /></>}
                </button>
              </form>

              <p className="auth-terms">
                By signing up, you agree to our <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
              </p>

              <p className="auth-footer">
                Already have an account? <Link to="/login">Sign in →</Link>
              </p>
            </>
          )}
        </motion.div>
      </div>

      {/* Right Panel – Branding */}
      <div className="auth-brand-panel auth-brand-panel-right">
        <motion.div
          className="auth-brand-content"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="auth-brand-logo">
            <Sparkles size={28} fill="white" color="white" />
            <span>StudPal</span>
          </div>
          <h2>Everything you need<br />to excel academically</h2>
          <p>One platform for all your study needs, powered by the latest AI.</p>

          <div className="auth-features-list">
            {PERKS.map((f, i) => (
              <motion.div
                key={i}
                className="auth-feature-item"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
              >
                <div className="auth-feature-icon">{f.icon}</div>
                <div>
                  <strong>{f.title}</strong>
                  <span>{f.desc}</span>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="auth-brand-testimonial">
            <p>"StudPal helped me improve my GPA from 2.8 to 3.9 in one semester!"</p>
            <div className="testimonial-author">
              <div className="testimonial-avatar">TM</div>
              <div>
                <strong>Tafara Mutemu</strong>
                <span>Computer Science, Year 3</span>
              </div>
            </div>
          </div>
        </motion.div>
        <div className="brand-blob blob-1" />
        <div className="brand-blob blob-2" />
      </div>
    </div>
  );
};

export default Register;
