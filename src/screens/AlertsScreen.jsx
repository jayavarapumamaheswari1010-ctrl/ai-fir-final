import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, User, MapPin, Grid, List as ListIcon, ArrowRight, ShieldCheck, Lock } from 'lucide-react';
import { collection, query, orderBy, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import BottomNav from '../components/BottomNav';
import OfficerGateScreen from './OfficerGateScreen';

const initialCases = [
    {
      id: "FIR-2026-X89A",
      title: "Grand Larceny (Vehicle)",
      location: "Downtown District, Zone 4",
      details: [
        { label: "DATE OF INCIDENT", value: "Oct 24, 2026" },
        { label: "FILED BY", value: "Rajesh Kumar" }
      ],
      selectedPriority: null
    },
    {
      id: "FIR-2026-A11V5",
      title: "Corporate Fraud",
      location: "Tech Park, North Wing",
      details: [
        { label: "DATE OF INCIDENT", value: "Oct 23, 2026", color: "var(--danger-color)" },
        { label: "DESC", value: '"Suspicious employee activity in financial records involving offshore transfers..."' }
      ],
      selectedPriority: "CRITICAL"
    },
    {
      id: "FIR-2026-W926G",
      title: "Property Trespass",
      location: "Heritage Estates, Sector 8",
      hasImage: true,
      details: [
        { label: "INCIDENT TIME", value: "02:15 AM" },
        { label: "ATTACHMENTS", value: "3 Photos, 1 Video", color: "var(--primary-color)" },
        { label: "DESC", value: "CCTV footage recovered from main gate. Suspect identified as non-resident. Visual evidence attached for verification." }
      ],
      selectedPriority: "ROUTINE"
    },
    {
      id: "FIR-2026-L4GH8",
      title: "Cyber Harassment",
      location: "Digital Platform Jurisdiction",
      details: [
        { label: "SOURCE", value: "Public Portal" },
        { label: "CRITICALITY", value: "Urgent Action", color: "var(--danger-color)" }
      ],
      selectedPriority: "MEDIUM"
    },
    {
      id: "FIR-2026-M0RP2",
      title: "Public Nuisance",
      location: "Central Market Square",
      details: [
        { label: "WITNESSES", value: "05 Registered", bold: true }
      ],
      selectedPriority: "ROUTINE"
    }
  ];

export default function AlertsScreen() {
  const navigate = useNavigate();

  const [caseList, setCaseList] = useState(initialCases);
  const [isVerified, setIsVerified] = useState(false);
  const [showGate, setShowGate] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);

  // New states for functional buttons
  const [filter, setFilter] = useState('ALL');
  const [layout, setLayout] = useState('LIST');
  const [selectedCase, setSelectedCase] = useState(null);

  useEffect(() => {
    const fetchCases = async () => {
      try {
        const q = query(collection(db, 'FIR_Reports'), orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);
        const liveCases = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: data.firId || doc.id,
            title: data.incident_type || "Incident Report",
            location: data.location?.split('|')[0] || "Location Not Stated",
            details: [
              { label: "DATE OF INCIDENT", value: data.date_time || "Unknown" },
              { label: "FILED BY", value: data.name || "Anonymous Citizen" },
              { label: "DESC", value: `"${data.description?.substring(0, 100) || 'No description provided.'}..."`, color: "var(--text-secondary)" }
            ],
            fullData: data,
            selectedPriority: data.selectedPriority || null,
            docId: doc.id
          };
        });
        setCaseList([...liveCases, ...initialCases]);
      } catch (err) {
        console.error("Failed to fetch FIRs:", err);
      }
    };
    fetchCases();
  }, []);

  const filteredCases = caseList.filter(c => {
    if (filter === 'ALL') return true;
    if (filter === 'UNASSIGNED') return !c.selectedPriority;
    if (filter === 'CRITICAL') return c.selectedPriority === 'CRITICAL' || c.id === 'FIR-2026-A11V5'; // demo mapping
    if (filter === 'REVIEWED') return !!c.selectedPriority;
    return true;
  });

  const requireAuth = (actionCallback) => {
    if (isVerified) {
      actionCallback();
    } else {
      setPendingAction(() => actionCallback);
      setShowGate(true);
    }
  };

  const handleVerified = () => {
    setIsVerified(true);
    setShowGate(false);
    if (pendingAction) {
      pendingAction();
      setPendingAction(null);
    }
  };

  const handlePriorityChange = (idx, priority) => {
    requireAuth(async () => {
      const updated = [...caseList];
      const targetCase = updated[idx];
      targetCase.selectedPriority = priority;
      setCaseList(updated);

      if (targetCase.docId) {
        try {
          await updateDoc(doc(db, 'FIR_Reports', targetCase.docId), { selectedPriority: priority });
        } catch (err) {
          console.error("Failed to update priority in database", err);
        }
      }
    });
  };

  const handleCancelAuth = () => {
    setShowGate(false);
    setPendingAction(null);
  };

  if (showGate) {
    return (
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999, backgroundColor: '#0f172a' }}>
        <OfficerGateScreen onVerified={handleVerified} onCancel={handleCancelAuth} targetPath="" />
      </div>
    );
  }

  return (
    <>
      <div className="alerts-screen" style={{ paddingBottom: '100px', backgroundColor: '#f8fafc', minHeight: '100vh', overflowY: 'auto' }}>
        <div className="app-header" style={{ padding: '16px 20px', backgroundColor: '#f8fafc', marginBottom: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <ShieldCheck size={22} color="var(--primary-color)" />
            <span style={{ fontWeight: 800, letterSpacing: 1, fontSize: 15, color: 'var(--primary-color)' }}>CIVIC GUARDIAN</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <Search size={20} color="var(--text-secondary)" />
            <div className="profile-icon" style={{ cursor: 'pointer' }} onClick={() => navigate('/profile')}>
              <User size={18} />
            </div>
          </div>
        </div>

        <div style={{ padding: '0 20px' }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1, color: 'var(--text-secondary)', marginBottom: 4, marginTop: 16 }}>
            OFFICER DASHBOARD
          </div>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: 'var(--primary-color)', lineHeight: 1.1, marginBottom: 12 }}>
            Recent FIR<br/>Submissions
          </h1>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: 24 }}>
            Review, categorize, and assign priority to incoming incident reports from the civic jurisdiction.
          </p>

          <div className="dashboard-stats" style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
            <div style={{ flex: 1, backgroundColor: '#f1f5f9', borderRadius: 8, padding: '16px 12px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-primary)' }}>24</span>
              <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-secondary)' }}>PENDING REVIEW</span>
            </div>
            <div style={{ flex: 1, backgroundColor: '#1e3a8a', borderRadius: 8, padding: '16px 12px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: 24, fontWeight: 700, color: 'white' }}>08</span>
              <span style={{ fontSize: 10, fontWeight: 600, color: '#bfdbfe' }}>CRITICAL CASES</span>
            </div>
          </div>

          <div className="filter-scroll" style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 16, msOverflowStyle: 'none', scrollbarWidth: 'none' }}>
            <div onClick={() => setFilter('ALL')} className={`filter-chip ${filter === 'ALL' ? 'active' : ''}`} style={{ backgroundColor: filter === 'ALL' ? '#1e3a8a' : '#e2e8f0', color: filter === 'ALL' ? 'white' : 'var(--text-secondary)', padding: '6px 14px', borderRadius: 6, fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
              <Grid size={12} /> All Cases
            </div>
            <div onClick={() => setFilter('UNASSIGNED')} className={`filter-chip ${filter === 'UNASSIGNED' ? 'active' : ''}`} style={{ backgroundColor: filter === 'UNASSIGNED' ? '#1e3a8a' : '#e2e8f0', color: filter === 'UNASSIGNED' ? 'white' : 'var(--text-secondary)', padding: '6px 14px', borderRadius: 6, fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
              <ListIcon size={12} /> Unassigned
            </div>
          </div>
          
          <div className="filter-scroll" style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 16, msOverflowStyle: 'none', scrollbarWidth: 'none', marginTop: -8 }}>
            <div onClick={() => setFilter('CRITICAL')} className={`filter-chip ${filter === 'CRITICAL' ? 'active' : ''}`} style={{ backgroundColor: '#fee2e2', color: 'var(--danger-color)', border: filter === 'CRITICAL' ? '2px solid var(--danger-color)' : '2px solid transparent', padding: '4px 12px', borderRadius: 6, fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
              <div style={{ width: 4, height: 12, backgroundColor: 'var(--danger-color)', borderRadius: 2 }}></div> Critical
            </div>
            <div onClick={() => setFilter('REVIEWED')} className={`filter-chip ${filter === 'REVIEWED' ? 'active' : ''}`} style={{ backgroundColor: filter === 'REVIEWED' ? '#1e3a8a' : '#e2e8f0', color: filter === 'REVIEWED' ? 'white' : 'var(--text-secondary)', padding: '6px 14px', borderRadius: 6, fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
              <ShieldCheck size={12} /> Recently Reviewed
            </div>
          </div>

          <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
             <button onClick={() => setLayout('GRID')} style={{ padding: '6px 10px', backgroundColor: layout === 'GRID' ? '#cbd5e1' : 'white', border: '1px solid #cbd5e1', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
               <Grid size={16} color="var(--text-primary)" />
             </button>
             <button onClick={() => setLayout('LIST')} style={{ padding: '6px 10px', backgroundColor: layout === 'LIST' ? '#cbd5e1' : 'white', border: '1px solid #cbd5e1', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
               <ListIcon size={16} color="var(--text-primary)" />
             </button>
          </div>

          <div className="cases-list" style={{ display: 'grid', gridTemplateColumns: layout === 'GRID' ? 'repeat(max-width: 400px, 1fr)' : '1fr', gap: 24 }}>
            {filteredCases.map((c, i) => (
              <div key={i} className="case-card" style={{ backgroundColor: 'white', borderRadius: 12, overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                {c.hasImage && (
                  <div style={{ height: 120, backgroundColor: '#334155', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(to bottom, transparent, rgba(0,0,0,0.7))', zIndex: 1 }}></div>
                    <div style={{ position: 'absolute', bottom: 16, left: 16, zIndex: 2 }}>
                       <div style={{ backgroundColor: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(4px)', padding: '4px 8px', borderRadius: 4, fontSize: 10, fontWeight: 700, color: 'white', marginBottom: 4, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                         {c.id}
                       </div>
                       <h3 style={{ margin: 0, color: 'white', fontSize: 16, fontWeight: 700 }}>{c.title}</h3>
                    </div>
                  </div>
                )}
                
                <div style={{ padding: 16 }}>
                  {!c.hasImage && (
                    <>
                      <div style={{ backgroundColor: '#f1f5f9', padding: '4px 8px', borderRadius: 4, fontSize: 10, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 8, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                        {c.id}
                      </div>

                      <h3 style={{ margin: '0 0 8px 0', color: 'var(--primary-color)', fontSize: 16, fontWeight: 700 }}>{c.title}</h3>
                    </>
                  )}

                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-secondary)', fontSize: 12, marginBottom: 16 }}>
                    <MapPin size={12} /> {c.location}
                  </div>

                  <div style={{ backgroundColor: '#f8fafc', borderRadius: 6, padding: '12px', marginBottom: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {c.details.map((d, idx) => (
                      <div key={idx} style={{ display: d.label === 'DESC' ? 'block' : 'flex', justifyContent: d.label === 'DESC' ? 'flex-start' : 'space-between', alignItems: 'baseline', gap: 8 }}>
                        {d.label !== 'DESC' && <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-secondary)', letterSpacing: 0.5 }}>{d.label}</span>}
                        <span style={{ fontSize: d.label === 'DESC' ? 12 : 12, fontWeight: d.bold ? 700 : d.label === 'DESC' ? 400 : 500, color: d.color || 'var(--text-primary)', fontStyle: d.label === 'DESC' && d.value.startsWith('"') ? 'italic' : 'normal', lineHeight: 1.5 }}>
                          {d.value}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-secondary)', letterSpacing: 0.5, marginBottom: 8 }}>ASSIGN PRIORITY</div>
                  <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
                    <button onClick={() => handlePriorityChange(i, 'CRITICAL')} style={{ flex: 1, padding: '8px 0', fontSize: 11, fontWeight: 700, borderRadius: 4, border: c.selectedPriority === 'CRITICAL' ? 'none' : '1px solid #fee2e2', backgroundColor: c.selectedPriority === 'CRITICAL' ? '#dc2626' : 'transparent', color: c.selectedPriority === 'CRITICAL' ? 'white' : '#dc2626', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                      {!isVerified && <Lock size={10} />} CRITICAL
                    </button>
                    <button onClick={() => handlePriorityChange(i, 'MEDIUM')} style={{ flex: 1, padding: '8px 0', fontSize: 11, fontWeight: 700, borderRadius: 4, border: c.selectedPriority === 'MEDIUM' ? 'none' : '1px solid #ffedd5', backgroundColor: c.selectedPriority === 'MEDIUM' ? '#78350f' : 'transparent', color: c.selectedPriority === 'MEDIUM' ? 'white' : '#78350f', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                      {!isVerified && <Lock size={10} />} MEDIUM
                    </button>
                    <button onClick={() => handlePriorityChange(i, 'ROUTINE')} style={{ flex: 1, padding: '8px 0', fontSize: 11, fontWeight: 700, borderRadius: 4, border: c.selectedPriority === 'ROUTINE' ? 'none' : '1px solid #e0e7ff', backgroundColor: c.selectedPriority === 'ROUTINE' ? '#1e3a8a' : 'transparent', color: c.selectedPriority === 'ROUTINE' ? 'white' : '#1e3a8a', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                      {!isVerified && <Lock size={10} />} ROUTINE
                    </button>
                  </div>

                  <button onClick={() => setSelectedCase(c)} style={{ width: '100%', padding: '12px', backgroundColor: '#1e3a8a', color: 'white', border: 'none', borderRadius: 6, fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, cursor: 'pointer' }}>
                    Review Detail <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            ))}
            
            {filteredCases.length === 0 && (
               <div style={{ textAlign: 'center', padding: '40px 20px', color: '#64748b' }}>
                  No cases match this filter.
               </div>
            )}
          </div>
        </div>
      </div>
      <BottomNav />
      {/* Absolute floating button bottom right */}
      <div onClick={() => navigate('/')} style={{ position: 'fixed', bottom: 80, right: 20, width: 48, height: 48, backgroundColor: '#1e3a8a', borderRadius: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(30, 58, 138, 0.3)', color: 'white', fontSize: 24, fontWeight: '300', zIndex: 100, cursor: 'pointer' }}>
        +
      </div>

      {/* Detail Modal overlay */}
      {selectedCase && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.8)', zIndex: 9999, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
           <div style={{ width: '100%', maxWidth: 480, height: '80vh', backgroundColor: '#f8fafc', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: '24px', overflowY: 'auto' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
                 <div>
                    <div style={{ backgroundColor: '#e2e8f0', padding: '4px 8px', borderRadius: 4, fontSize: 10, fontWeight: 700, color: '#475569', display: 'inline-block', marginBottom: 8 }}>{selectedCase.id}</div>
                    <h2 style={{ fontSize: 20, fontWeight: 800, color: '#1e3a8a', margin: 0 }}>{selectedCase.title}</h2>
                 </div>
                 <button onClick={() => setSelectedCase(null)} style={{ background: '#e2e8f0', border: 'none', padding: 8, borderRadius: '50%', cursor: 'pointer', color: '#475569' }}>
                    <ShieldCheck size={18} />
                 </button>
              </div>
              
              <div style={{ backgroundColor: 'white', padding: 16, borderRadius: 12, marginBottom: 16, border: '1px solid #e2e8f0' }}>
                 <div style={{ fontSize: 12, fontWeight: 700, color: '#64748b', marginBottom: 16 }}>COMPREHENSIVE FIR COPY</div>
                 
                 {selectedCase.fullData ? (
                   <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      <div><div style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', letterSpacing: 0.5 }}>COMPLAINANT</div><div style={{ fontSize: 14, fontWeight: 600 }}>{selectedCase.fullData.name || 'Anonymous'} (C/o {selectedCase.fullData.father_name || 'N/A'})</div></div>
                      <div><div style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', letterSpacing: 0.5 }}>CONTACT DETAILS</div><div style={{ fontSize: 14, fontWeight: 500 }}>{selectedCase.fullData.mobile || 'N/A'}<br/>{selectedCase.fullData.address || 'N/A'}</div></div>
                      <div><div style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', letterSpacing: 0.5 }}>INCIDENT DETAILS</div><div style={{ fontSize: 14, fontWeight: 500 }}>Type: {selectedCase.fullData.incident_type || 'N/A'}<br/>Date & Time: {selectedCase.fullData.date_time || 'N/A'}<br/>Location: {selectedCase.fullData.location?.split('|')[0] || 'N/A'}</div></div>
                      <div><div style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', letterSpacing: 0.5 }}>FULL DESCRIPTION</div><div style={{ fontSize: 14, fontWeight: 400, color: '#475569', lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>{selectedCase.fullData.description || 'No description provided.'}</div></div>
                      <div><div style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', letterSpacing: 0.5 }}>SUSPECTS & WITNESSES</div><div style={{ fontSize: 14, fontWeight: 500 }}>Suspects: {selectedCase.fullData.suspect || 'None'}<br/>Witnesses: {selectedCase.fullData.witness || 'None'}</div></div>
                   </div>
                 ) : (
                   <>
                     {selectedCase.details.map((d, index) => (
                        <div key={index} style={{ marginBottom: 12 }}>
                           <div style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8' }}>{d.label}</div>
                           <div style={{ fontSize: 14, color: d.color || '#0f172a', fontWeight: d.bold ? 700 : 500 }}>{d.value}</div>
                        </div>
                     ))}
                     <div style={{ marginTop: 24 }}>
                       <div style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', marginBottom: 4 }}>LOCATION DATA</div>
                       <div style={{ fontSize: 13, color: '#0f172a', fontWeight: 600 }}>{selectedCase.location}</div>
                     </div>
                   </>
                 )}
              </div>

              <button onClick={() => setSelectedCase(null)} style={{ width: '100%', padding: '16px', backgroundColor: '#1e3a8a', color: 'white', border: 'none', borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
                 Acknowledge & Close
              </button>
           </div>
        </div>
      )}
    </>
  );
}
