import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { Check, Download, Share2, Home } from 'lucide-react';
import jsPDF from 'jspdf';

export default function SuccessScreen() {
  const { t } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const firId = location.state?.firId || "FIR-2026-" + Math.random().toString(36).substring(2, 6).toUpperCase();
  const firData = location.state?.firData || {};

  const generatePDF = () => {
    const doc = new jsPDF();
    
    // Header
    doc.setFont("times", "bold");
    doc.setFontSize(14);
    doc.text("FIRST INFORMATION REPORT", 105, 20, null, null, "center");
    
    doc.setFont("times", "normal");
    doc.setFontSize(10);
    doc.text("(Under Section 154 Cr.P.C.)", 105, 26, null, null, "center");
    
    doc.line(15, 30, 195, 30);
    
    // Line 1: Meta
    doc.setFont("times", "bold");
    doc.text("1. District:", 15, 40);
    doc.setFont("times", "normal");
    doc.text("Cyberabad", 35, 40); // mock
    
    doc.setFont("times", "bold");
    doc.text("P.S.:", 75, 40);
    doc.setFont("times", "normal");
    doc.text("Central Police", 85, 40);
    
    doc.setFont("times", "bold");
    doc.text("Year:", 125, 40);
    doc.setFont("times", "normal");
    doc.text("2026", 136, 40);

    doc.setFont("times", "bold");
    doc.text("FIR No.:", 155, 40);
    doc.setFont("times", "normal");
    doc.text(firId, 172, 40);

    // Line 2: Acts
    doc.setFont("times", "bold");
    doc.text("2. Acts & Sections:", 15, 50);
    doc.setFont("times", "normal");
    let section = "Applicable IPC Sections";
    if (firData.incident_type === "Theft") section = "IPC Section 379";
    if (firData.incident_type === "Cyber Fraud") section = "IT Act Section 66D";
    doc.text(section, 55, 50);

    // Line 3: Occurrence
    doc.setFont("times", "bold");
    doc.text("3. Occurrence of Offence:", 15, 60);
    doc.setFont("times", "normal");
    doc.text(`Date & Time: ${firData.date_time || "Not Mentioned"}`, 20, 68);

    // Line 4: Info Type
    doc.setFont("times", "bold");
    doc.text("4. Type of Information:", 15, 78);
    doc.setFont("times", "normal");
    doc.text("Oral (Transcribed via Civic Guardian AI)", 60, 78);

    // Line 5: Place
    doc.setFont("times", "bold");
    doc.text("5. Place of Occurrence:", 15, 88);
    doc.setFont("times", "normal");
    const locText = doc.splitTextToSize(`Address: ${firData.location ? firData.location.split('|')[0] : 'Not specified'}`, 170);
    doc.text(locText, 20, 96);

    let yPos = 96 + (locText.length * 6) + 4;

    // Line 6: Complainant
    doc.setFont("times", "bold");
    doc.text("6. Complainant / Informant:", 15, yPos);
    yPos += 8;
    doc.setFont("times", "normal");
    doc.text(`Name: ${firData.name || "Unknown"}`, 20, yPos);
    yPos += 6;
    doc.text(`Father/Spouse Name: ${firData.father_name || "N/A"}`, 20, yPos);
    yPos += 6;
    doc.text(`Mobile: ${firData.mobile || "N/A"}`, 20, yPos);
    yPos += 6;
    doc.text(`Address: ${firData.address || "N/A"}`, 20, yPos);
    yPos += 10;

    // Line 7: Suspects
    doc.setFont("times", "bold");
    doc.text("7. Details of known/suspected accused with particulars:", 15, yPos);
    yPos += 8;
    doc.setFont("times", "normal");
    const suspectLines = doc.splitTextToSize(firData.suspect || "Unknown / Not specified", 170);
    doc.text(suspectLines, 20, yPos);
    yPos += (suspectLines.length * 6) + 6;

    doc.setFont("times", "bold");
    doc.text("8. Details of Witnesses:", 15, yPos);
    yPos += 8;
    doc.setFont("times", "normal");
    const witnessLines = doc.splitTextToSize(firData.witness || "None specified", 170);
    doc.text(witnessLines, 20, yPos);
    yPos += (witnessLines.length * 6) + 10;

    // Line 12: Contents
    doc.setFont("times", "bold");
    doc.text("12. F.I.R. Contents:", 15, yPos);
    yPos += 8;
    doc.setFont("times", "normal");
    const descLines = doc.splitTextToSize(firData.description || "No specific details provided.", 175);
    doc.text(descLines, 20, yPos);
    yPos += (descLines.length * 6) + 15;

    // Line 13: Action
    doc.setFont("times", "bold");
    doc.text("13. Action taken:", 15, yPos);
    doc.setFont("times", "normal");
    doc.text("Registered and investigation initiated via Central Portal.", 50, yPos);
    
    yPos += 20;

    doc.line(15, yPos, 195, yPos);
    yPos += 10;
    doc.setFont("times", "bold");
    doc.text("Signature/Thumb Impression of Complainant", 15, yPos);
    doc.text("Signature of Officer-in-charge, Police Station", 120, yPos);

    doc.save(`${firId}_154_CrPC.pdf`);
  };

  return (
    <div className="success-screen">
      <div className="app-header" style={{ width: '100%', justifyContent: 'center', background: 'transparent' }}>
        <span className="app-title" style={{ textAlign: 'center' }}>CIVIC GUARDIAN</span>
      </div>

      <div className="success-icon">
        <Check size={40} strokeWidth={3} />
      </div>

      <h1 className="success-title">{t('successTitle')}</h1>
      <p className="success-desc">
        {t('successDesc')}
      </p>

      <div className="id-card">
        <div className="id-label">DIGITAL REFERENCE TOKEN</div>
        <div className="id-value">{firId}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div className="status-dot" style={{ backgroundColor: 'var(--accent-color)' }}></div>
          <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)' }}>Cryptographically Signed</span>
        </div>
      </div>

      <div className="legal-status-box">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <svg style={{ width: 16, height: 16, fill: 'none', stroke: 'currentColor', strokeWidth: 2 }} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
          </svg>
          <span style={{ fontSize: 12, fontWeight: 600, letterSpacing: 1 }}>LEGAL STATUS</span>
        </div>
        <div style={{ fontSize: 18, fontWeight: 700, letterSpacing: 2 }}>ACTIVE</div>
      </div>

      <div className="card-white" style={{ width: '100%', marginBottom: '24px', textAlign: 'left', padding: '20px' }}>
        <h3 style={{ fontSize: '15px', color: 'var(--primary-color)', marginBottom: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px', fontWeight: 700 }}>Submitted Details Summary</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px', maxHeight: '250px', overflowY: 'auto', paddingRight: '4px' }}>
          <div><div style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 600, marginBottom: '2px', textTransform: 'uppercase' }}>Complainant</div> <div style={{ fontWeight: 500 }}>{firData.name || 'N/A'} (C/o {firData.father_name || 'N/A'})</div></div>
          <div><div style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 600, marginBottom: '2px', textTransform: 'uppercase' }}>Contact Info</div> <div style={{ fontWeight: 500 }}>{firData.mobile || 'N/A'}<br/>{firData.address || 'N/A'}</div></div>
          <div><div style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 600, marginBottom: '2px', textTransform: 'uppercase' }}>Incident Type</div> <div style={{ fontWeight: 500 }}>{firData.incident_type || 'N/A'}</div></div>
          <div><div style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 600, marginBottom: '2px', textTransform: 'uppercase' }}>Date & Time</div> <div style={{ fontWeight: 500 }}>{firData.date_time || 'N/A'}</div></div>
          <div><div style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 600, marginBottom: '2px', textTransform: 'uppercase' }}>Location</div> <div style={{ fontWeight: 500 }}>{firData.location?.split('|')[0] || 'N/A'}</div></div>
          <div><div style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 600, marginBottom: '2px', textTransform: 'uppercase' }}>Description</div> <div style={{ fontWeight: 500, color: 'var(--text-secondary)', lineHeight: 1.4 }}>{firData.description || 'N/A'}</div></div>
          <div><div style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 600, marginBottom: '2px', textTransform: 'uppercase' }}>Suspects & Witnesses</div> <div style={{ fontWeight: 500, color: 'var(--text-secondary)', lineHeight: 1.4 }}>Suspect: {firData.suspect || 'N/A'}<br/>Witness: {firData.witness || 'N/A'}</div></div>
        </div>
      </div>

      <button className="btn-primary" onClick={generatePDF} style={{ marginTop: 16, background: '#1e293b' }}>
        <Download size={18} /> {t('download')}
      </button>

      <div className="action-row">
        <button className="btn-outline" onClick={() => alert('Share functionality would open native share dialog.')}>
          <Share2 size={18} /> Share
        </button>
        <button className="btn-outline" onClick={() => navigate('/')}>
          <Home size={18} /> {t('home')}
        </button>
      </div>

      <p className="bottom-note" style={{ marginTop: 'auto' }}>
        {t('bottomNote')}
      </p>
    </div>
  );
}
