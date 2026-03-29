import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import LanguageSelection from './screens/LanguageSelection';
import ChatScreen from './screens/ChatScreen';
import ReviewScreen from './screens/ReviewScreen';
import SuccessScreen from './screens/SuccessScreen';
import AnalyticsScreen from './screens/AnalyticsScreen';
import ProfileScreen from './screens/ProfileScreen';
import AlertsScreen from './screens/AlertsScreen';
import SplashScreen from './screens/SplashScreen';
import SubdivisionScreen from './screens/SubdivisionScreen';

// A layout wrapper that mimicks a mobile app shell
const AppShell = ({ children }) => {
  return (
    <div className="screen-container">
      {children}
    </div>
  );
};

function App() {
  const [showSplash, setShowSplash] = useState(true);

  const [firData, setFirData] = useState({
    name: "",
    father_name: "",
    mobile: "",
    address: "",
    incident_type: "",
    date_time: "",
    location: "",
    description: "",
    suspect: "",
    witness: ""
  });

  if (showSplash) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />;
  }

  return (
    <LanguageProvider>
      <Router>
        <AppShell>
          <Routes>
            <Route path="/" element={<LanguageSelection />} />
            <Route path="/chat" element={<ChatScreen firData={firData} setFirData={setFirData} />} />
            <Route path="/review" element={<ReviewScreen firData={firData} setFirData={setFirData} />} />
            <Route path="/success" element={<SuccessScreen />} />
            <Route path="/analytics" element={<AnalyticsScreen />} />
            <Route path="/subdivision" element={<SubdivisionScreen />} />
            <Route path="/profile" element={<ProfileScreen onLogout={() => alert('Logout disabled in demo mode')} />} />
            <Route path="/alerts" element={<AlertsScreen />} />
          </Routes>
        </AppShell>
      </Router>
    </LanguageProvider>
  );
}

export default App;
