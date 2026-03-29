import React, { useState } from 'react';
import BottomNav from '../components/BottomNav';
import { TrendingUp, FileText, User, BarChart } from 'lucide-react';

export default function AnalyticsScreen() {
  const [activeTab, setActiveTab] = useState('weekly');

  return (
    <div className="analytics-screen">
      <div className="analytics-header">
        <div className="analytics-logo">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 22h14a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v4"></path>
            <path d="M14 2v4a2 2 0 0 0 2 2h4"></path>
            <path d="m3 15 2 2 4-4"></path>
          </svg>
          Civic Guardian
        </div>
        <div className="profile-icon" style={{ backgroundColor: '#1e293b', color: '#fcd34d' }}>
          <User size={18} />
        </div>
      </div>

      <div className="analytics-content">
        <h1 className="page-title">Reporting Analytics</h1>

        <div className="toggle-bg">
          <button 
            className={`toggle-btn ${activeTab === 'weekly' ? 'active' : ''}`}
            onClick={() => setActiveTab('weekly')}
          >
            Weekly
          </button>
          <button 
            className={`toggle-btn ${activeTab === 'monthly' ? 'active' : ''}`}
            onClick={() => setActiveTab('monthly')}
          >
            Monthly
          </button>
        </div>

        <div className="card-white">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div className="analytic-label" style={{ marginBottom: 4 }}>FIR FILES REGISTERED</div>
              <div className="analytic-value" style={{ fontSize: 24 }}>128 Total</div>
            </div>
            <div className="trend-badge">
              <TrendingUp size={12} /> +15%
            </div>
          </div>

          <div className="bar-chart">
            {/* Mock chart data */}
            {[
              { day: 'MON', h: '40%' },
              { day: 'TUE', h: '65%' },
              { day: 'WED', h: '35%' },
              { day: 'THU', h: '100%', active: true },
              { day: 'FRI', h: '70%' },
              { day: 'SAT', h: '55%' },
              { day: 'SUN', h: '80%' }
            ].map(col => (
               <div className="bar-col" key={col.day}>
                <div 
                  className={`bar-fill ${col.active ? 'active' : ''}`} 
                  style={{ height: col.h }} 
                ></div>
                <div className="bar-label">{col.day}</div>
               </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 16 }}>
          <div className="card-light">
            <div className="analytic-label">AVG. DAILY</div>
            <div className="analytic-value">18.2</div>
            <div className="progress-bar-container">
               <div className="progress-bar-fill" style={{ width: '60%' }}></div>
            </div>
          </div>
          <div className="card-light">
            <div className="analytic-label">PEAK DAY</div>
            <div className="analytic-value">Thursday</div>
            <div className="analytic-label" style={{ marginTop: 4, color: '#475569' }}>24 filings</div>
          </div>
        </div>

        <div className="card-blue">
          <div>
            <div className="analytic-label" style={{ color: '#93c5fd' }}>TOTAL FIRS THIS MONTH</div>
            <div className="analytic-value" style={{ color: 'white', fontSize: 32 }}>492</div>
          </div>
          <div className="icon-box-blue">
            <FileText size={24} color="white" />
          </div>
        </div>

        <div className="card-white">
          <div className="trends-row">
            <div className="icon-box-green">
              <BarChart size={20} />
            </div>
            <div className="trends-title">Recent Trends</div>
          </div>
          <p className="trends-text">
            Reports are up <strong>15%</strong> compared to last week. The volume of digital submissions via mobile has increased by <strong>22%</strong>, reducing average processing time significantly.
          </p>
          <div className="efficiency-row">
             <div className="efficiency-label">Efficiency Score</div>
             <div className="efficiency-score">94/100</div>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
