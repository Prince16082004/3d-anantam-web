import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './AuthPage.css';

const AuthPage = () => {
  const [mode, setMode] = useState('login'); // 'login' or 'register'
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const endpoint = mode === 'login' ? '/api/auth/login' : '/api/auth/register';
    try {
      const res = await fetch(`http://localhost:5000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || 'Something went wrong');

      login(data.user, data.token);
      navigate(data.user.role === 'admin' ? '/admin' : '/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-bg-glow"></div>
      <div className="auth-card glass-panel">
        <div className="auth-logo text-gradient">ANANTAM 3D</div>
        <h2>{mode === 'login' ? 'Welcome Back' : 'Create Account'}</h2>
        <p className="auth-sub">{mode === 'login' ? 'Sign in to continue building.' : 'Join the robotics revolution.'}</p>

        <div className="auth-tabs">
          <button className={mode === 'login' ? 'active' : ''} onClick={() => { setMode('login'); setError(''); }}>Sign In</button>
          <button className={mode === 'register' ? 'active' : ''} onClick={() => { setMode('register'); setError(''); }}>Register</button>
        </div>

        <form onSubmit={handleSubmit}>
          {mode === 'register' && (
            <div className="auth-field">
              <User size={18} className="icon" />
              <input name="name" type="text" placeholder="Full Name" value={formData.name} onChange={handleChange} required />
            </div>
          )}
          <div className="auth-field">
            <Mail size={18} className="icon" />
            <input name="email" type="email" placeholder="Email Address" value={formData.email} onChange={handleChange} required />
          </div>
          <div className="auth-field">
            <Lock size={18} className="icon" />
            <input name="password" type={showPassword ? 'text' : 'password'} placeholder="Password" value={formData.password} onChange={handleChange} required minLength={6} />
            <button type="button" className="toggle-eye" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          {error && <div className="auth-error">{error}</div>}

          <button type="submit" className="btn-primary w-full shadow-glow" disabled={loading}>
            {loading ? 'Processing...' : mode === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AuthPage;
