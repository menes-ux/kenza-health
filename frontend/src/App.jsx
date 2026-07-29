import { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Patients from './pages/Patients';

// --- THE REUSABLE GLOBAL SPINNER ---
const LoadingOverlay = ({ text }) => (
  <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F8F9FA' }}>
    <style>{`
      @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
      .yellow-spinner { border: 4px solid rgba(255, 214, 0, 0.2); width: 48px; height: 48px; border-radius: 50%; border-left-color: #FFD600; animation: spin 0.4s linear infinite; }
    `}</style>
    <div className="yellow-spinner"></div>
    <div style={{ marginTop: '16px', fontSize: '14px', color: '#111', fontWeight: 700, letterSpacing: '1px' }}>{text}</div>
  </div>
);

export default function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [globalSearch, setGlobalSearch] = useState('');
  
  // NEW: Transition state for tab switching and logging out
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // NEW: Smooth tab switching logic
  const handleTabSwitch = (tab) => {
    if (tab === activeTab) return;
    setIsTransitioning(true);
    setActiveTab(tab);
    // Fake a 400ms load time for a professional feel
    setTimeout(() => setIsTransitioning(false), 400); 
  };

  // NEW: Smooth logout logic
  const handleLogout = async () => {
    setIsTransitioning(true);
    setTimeout(async () => {
      await supabase.auth.signOut();
      setIsTransitioning(false);
    }, 600);
  };

  if (loading) {
    return <LoadingOverlay text="INITIALIZATION..." />;
  }

  if (!session) {
    return <Login onLogin={() => {}} />;
  }

  const userEmail = session.user?.email || 'CHW User';
  const username = userEmail.split('@')[0];

  return (
    <div className="wrap">
      {/* Show the overlay if we are transitioning between pages */}
      {isTransitioning && <LoadingOverlay text="LOADING..." />}

      <aside className="sidebar">
        <div className="logo">
          <div className="logo-text">KENZA <span>H.</span></div>
        </div>

        <nav className="nav" style={{ overflowY: 'auto', paddingBottom: '20px' }}>
          {/* --- ACTIVE MVP TABS --- */}
          <div 
            className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => handleTabSwitch('dashboard')}
            style={{ transition: 'all 0.3s ease-in-out', cursor: 'pointer' }}
          >
            <i className="ti ti-layout-dashboard"></i>
            <span>Dashboard</span>
          </div>
          <div 
            className={`nav-item ${activeTab === 'patients' ? 'active' : ''}`}
            onClick={() => handleTabSwitch('patients')}
            style={{ transition: 'all 0.3s ease-in-out', cursor: 'pointer' }}
          >
            <i className="ti ti-users"></i>
            <span>Patients</span>
          </div>

          {/* --- PHASE 2 TABS (GRAYED OUT) --- */}
          <div style={{ marginTop: '24px', marginBottom: '8px', paddingLeft: '16px', fontSize: '11px', fontWeight: 700, color: '#A0A0A0', textTransform: 'uppercase', letterSpacing: '1px' }}>
            Phase 2 Modules
          </div>
          
          <div 
            className="nav-item"
            onClick={() => alert("Phase 2: Geospatial Malaria Outbreak Mapping module is under development.")}
            style={{ opacity: 0.4, cursor: 'not-allowed', filter: 'grayscale(100%)' }}
          >
            <i className="ti ti-map-2"></i>
            <span>Outbreak Map</span>
          </div>

          <div 
            className="nav-item"
            onClick={() => alert("Phase 2: Household and compound grouping features.")}
            style={{ opacity: 0.4, cursor: 'not-allowed', filter: 'grayscale(100%)' }}
          >
            <i className="ti ti-home-heart"></i>
            <span>Households</span>
          </div>

          <div 
            className="nav-item"
            onClick={() => alert("Phase 2: Follow-up visit scheduling and calendar integration.")}
            style={{ opacity: 0.4, cursor: 'not-allowed', filter: 'grayscale(100%)' }}
          >
            <i className="ti ti-calendar-event"></i>
            <span>Scheduling</span>
          </div>

          <div 
            className="nav-item"
            onClick={() => alert("Phase 2: Antimalarial medication and inventory tracking.")}
            style={{ opacity: 0.4, cursor: 'not-allowed', filter: 'grayscale(100%)' }}
          >
            <i className="ti ti-first-aid-kit"></i>
            <span>Pharmacy</span>
          </div>

          <div 
            className="nav-item"
            onClick={() => alert("Phase 2: Hardware fleet management and battery monitoring.")}
            style={{ opacity: 0.4, cursor: 'not-allowed', filter: 'grayscale(100%)' }}
          >
            <i className="ti ti-cpu"></i>
            <span>Devices</span>
          </div>

          <div 
            className="nav-item"
            onClick={() => alert("Phase 2: Two-way SMS gateway logs and clinic communications.")}
            style={{ opacity: 0.4, cursor: 'not-allowed', filter: 'grayscale(100%)' }}
          >
            <i className="ti ti-message-2"></i>
            <span>Communications</span>
          </div>

          <div 
            className="nav-item"
            onClick={() => alert("Phase 2: Advanced analytics and CSV report generation.")}
            style={{ opacity: 0.4, cursor: 'not-allowed', filter: 'grayscale(100%)' }}
          >
            <i className="ti ti-chart-bar"></i>
            <span>Analytics</span>
          </div>

          <div 
            className="nav-item"
            onClick={() => alert("Phase 2: Standardized health protocols and CHW training resources.")}
            style={{ opacity: 0.4, cursor: 'not-allowed', filter: 'grayscale(100%)' }}
          >
            <i className="ti ti-book"></i>
            <span>Training Hub</span>
          </div>

          <div 
            className="nav-item"
            onClick={() => alert("Phase 2: System configuration and user management.")}
            style={{ opacity: 0.4, cursor: 'not-allowed', filter: 'grayscale(100%)' }}
          >
            <i className="ti ti-settings"></i>
            <span>Settings</span>
          </div>
        </nav>

        <div className="sidebar-bottom">
          <div className="chw-info" style={{ justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div className="chw-avatar">{username.charAt(0).toUpperCase()}</div>
              <div>
                <div className="chw-name">{username}</div>
                <div className="chw-role">Health Officer</div>
              </div>
            </div>
            <button 
              onClick={handleLogout} 
              title="Sign out"
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#888888', fontSize: '18px', transition: 'color 0.2s ease' }}
              onMouseOver={(e) => e.currentTarget.style.color = '#111'}
              onMouseOut={(e) => e.currentTarget.style.color = '#888'}
            >
              <i className="ti ti-logout"></i>
            </button>
          </div>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <div className="topbar-left">
            <div className="topbar-title">
              Kudo zanzan, {username}!
            </div>
            <div className="topbar-sub" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#22c55e', display: 'inline-block', animation: 'blink 1.5s step-start infinite' }}></span>
              Lokossa District Monitoring Station · Live
            </div>
          </div>

          <div className="topbar-right" style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <i className="ti ti-search" style={{ position: 'absolute', left: '12px', color: '#888', fontSize: '16px' }}></i>
              <input 
                type="text" 
                placeholder="Search database..." 
                value={globalSearch}
                onChange={(e) => setGlobalSearch(e.target.value)}
                style={{ 
                  padding: '8px 16px 8px 36px', borderRadius: '20px', border: '1px solid #EAEAEA', 
                  backgroundColor: '#F8F9FA', outline: 'none', fontSize: '13px', width: '220px' 
                }} 
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <button 
                onClick={() => alert("Feature in development (Phase 2): Push notifications currently routing via SMS gateway")} 
                style={{ background: 'transparent', border: 'none', outline: 'none', boxShadow: 'none', cursor: 'pointer', padding: 0, fontSize: '24px', color: '#111', display: 'flex', alignItems: 'center', transition: 'transform 0.2s ease' }}
                onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                <i className="ti ti-bell"></i>
              </button>
                
              <img 
                src="https://ui-avatars.com/api/?name=Kenza+Health&background=FFD600&color=111&rounded=true&bold=true" 
                alt="Profile" 
                style={{ width: '36px', height: '36px', borderRadius: '50%', border: '2px solid #EAEAEA', cursor: 'pointer' }}
              />
            </div>
          </div>
        </header>

        <div style={{ flex: 1, overflowY: 'auto' }}>
          {activeTab === 'dashboard' && <Dashboard globalSearch={globalSearch} />}
          {activeTab === 'patients' && <Patients globalSearch={globalSearch} />}
        </div>
      </main>
    </div>
  );
}