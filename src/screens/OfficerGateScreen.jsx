import React, { useState } from 'react';
import { ShieldAlert, KeyRound, ArrowRight, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function OfficerGateScreen({ onVerified, onCancel, targetPath }) {
  const [badge, setBadge] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleAccess = (e) => {
    e.preventDefault();
    if (!badge || !password) return;
    
    setLoading(true);
    
    // Simulate network authentication delay for the demo
    setTimeout(() => {
      // Validate the specific requested demo credentials
      if (badge === '12345' && password === '12345') {
        setError(false);
        onVerified(targetPath);
      } else {
        setError(true);
        setLoading(false);
      }
    }, 1200);
  };

  return (
    <div style={{ backgroundColor: '#0f172a', minHeight: '100vh', display: 'flex', flexDirection: 'column', padding: '24px', fontFamily: 'Inter, sans-serif' }}>
      
      {/* Top Navigation */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: 20 }}>
         <button onClick={() => onCancel ? onCancel() : navigate('/')} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', padding: 10, borderRadius: '50%', color: 'white', cursor: 'pointer' }}>
           <X size={20} />
         </button>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginTop: '-40px' }}>
        
        {/* Animated Security Icon */}
        <div style={{ width: 80, height: 80, borderRadius: '50%', backgroundColor: 'rgba(59, 130, 246, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24, boxShadow: '0 0 0 10px rgba(59, 130, 246, 0.05)' }}>
          <ShieldAlert size={40} color="#3b82f6" strokeWidth={1.5} />
        </div>

        <h1 style={{ fontSize: 24, fontWeight: 800, color: 'white', letterSpacing: 0.5, marginBottom: 8, textAlign: 'center' }}>Restricted Access</h1>
        <p style={{ fontSize: 13, color: '#94a3b8', textAlign: 'center', marginBottom: 40, lineHeight: 1.5, maxWidth: 280 }}>
          Official Intelligence Data Vault. Please enter your credentials to proceed.
        </p>

        <form onSubmit={handleAccess} style={{ width: '100%', maxWidth: 340 }}>
          
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#64748b', letterSpacing: 1, marginBottom: 8 }}>SERVICE ID / BADGE NUMBER</label>
            <input 
              type="text" 
              placeholder="e.g. AP-449"
              value={badge}
              onChange={(e) => setBadge(e.target.value)}
              style={{ width: '100%', backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: 12, padding: '16px', fontSize: 15, color: 'white', outline: 'none' }}
            />
          </div>

          <div style={{ marginBottom: 32 }}>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#64748b', letterSpacing: 1, marginBottom: 8 }}>SECURE PIN</label>
            <div style={{ position: 'relative' }}>
              <KeyRound size={20} color="#64748b" style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)' }} />
              <input 
                type="password" 
                placeholder="••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ width: '100%', backgroundColor: '#1e293b', border: error ? '1px solid #ef4444' : '1px solid #334155', borderRadius: 12, padding: '16px 16px 16px 48px', fontSize: 16, color: 'white', letterSpacing: 4, outline: 'none' }}
              />
            </div>
            {error && <div style={{ color: '#ef4444', fontSize: 12, marginTop: 8, fontWeight: 600 }}>Invalid authentication credentials.</div>}
          </div>

          <button 
            type="submit" 
            disabled={loading}
            style={{ width: '100%', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: 12, padding: '18px', fontSize: 15, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, cursor: 'pointer', boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)' }}
          >
            {loading ? 'VERIFYING...' : (
              <>AUTHORIZE <ArrowRight size={18} /></>
            )}
          </button>
        </form>

      </div>
      
      {/* Footer text */}
      <div style={{ textAlign: 'center', paddingBottom: 20 }}>
         <div style={{ fontSize: 10, fontWeight: 700, color: '#475569', letterSpacing: 1 }}>STATE POLICE DEPARTMENT</div>
         <div style={{ fontSize: 9, color: '#334155', marginTop: 4 }}>Unauthorized access is strictly prohibited</div>
      </div>
    </div>
  );
}
