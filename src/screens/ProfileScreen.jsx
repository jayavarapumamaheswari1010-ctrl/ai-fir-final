import React, { useState, useEffect } from 'react';
import BottomNav from '../components/BottomNav';
import { Settings, User, CheckCircle2, MapPin, Globe, Bell, Moon, AlertTriangle, ShieldCheck, FileKey, LogOut, ChevronRight, Check, Camera } from 'lucide-react';
import { auth, db } from '../firebase';
import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';
import { updateProfile } from 'firebase/auth';
import { useLanguage } from '../context/LanguageContext';

export default function ProfileScreen({ onLogout }) {
  const [darkMode, setDarkMode] = useState(document.documentElement.getAttribute('data-theme') === 'dark');
  const { language, setLanguage } = useLanguage();

  // Profile Data State
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [profileData, setProfileData] = useState({
    name: 'Loading...',
    mobile: 'Loading...',
    gender: 'Not Specified',
    photoUrl: null
  });

  const [editForm, setEditForm] = useState({
    name: '',
    mobile: '',
    gender: 'Not Specified',
    photoUrl: null
  });

  useEffect(() => {
    // Fetch live user profile data on load
    const fetchProfileData = async () => {
      if (!auth.currentUser) return;
      try {
        const userDocRef = doc(db, 'Users', auth.currentUser.uid);
        const userDoc = await getDoc(userDocRef);

        let data = {
          name: auth.currentUser.displayName || 'User',
          mobile: '',
          gender: 'Not Specified',
          photoUrl: null
        };

        if (userDoc.exists()) {
          data = { ...data, ...userDoc.data() };
        }

        setProfileData({
          name: data.name || '',
          mobile: data.mobile || '',
          gender: data.gender || 'Not Specified',
          photoUrl: data.photoUrl || null
        });

        setEditForm({
          name: data.name || '',
          mobile: data.mobile || '',
          gender: data.gender || 'Not Specified',
          photoUrl: data.photoUrl || null
        });

      } catch (err) {
        console.error("Failed to load profile", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditForm({ ...editForm, photoUrl: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDarkModeToggle = () => {
    const isDark = !darkMode;
    setDarkMode(isDark);
    if (isDark) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  };

  const handleSave = async () => {
    if (!auth.currentUser) return;
    setSaving(true);
    try {
      // 1. Update Firebase Auth Native Profile
      await updateProfile(auth.currentUser, { displayName: editForm.name });

      // 2. Update Firestore Database Document
      const userDocRef = doc(db, 'Users', auth.currentUser.uid);

      // Use setDoc with merge:true in case the doc doesn't fully exist yet for some old users
      await setDoc(userDocRef, {
        name: editForm.name,
        mobile: editForm.mobile,
        gender: editForm.gender,
        photoUrl: editForm.photoUrl
      }, { merge: true });

      // Update local state and close editor
      setProfileData({
        name: editForm.name,
        mobile: editForm.mobile,
        gender: editForm.gender,
        photoUrl: editForm.photoUrl
      });
      setIsEditing(false);
    } catch (err) {
      console.error("Failed to save profile", err);
      alert("Error saving profile: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div className="profile-screen">
        {/* App Header */}
        <div className="analytics-header">
          <div className="analytics-logo">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 22h14a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v4"></path>
              <path d="M14 2v4a2 2 0 0 0 2 2h4"></path>
              <path d="m3 15 2 2 4-4"></path>
            </svg>
            Civic Guardian
          </div>
          <div style={{ color: 'var(--text-secondary)' }}>
            <Settings size={22} />
          </div>
        </div>

        <div className="profile-content">

          {/* Profile Info Card */}
          <div className="profile-card" style={{ position: 'relative' }}>

            {/* Edit / Save Action Buttons */}
            <div style={{ position: 'absolute', top: 0, right: 0 }}>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  style={{ padding: '6px 14px', borderRadius: 20, backgroundColor: '#f1f5f9', color: '#0f172a', fontWeight: 700, fontSize: 11, letterSpacing: 0.5, border: 'none', cursor: 'pointer' }}
                >
                  EDIT PROFILE
                </button>
              ) : (
                <div style={{ display: 'flex', gap: 6 }}>
                  <button
                    onClick={() => { setIsEditing(false); setEditForm(profileData); }}
                    style={{ padding: '6px 14px', borderRadius: 20, backgroundColor: '#fee2e2', color: '#dc2626', fontWeight: 700, fontSize: 11, border: 'none', cursor: 'pointer' }}
                  >
                    CANCEL
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    style={{ padding: '6px 14px', borderRadius: 20, backgroundColor: '#1e3a8a', color: 'white', fontWeight: 700, fontSize: 11, border: 'none', cursor: 'pointer' }}
                  >
                    {saving ? 'SAVING...' : 'SAVE'}
                  </button>
                </div>
              )}
            </div>

            <div className="avatar-wrapper" style={{ position: 'relative' }}>
              <div className="avatar-img" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#1e293b', overflow: 'hidden', position: 'relative' }}>
                {(isEditing ? editForm.photoUrl : profileData.photoUrl) ? (
                  <img src={isEditing ? editForm.photoUrl : profileData.photoUrl} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ width: 44, height: 44, backgroundColor: '#fcd34d', borderRadius: '50%', marginBottom: -20 }}></div>
                )}

                {isEditing && (
                  <>
                    <label htmlFor="photo-upload" style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 10 }}>
                      <Camera size={24} color="white" />
                      <span style={{ fontSize: 9, color: 'white', fontWeight: 600, marginTop: 4 }}>CHANGE</span>
                    </label>
                    <input
                      id="photo-upload"
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      style={{ display: 'none' }}
                    />
                  </>
                )}
              </div>
              {!isEditing && (
                <div className="verified-badge-icon">
                  <div className="inner">
                    <Check size={12} strokeWidth={3} />
                  </div>
                </div>
              )}
            </div>

            {isEditing ? (
              <div style={{ textAlign: 'left', marginTop: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label style={{ fontSize: 10, fontWeight: 700, color: '#64748b', letterSpacing: 0.5, marginBottom: 6, display: 'block' }}>FULL NAME</label>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                    style={{ width: '100%', padding: '12px 14px', borderRadius: 10, border: '1px solid #cbd5e1', backgroundColor: '#f8fafc', fontSize: 14, color: '#0f172a' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: 10, fontWeight: 700, color: '#64748b', letterSpacing: 0.5, marginBottom: 6, display: 'block' }}>MOBILE NUMBER</label>
                  <input
                    type="text"
                    value={editForm.mobile}
                    onChange={e => setEditForm({ ...editForm, mobile: e.target.value })}
                    placeholder="+91 00000 00000"
                    style={{ width: '100%', padding: '12px 14px', borderRadius: 10, border: '1px solid #cbd5e1', backgroundColor: '#f8fafc', fontSize: 14, color: '#0f172a' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: 10, fontWeight: 700, color: '#64748b', letterSpacing: 0.5, marginBottom: 6, display: 'block' }}>GENDER</label>
                  <select
                    value={editForm.gender}
                    onChange={e => setEditForm({ ...editForm, gender: e.target.value })}
                    style={{ width: '100%', padding: '12px 14px', borderRadius: 10, border: '1px solid #cbd5e1', backgroundColor: '#f8fafc', fontSize: 14, color: '#0f172a' }}
                  >
                    <option value="Not Specified">Prefer Not to Say</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
            ) : (
              <>
                <h2 className="profile-name">{loading ? 'Loading...' : profileData.name}</h2>
                <div className="profile-phone" style={{ marginBottom: 4 }}>
                  {profileData.mobile || 'No Mobile Linked'}
                </div>
                <div className="profile-phone" style={{ fontSize: 12, marginBottom: 16 }}>
                  {profileData.gender !== 'Not Specified' ? profileData.gender : 'Gender Not Specified'}
                </div>

                <div className="badges-row">
                  <div className="badge-pill-blue">CITIZEN ADVOCATE</div>
                  <div className="badge-pill-green">VERIFIED IDENTITY</div>
                </div>
              </>
            )}
          </div>

          {/* Existing Stats UI */}
          <div className="stats-container">
            <div className="stat-box">
              <div className="stat-label">TOTAL REPORTS</div>
              <div className="stat-val">12</div>
            </div>
            <div className="stat-box">
              <div className="stat-label">ACTIVE CASES</div>
              <div className="stat-val">2</div>
            </div>
            <div className="stat-box">
              <div className="stat-label">TRUST SCORE</div>
              <div className="stat-val stat-val-green">98<span className="stat-pct">%</span></div>
            </div>
          </div>

          <h3 className="section-heading">Account Settings</h3>
          <div className="list-card">
            <button className="list-item">
              <div className="list-item-left">
                <div className="list-item-icon"><User size={20} /></div>
                <div className="list-item-text">Personal Information</div>
              </div>
              <div className="list-item-right">
                <ChevronRight size={18} />
              </div>
            </button>

            <button className="list-item">
              <div className="list-item-left">
                <div className="list-item-icon"><ShieldCheck size={20} /></div>
                <div className="list-item-text">
                  Identity Verification
                  <CheckCircle2 size={14} className="verified-icon" />
                </div>
              </div>
              <div className="list-item-right">
                <ChevronRight size={18} />
              </div>
            </button>

            <button className="list-item">
              <div className="list-item-left">
                <div className="list-item-icon"><MapPin size={20} /></div>
                <div className="list-item-text">Saved Addresses</div>
              </div>
              <div className="list-item-right">
                <ChevronRight size={18} />
              </div>
            </button>
          </div>

          <h3 className="section-heading">App Preferences</h3>
          <div className="list-card">
            <div className="list-item" style={{ position: 'relative' }}>
              <div className="list-item-left">
                <div className="list-item-icon"><Globe size={20} /></div>
                <div className="list-item-text">Language</div>
              </div>
              <div className="list-item-right" style={{ display: 'flex', alignItems: 'center' }}>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  style={{ appearance: 'none', background: 'transparent', border: 'none', color: 'var(--text-secondary)', fontSize: '13px', fontWeight: '500', textAlign: 'right', outline: 'none', cursor: 'pointer', paddingRight: '8px' }}
                >
                  <option value="en">English</option>
                  <option value="te">Telugu</option>
                  <option value="hi">Hindi</option>
                </select>
                <ChevronRight size={18} color="var(--text-secondary)" />
              </div>
            </div>

            <button className="list-item">
              <div className="list-item-left">
                <div className="list-item-icon"><Bell size={20} /></div>
                <div className="list-item-text">Notification Settings</div>
              </div>
              <div className="list-item-right">
                <ChevronRight size={18} />
              </div>
            </button>

            <button className="list-item" onClick={handleDarkModeToggle} style={{ cursor: 'pointer' }}>
              <div className="list-item-left">
                <div className="list-item-icon"><Moon size={20} /></div>
                <div className="list-item-text">Dark Mode</div>
              </div>
              <div className="list-item-right">
                <div className={`toggle-switch ${darkMode ? 'on' : ''}`}></div>
              </div>
            </button>
          </div>

          <h3 className="section-heading">Support & Security</h3>
          <div className="list-card">
            <button className="list-item">
              <div className="list-item-left">
                <div className="list-item-icon"><AlertTriangle size={20} /></div>
                <div className="list-item-text">Report an Issue with the App</div>
              </div>
              <div className="list-item-right">
                <ChevronRight size={18} />
              </div>
            </button>

            <button className="list-item">
              <div className="list-item-left">
                <div className="list-item-icon"><ShieldCheck size={20} /></div>
                <div className="list-item-text">Security Settings</div>
              </div>
              <div className="list-item-right">
                <ChevronRight size={18} />
              </div>
            </button>

            <button className="list-item">
              <div className="list-item-left">
                <div className="list-item-icon"><FileKey size={20} /></div>
                <div className="list-item-text">Privacy Policy</div>
              </div>
              <div className="list-item-right">
                <ChevronRight size={18} />
              </div>
            </button>
          </div>

          <div className="logout-wrapper">
            <button className="logout-btn" onClick={onLogout}>
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>
      </div>
      <BottomNav />
    </>
  );
}