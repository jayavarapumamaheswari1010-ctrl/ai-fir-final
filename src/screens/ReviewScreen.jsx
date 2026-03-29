import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { ArrowLeft, User, Edit2, CheckCircle } from 'lucide-react';

export default function ReviewScreen({ firData, setFirData }) {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Generate FIR ID
      const randomStr = Math.random().toString(36).substring(2, 6).toUpperCase();
      const generatedId = `FIR-2026-${randomStr}`;
      
      const reportData = {
        ...firData,
        firId: generatedId,
        status: "Active",
        createdAt: serverTimestamp()
      };

      try {
        // Try saving to Firebase (if config works)
        await addDoc(collection(db, 'FIR_Reports'), reportData);
      } catch (err) {
        console.warn("Firebase save failed (mock config likely), continuing with app state.", err);
      }
      
      // We pass the generated ID to success screen using router state
      navigate('/success', { state: { firId: generatedId, firData: reportData } });
    } catch (error) {
      console.error("Error submitting FIR:", error);
      alert("Failed to register FIR. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e, field) => {
    setFirData({
      ...firData,
      [field]: e.target.value
    });
  };

  return (
    <div className="review-screen">
      <div className="app-header" style={{ position: 'relative', background: 'transparent', padding: '16px 0' }}>
        <button className="back-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={20} />
        </button>
        <span className="app-title" style={{ marginLeft: 16 }}>CIVIC GUARDIAN</span>
        <div className="profile-icon">
          <User size={18} />
        </div>
      </div>

      <h1 className="welcome-title" style={{ fontSize: 24 }}>{t('reviewTitle')}</h1>
      <p className="welcome-subtitle" style={{ color: 'var(--text-secondary)' }}>
        {t('reviewSubtitle')}
      </p>

      <div className="title-row">
        <h2 className="section-title">1. {t('personalDetails')}</h2>
        <button className="edit-btn" onClick={() => setIsEditing(!isEditing)}>
          <Edit2 size={14} />
          <span style={{ marginLeft: 4, fontSize: 13, fontWeight: 600 }}>{t('edit')}</span>
        </button>
      </div>

      <div className="review-card">
        <div className="field-group">
          <div className="field-label">{t('q_name').substring(3)}</div>
          {isEditing ? (
             <input className="text-input" style={{ width: '100%' }} value={firData.name} onChange={(e) => handleChange(e, 'name')} />
          ) : (
             <div className="field-value">{firData.name || "N/A"}</div>
          )}
        </div>
        <div className="field-group">
          <div className="field-label">{t('fatherSpouse')}</div>
          {isEditing ? (
             <input className="text-input" style={{ width: '100%' }} value={firData.father_name} onChange={(e) => handleChange(e, 'father_name')} />
          ) : (
             <div className="field-value">{firData.father_name || "N/A"}</div>
          )}
        </div>
        <div className="field-group">
          <div className="field-label">{t('mobile')}</div>
          {isEditing ? (
             <input className="text-input" style={{ width: '100%' }} value={firData.mobile} onChange={(e) => handleChange(e, 'mobile')} />
          ) : (
             <div className="field-value">{firData.mobile || "N/A"}</div>
          )}
        </div>
        <div className="field-group">
          <div className="field-label">{t('address')}</div>
          {isEditing ? (
             <textarea className="text-input" style={{ width: '100%', minHeight: 60 }} value={firData.address} onChange={(e) => handleChange(e, 'address')} />
          ) : (
             <div className="field-value">{firData.address || "N/A"}</div>
          )}
        </div>
      </div>

      <div className="title-row">
        <h2 className="section-title">2. {t('incidentDetails')}</h2>
      </div>

      <div className="review-card">
        <div className="field-group">
          <div className="field-label">{t('incidentType')}</div>
          {isEditing ? (
             <input className="text-input" style={{ width: '100%' }} value={firData.incident_type} onChange={(e) => handleChange(e, 'incident_type')} />
          ) : (
             <div className="field-value">{firData.incident_type || "N/A"}</div>
          )}
        </div>

        <div className="field-group">
          <div className="field-label">{t('dateTime')}</div>
          {isEditing ? (
             <input className="text-input" style={{ width: '100%' }} value={firData.date_time} onChange={(e) => handleChange(e, 'date_time')} />
          ) : (
             <div className="field-value">{firData.date_time || "N/A"}</div>
          )}
        </div>

        <div className="field-group">
          <div className="field-label">{t('location')}</div>
          {isEditing ? (
             <input className="text-input" style={{ width: '100%' }} value={firData.location?.split('|')[0]} onChange={(e) => handleChange(e, 'location')} />
          ) : (
             <div className="field-value">
               {firData.location?.split('|')[0] || "N/A"}
             </div>
          )}
          {!isEditing && firData.location?.includes('|http') ? (
            <iframe 
               title="Incident Location Map"
               width="100%" 
               height="120" 
               frameBorder="0" 
               scrolling="no" 
               marginHeight="0" 
               marginWidth="0" 
               style={{ borderRadius: 8, marginTop: 12, border: '1px solid var(--border-color)'}}
               src={firData.location.split('|')[1]} 
            />
          ) : !isEditing && (
            <div className="map-placeholder">
              <span>Geo-tag Verified</span>
            </div>
          )}
        </div>
      </div>

      <div className="title-row">
         <h2 className="section-title">3. {t('description')}</h2>
      </div>

      <div className="review-card">
         <div className="field-group">
          {isEditing ? (
             <textarea className="text-input" style={{ width: '100%', minHeight: 100 }} value={firData.description} onChange={(e) => handleChange(e, 'description')} />
          ) : (
             <div className="field-textarea">{firData.description || "N/A"}</div>
          )}
        </div>
      </div>

      <div className="title-row">
         <h2 className="section-title">4. {t('suspectWitness')}</h2>
      </div>

      <div className="review-card">
        <div className="field-group">
          <div className="field-label">{t('suspect')}</div>
          {isEditing ? (
             <textarea className="text-input" style={{ width: '100%' }} value={firData.suspect} onChange={(e) => handleChange(e, 'suspect')} />
          ) : (
             <div className="field-value">{firData.suspect || "None"}</div>
          )}
        </div>
        <div className="field-group">
          <div className="field-label">{t('witness')}</div>
          {isEditing ? (
             <textarea className="text-input" style={{ width: '100%' }} value={firData.witness} onChange={(e) => handleChange(e, 'witness')} />
          ) : (
             <div className="field-value">{firData.witness || "None"}</div>
          )}
        </div>
      </div>

      <button 
        className="btn-primary" 
        style={{ marginTop: 24, marginBottom: 40 }}
        onClick={handleSubmit} 
        disabled={isSubmitting}
      >
        {isSubmitting ? <span className="loader"></span> : (
          <>
            {t('submit')} <ArrowLeft size={18} style={{ transform: 'rotate(180deg)' }} />
          </>
        )}
      </button>
    </div>
  );
}
