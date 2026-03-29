import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LayoutGrid, FileText, Bell, User, BarChart2 } from 'lucide-react';

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const currentPath = location.pathname;

  return (
    <div className="bottom-nav">
      <button 
        className={`nav-item ${currentPath === '/analytics' ? 'active' : ''}`}
        onClick={() => navigate('/analytics')}
      >
        <LayoutGrid className="nav-icon" />
        <span className="nav-label">Dashboard</span>
      </button>

      <button 
        className={`nav-item ${currentPath === '/' ? 'active' : ''}`}
        onClick={() => navigate('/')}
      >
        <FileText className="nav-icon" />
        <span className="nav-label">Reports</span>
      </button>

      <button 
        className={`nav-item ${currentPath === '/alerts' ? 'active' : ''}`}
        onClick={() => navigate('/alerts')}
      >
        <Bell className="nav-icon" />
        <span className="nav-label">Alerts</span>
      </button>

      <button 
        className={`nav-item ${currentPath === '/subdivision' ? 'active' : ''}`}
        onClick={() => navigate('/subdivision')}
      >
        <BarChart2 className="nav-icon" />
        <span className="nav-label">Cases</span>
      </button>

      <button 
        className={`nav-item ${currentPath === '/profile' ? 'active' : ''}`}
        onClick={() => navigate('/profile')}
      >
        <User className="nav-icon" />
        <span className="nav-label">Profile</span>
      </button>
    </div>
  );
}
