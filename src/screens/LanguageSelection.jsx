import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { ShieldCheck } from 'lucide-react';
import BottomNav from '../components/BottomNav';

export default function LanguageSelection() {
  const { language, setLanguage, t } = useLanguage();
  const navigate = useNavigate();

  const handleProceed = () => {
    navigate('/chat');
  };

  return (
    <>
      <div className="lang-screen">
        <div style={{ flex: 1 }}>
          <div className="hero-icon">
          <ShieldCheck size={28} />
        </div>
        
        <h1 className="welcome-title">{t('welcomeTitle')}</h1>
        <p className="welcome-subtitle">{t('welcomeSubtitle')}</p>
        
        <div className="lang-options">
          <div 
            className={`lang-card ${language === 'en' ? 'selected' : ''}`}
            onClick={() => setLanguage('en')}
          >
            <h3>English</h3>
            <p>International Standard</p>
          </div>
          
          <div 
            className={`lang-card ${language === 'hi' ? 'selected' : ''}`}
            onClick={() => setLanguage('hi')}
          >
            <h3>हिन्दी</h3>
            <p>Hindi Language</p>
          </div>
          
          <div 
            className={`lang-card ${language === 'te' ? 'selected' : ''}`}
            onClick={() => setLanguage('te')}
          >
            <h3>తెలుగు</h3>
            <p>Telugu Language</p>
          </div>
        </div>
      </div>
      
      <div className="footer-action">
        <button className="btn-primary" onClick={handleProceed}>
          {t('proceed')}
        </button>
        <div className="secure-badge">
          <ShieldCheck size={14} /> {t('secure')}
        </div>
      </div>
      </div>
      <BottomNav />
    </>
  );
}
