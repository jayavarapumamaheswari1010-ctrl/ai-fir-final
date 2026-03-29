import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, query, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { ArrowLeft, TrendingUp, MoreVertical, AlertTriangle, AlertCircle, FileText, ChevronRight, Shield, ShieldAlert, Users } from 'lucide-react';
import BottomNav from '../components/BottomNav';

export default function SubdivisionScreen() {
  const navigate = useNavigate();
  const [liveCounts, setLiveCounts] = useState({ total: 0, pending: 0, critical: 0, medium: 0, routine: 0 });

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const q = query(collection(db, 'FIR_Reports'));
        const snapshot = await getDocs(q);
        
        let c = 0, m = 0, r = 0, p = 0;
        snapshot.docs.forEach(doc => {
          const data = doc.data();
          if (data.selectedPriority === 'CRITICAL') c++;
          else if (data.selectedPriority === 'MEDIUM') m++;
          else if (data.selectedPriority === 'ROUTINE') r++;
          else p++;
        });

        setLiveCounts({
          total: snapshot.docs.length,
          critical: c,
          medium: m,
          routine: r,
          pending: p
        });
      } catch (err) {
         console.warn("Failed to fetch live counts:", err);
      }
    };
    fetchCounts();
  }, []);

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', paddingBottom: 100, fontFamily: 'Inter, sans-serif' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px', backgroundColor: '#f8fafc', position: 'sticky', top: 0, zIndex: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: '#1e3a8a', display: 'flex', alignItems: 'center' }}>
            <ArrowLeft size={24} strokeWidth={2.5} />
          </button>
          <h1 style={{ fontSize: 20, fontWeight: 800, color: '#0f172a', margin: 0, letterSpacing: 0.5 }}>Case Subdivision</h1>
        </div>
        
        {/* Police Avatar styled from screenshot */}
        <div style={{ width: 36, height: 36, backgroundColor: '#1e293b', borderRadius: 8, overflow: 'hidden', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
           {/* Mock Police Avatar Graphic */}
           <div style={{ position: 'relative', width: 24, height: 28 }}>
              <div style={{ position: 'absolute', bottom: 0, width: 24, height: 14, backgroundColor: '#3b82f6', borderTopLeftRadius: 12, borderTopRightRadius: 12 }}></div>
              <div style={{ position: 'absolute', bottom: 12, left: 4, width: 16, height: 16, backgroundColor: '#fcd34d', borderRadius: '50%' }}></div>
              <div style={{ position: 'absolute', top: -2, left: -2, width: 28, height: 8, backgroundColor: '#0f172a', borderRadius: 4 }}></div>
           </div>
        </div>
      </div>

      <div style={{ padding: '0 24px' }}>
        
        {/* Top Metric Cards */}
        <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
          {/* Total FIRs */}
          <div style={{ flex: 1, backgroundColor: 'white', borderRadius: 16, padding: '20px', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#475569', marginBottom: 8 }}>Total FIRs</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: '#0f172a', letterSpacing: -0.5, marginBottom: 16 }}>{(1248 + liveCounts.total).toLocaleString()}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#059669', fontSize: 12, fontWeight: 700 }}>
              <TrendingUp size={14} strokeWidth={3} />
              +4% trend
            </div>
          </div>
          
          {/* Pending */}
          <div style={{ flex: 1, backgroundColor: 'white', borderRadius: 16, padding: '20px', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#475569', marginBottom: 8 }}>Pending</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: '#1e3a8a', letterSpacing: -0.5, marginBottom: 16 }}>{42 + liveCounts.pending}</div>
            <div style={{ display: 'inline-block', backgroundColor: '#fee2e2', color: '#dc2626', fontSize: 10, fontWeight: 800, padding: '4px 8px', borderRadius: 4, letterSpacing: 0.5 }}>
              CRITICAL
            </div>
          </div>
        </div>

        {/* Weekly Petition Volume Chart */}
        <div style={{ backgroundColor: '#f1f5f9', borderRadius: 16, padding: '20px', marginBottom: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 40 }}>
            <h2 style={{ margin: 0, fontSize: 15, fontWeight: 800, color: '#1e3a8a' }}>Weekly Petition Volume</h2>
            <MoreVertical size={18} color="#94a3b8" />
          </div>
          
          {/* Mock Chart Area */}
          <div style={{ height: 100, position: 'relative', width: '100%', marginBottom: 16 }}>
            {/* Curved Path for Trend */}
            <svg style={{ width: '100%', height: '100%', overflow: 'visible' }} preserveAspectRatio="none" viewBox="0 0 100 100">
              {/* Soft Area fill */}
              <path d="M0,80 Q20,20 40,40 T80,10 T100,30 L100,100 L0,100 Z" fill="rgba(59, 130, 246, 0.05)" />
              {/* Strong Blue Line */}
              <path d="M0,80 Q20,20 40,40 T80,10 T100,30" fill="none" stroke="#e2e8f0" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b', fontSize: 10, fontWeight: 600 }}>
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span style={{ color: '#1e3a8a', fontWeight: 800 }}>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
            <span>Sun</span>
          </div>
        </div>

        {/* Crime Categories Distribution */}
        <div style={{ backgroundColor: 'white', borderRadius: 16, padding: '20px', marginBottom: 32, boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
          <h2 style={{ margin: '0 0 24px 0', fontSize: 15, fontWeight: 800, color: '#1e3a8a' }}>Crime Categories Distribution</h2>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
            {/* Donut Chart SVG */}
            <div style={{ position: 'relative', width: 110, height: 110 }}>
              <svg viewBox="0 0 36 36" style={{ width: 110, height: 110, transform: 'rotate(-90deg)' }}>
                 {/* Cybercrime Segment (Navy Blue) */}
                 <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#0f172a" strokeWidth="4.5" strokeDasharray="30 70" strokeDashoffset="0"></circle>
                 {/* Women Safety Segment (Brown) */}
                 <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#78350f" strokeWidth="4.5" strokeDasharray="20 80" strokeDashoffset="-30"></circle>
                 {/* Property Dispute Segment (Teal) */}
                 <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#047857" strokeWidth="4.5" strokeDasharray="25 75" strokeDashoffset="-50"></circle>
                 {/* Theft Segment (Light Gray) */}
                 <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#e2e8f0" strokeWidth="4.5" strokeDasharray="25 75" strokeDashoffset="-75"></circle>
              </svg>
              {/* Inner Text */}
              <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: 18, fontWeight: 800, color: '#0f172a' }}>28%</span>
                <span style={{ fontSize: 8, fontWeight: 700, color: '#94a3b8', letterSpacing: 1, marginTop: 2 }}>CYBER</span>
              </div>
            </div>

            {/* Legend */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
               
               <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 11 }}>
                 <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#475569', fontWeight: 600 }}>
                   <div style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#0f172a' }}></div>
                   Cybercrime
                 </div>
                 <div style={{ fontWeight: 800, color: '#0f172a' }}>28%</div>
               </div>
               
               <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 11 }}>
                 <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#475569', fontWeight: 600 }}>
                   <div style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#047857' }}></div>
                   <span style={{ lineHeight: 1.1 }}>Property<br/>Dispute</span>
                 </div>
                 <div style={{ fontWeight: 800, color: '#0f172a' }}>22%</div>
               </div>

               <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 11 }}>
                 <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#475569', fontWeight: 600 }}>
                   <div style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#78350f' }}></div>
                   Women Safety
                 </div>
                 <div style={{ fontWeight: 800, color: '#0f172a' }}>18%</div>
               </div>

               <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 11 }}>
                 <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#475569', fontWeight: 600 }}>
                   <div style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#94a3b8' }}></div>
                   Theft
                 </div>
                 <div style={{ fontWeight: 800, color: '#0f172a' }}>15%</div>
               </div>

            </div>
          </div>
        </div>

        {/* Subdivision Status */}
        <h2 style={{ fontSize: 16, fontWeight: 800, color: '#1e3a8a', marginBottom: 16 }}>Subdivision Status</h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 32 }}>
          {/* Critical */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'white', borderRadius: 12, padding: '16px 20px', boxShadow: '0 2px 10px rgba(0,0,0,0.02)', borderLeft: '3px solid #dc2626' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ width: 40, height: 40, borderRadius: '10px', backgroundColor: '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: 20, fontWeight: 800, color: '#dc2626' }}>!</span>
              </div>
              <div>
                <div style={{ fontSize: 10, fontWeight: 800, color: '#dc2626', letterSpacing: 1, marginBottom: 4 }}>CRITICAL</div>
                <div style={{ fontSize: 16, fontWeight: 800, color: '#0f172a' }}>{15 + liveCounts.critical} Cases</div>
              </div>
            </div>
            <ChevronRight size={18} color="#94a3b8" />
          </div>

          {/* Medium */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'white', borderRadius: 12, padding: '16px 20px', boxShadow: '0 2px 10px rgba(0,0,0,0.02)', borderLeft: '3px solid #b45309' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ width: 40, height: 40, borderRadius: '10px', backgroundColor: '#ffedd5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <AlertTriangle size={20} color="#b45309" strokeWidth={2.5} />
              </div>
              <div>
                <div style={{ fontSize: 10, fontWeight: 800, color: '#b45309', letterSpacing: 1, marginBottom: 4 }}>MEDIUM</div>
                <div style={{ fontSize: 16, fontWeight: 800, color: '#0f172a' }}>{156 + liveCounts.medium} Cases</div>
              </div>
            </div>
            <ChevronRight size={18} color="#94a3b8" />
          </div>

          {/* Routine */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'white', borderRadius: 12, padding: '16px 20px', boxShadow: '0 2px 10px rgba(0,0,0,0.02)', borderLeft: '3px solid #1e3a8a' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ width: 40, height: 40, borderRadius: '10px', backgroundColor: '#e0e7ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <FileText size={20} color="#1e3a8a" strokeWidth={2.5} />
              </div>
              <div>
                <div style={{ fontSize: 10, fontWeight: 800, color: '#1e3a8a', letterSpacing: 1, marginBottom: 4 }}>ROUTINE</div>
                <div style={{ fontSize: 16, fontWeight: 800, color: '#0f172a' }}>{(1077 + liveCounts.routine).toLocaleString()} Cases</div>
              </div>
            </div>
            <ChevronRight size={18} color="#94a3b8" />
          </div>
        </div>

        {/* Recent Petitions */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h2 style={{ fontSize: 16, fontWeight: 800, color: '#1e3a8a', margin: 0 }}>Recent Petitions</h2>
          <span style={{ fontSize: 12, fontWeight: 700, color: '#1e3a8a' }}>View All</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          
          {/* Item 1 */}
          <div style={{ backgroundColor: 'white', borderRadius: 12, padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
               <div style={{ width: 36, height: 36, backgroundColor: '#f1f5f9', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Shield size={18} color="#0f172a" strokeWidth={2.5} />
               </div>
               <div>
                  <div style={{ fontSize: 13, fontWeight: 800, color: '#0f172a', marginBottom: 4 }}>AP-2024-1247</div>
                  <div style={{ fontSize: 11, fontWeight: 500, color: '#64748b' }}>Cybercrime • 2h ago</div>
               </div>
            </div>
            <div style={{ backgroundColor: '#fee2e2', color: '#dc2626', fontSize: 9, fontWeight: 800, padding: '4px 6px', borderRadius: 4, letterSpacing: 0.5 }}>
              CRITICAL
            </div>
          </div>

          {/* Item 2 */}
          <div style={{ backgroundColor: 'white', borderRadius: 12, padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
               <div style={{ width: 36, height: 36, backgroundColor: '#f1f5f9', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ShieldAlert size={18} color="#0f172a" strokeWidth={2.5} />
               </div>
               <div>
                  <div style={{ fontSize: 13, fontWeight: 800, color: '#0f172a', marginBottom: 4 }}>AP-2024-1246</div>
                  <div style={{ fontSize: 11, fontWeight: 500, color: '#64748b' }}>Property Dispute • 5h ago</div>
               </div>
            </div>
            <div style={{ backgroundColor: '#ffedd5', color: '#b45309', fontSize: 9, fontWeight: 800, padding: '4px 6px', borderRadius: 4, letterSpacing: 0.5 }}>
              MEDIUM
            </div>
          </div>

          {/* Item 3 */}
          <div style={{ backgroundColor: 'white', borderRadius: 12, padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
               <div style={{ width: 36, height: 36, backgroundColor: '#f1f5f9', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Users size={18} color="#0f172a" strokeWidth={2.5} />
               </div>
               <div>
                  <div style={{ fontSize: 13, fontWeight: 800, color: '#0f172a', marginBottom: 4 }}>AP-2024-1245</div>
                  <div style={{ fontSize: 11, fontWeight: 500, color: '#64748b' }}>Public Nuisance • 8h ago</div>
               </div>
            </div>
            <div style={{ backgroundColor: '#e0e7ff', color: '#3b82f6', fontSize: 9, fontWeight: 800, padding: '4px 6px', borderRadius: 4, letterSpacing: 0.5 }}>
              ROUTINE
            </div>
          </div>

        </div>
      </div>

      <BottomNav />
    </div>
  );
}
