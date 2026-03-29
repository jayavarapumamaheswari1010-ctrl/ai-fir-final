import React, { useEffect, useState } from 'react';

export default function SplashScreen({ onComplete }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Animate progress bar over 2.5 seconds
    const duration = 2500;
    const intervalTime = 50;
    const step = 100 / (duration / intervalTime);

    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + step;
      });
    }, intervalTime);

    // Call onComplete to dismiss splash after 2.8 seconds
    const timeout = setTimeout(() => {
      onComplete();
    }, 2800);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [onComplete]);

  return (
    <div style={{ backgroundColor: 'white', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px', fontFamily: 'Inter, sans-serif' }}>
      
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <h1 style={{ fontSize: 26, fontWeight: 900, color: '#1e3a8a', textAlign: 'center', margin: 0, letterSpacing: 0.5, lineHeight: 1.2 }}>
          Welcome to AI FIR
        </h1>
        <h2 style={{ fontSize: 15, fontWeight: 700, color: '#475569', textAlign: 'center', margin: '8px 0 0 0', letterSpacing: 1.5 }}>
          ANANTAPUR POLICE
        </h2>
      </div>

      <div style={{ width: '100%', maxWidth: 280, paddingBottom: 60, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: '#64748b', marginBottom: 16, letterSpacing: 2, textTransform: 'uppercase' }}>
          Initializing Secure Portal...
        </div>
        <div style={{ width: '100%', height: 4, backgroundColor: '#f1f5f9', borderRadius: 2, overflow: 'hidden' }}>
          <div style={{ width: `${progress}%`, height: '100%', backgroundColor: '#1e3a8a', borderRadius: 2, transition: 'width 0.1s linear' }}></div>
        </div>
      </div>

    </div>
  );
}
