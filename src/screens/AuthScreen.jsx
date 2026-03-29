import React, { useState } from 'react';
import { ShieldCheck, User, Lock, Mail, ArrowRight } from 'lucide-react';
import { auth } from '../firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from "firebase/auth";

export default function AuthScreen({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password || (!isLogin && !name)) {
      alert("Please fill in all details.");
      return;
    }

    setLoading(true);
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCredential.user, { displayName: name });
      }
      onLogin(); 
    } catch (error) {
      console.error("Auth error:", error);
      alert("Error: " + error.message.replace("Firebase: ", ""));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-screen">
      <div className="auth-header">
        <div className="auth-logo-box">
          <ShieldCheck size={48} color="white" strokeWidth={1.5} />
        </div>
        <h1 className="auth-title">AI FIR</h1>
        <p className="auth-subtitle">
          {isLogin ? 'Welcome back' : 'Create your account'}
        </p>
      </div>

      <div className="auth-form-container">
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-tabs">
            <button 
              type="button" 
              className={`auth-tab ${isLogin ? 'active' : ''}`}
              onClick={() => setIsLogin(true)}
            >
              Sign In
            </button>
            <button 
              type="button" 
              className={`auth-tab ${!isLogin ? 'active' : ''}`}
              onClick={() => setIsLogin(false)}
            >
              Register
            </button>
          </div>

          <div className="form-content">
            {!isLogin && (
              <div className="input-group">
                <label>Full Legal Name</label>
                <div className="input-wrapper">
                  <User className="input-icon" size={20} />
                  <input 
                    type="text" 
                    placeholder="e.g. Anjali Rao" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>
            )}

            <div className="input-group">
              <label>Email Address</label>
              <div className="input-wrapper">
                <Mail className="input-icon" size={20} />
                <input 
                  type="email" 
                  placeholder="name@example.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="input-group">
              <label>Password</label>
              <div className="input-wrapper">
                <Lock className="input-icon" size={20} />
                <input 
                  type="password" 
                  placeholder="••••••••" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button type="submit" className="btn-primary" style={{ marginTop: '24px' }} disabled={loading}>
              {loading ? <span className="loader"></span> : (
                <>
                  {isLogin ? 'Secure Sign In' : 'Register Account'}
                  <ArrowRight size={20} />
                </>
              )}
            </button>

            {isLogin && <div className="forgot-password">Forgot Password?</div>}
          </div>
        </form>
      </div>

      <div className="auth-footer">
        <ShieldCheck size={14} /> Official Government Portal Security
      </div>
    </div>
  );
}
