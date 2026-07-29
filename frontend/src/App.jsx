import { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Patients from './pages/Patients';

export default function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');

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

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  if (loading) {
    return (
      <div style={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#ffffff',
        color: '#111111',
        fontFamily: 'Poppins, sans-serif',
        fontWeight: 600
      }}>
        Loading Kenza Health System...
      </div>
    );
  }

  // Show Login if unauthenticated
  if (!session) {
    return <Login onLogin={() => {}} />;
  }

  const userEmail = session.user?.email || 'CHW User';
  const username = userEmail.split('@')[0];

  return (
    <div className="wrap">
      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="logo">
          <div className="logo-text">KENZA <span>H.</span></div>
        </div>

        <nav className="nav">
          <div 
            className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
            style={{ transition: 'all 0.3s ease-in-out', cursor: 'pointer' }}
          >
            <i className="ti ti-layout-dashboard"></i>
            <span>Dashboard</span>
          </div>
          <div 
            className={`nav-item ${activeTab === 'patients' ? 'active' : ''}`}
            onClick={() => setActiveTab('patients')}
            style={{ transition: 'all 0.3s ease-in-out', cursor: 'pointer' }}
          >
            <i className="ti ti-users"></i>
            <span>Patients</span>
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
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#888888',
                fontSize: '18px',
                transition: 'color 0.2s ease'
              }}
              onMouseOver={(e) => e.currentTarget.style.color = '#111'}
              onMouseOut={(e) => e.currentTarget.style.color = '#888'}
            >
              <i className="ti ti-logout"></i>
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN LAYOUT AREA */}
      <main className="main">
        {/* TOPBAR */}
        <header className="topbar">
          <div className="topbar-left">
            <div className="topbar-title">
              {activeTab === 'dashboard' ? 'Dashboard Overview' : 'Patient Records'}
            </div>
            <div className="topbar-sub">Lokossa District Monitoring Station</div>
          </div>

          <div className="topbar-right">
            {/* DUMMY SEARCH BAR AND GHOST NOTIF BOX REMOVED HERE */}

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              {/* The Bell Icon */}
              <button 
                onClick={() => alert("Feature in development (Phase 2): Push notifications currently routing via SMS gateway")} 
                style={{ 
                  background: 'transparent', 
                  border: 'none', 
                  outline: 'none', 
                  boxShadow: 'none', 
                  cursor: 'pointer', 
                  padding: 0, 
                  fontSize: '24px', 
                  color: '#111', 
                  display: 'flex', 
                  alignItems: 'center',
                  transition: 'transform 0.2s ease'
                }}
                onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                <i className="ti ti-bell"></i>
              </button>
                
              {/* The Avatar */}
              <img 
                src="https://ui-avatars.com/api/?name=Kenza+Health&background=FFD600&color=111&rounded=true&bold=true" 
                alt="Profile" 
                style={{ 
                  width: '36px', 
                  height: '36px', 
                  borderRadius: '50%', 
                  border: '2px solid #EAEAEA', 
                  cursor: 'pointer' 
                }}
              />
            </div>
          </div>
        </header>

          <div style={{ flex: 1, overflowY: 'auto' }}></div>

                  {/* PAGE CANVAS */}
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {activeTab === 'dashboard' && <Dashboard />}
            {activeTab === 'patients' && <Patients />}
          </div>
      </main>
    </div>
  );
}