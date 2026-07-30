import Simulator from './pages/Simulator';
import { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Patients from './pages/Patients';

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

  const handleTabSwitch = (tab) => {
    if (tab === activeTab) return;
    setIsTransitioning(true);
    setActiveTab(tab);
    setTimeout(() => setIsTransitioning(false), 400); 
  };

  const handleLogout = async () => {
    setIsTransitioning(true);
    setTimeout(async () => {
      await supabase.auth.signOut();
      setIsTransitioning(false);
    }, 600);
  };

  if (loading) return <LoadingOverlay text="INITIALISATION..." />;
  if (!session) return <Login onLogin={() => {}} />;

  const userEmail = session.user?.email || 'CHW User';
  const username = userEmail.split('@')[0];

  if (window.location.pathname === '/simulator') {
    return <Simulator />;
  }

  return (
    <div className="wrap">
      {isTransitioning && <LoadingOverlay text="CHARGEMENT..." />}

      <aside className="sidebar">
        <div className="logo">
          <div className="logo-text">KENZA <span>H.</span></div>
        </div>

        <nav className="nav" style={{ overflowY: 'auto', paddingBottom: '20px' }}>
          <div className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => handleTabSwitch('dashboard')} style={{ transition: 'all 0.3s ease-in-out', cursor: 'pointer' }}>
            <i className="ti ti-layout-dashboard"></i>
            <span>Tableau de bord</span>
          </div>
          <div className={`nav-item ${activeTab === 'patients' ? 'active' : ''}`} onClick={() => handleTabSwitch('patients')} style={{ transition: 'all 0.3s ease-in-out', cursor: 'pointer' }}>
            <i className="ti ti-users"></i>
            <span>Patients</span>
          </div>

          {/* --- MODULES PHASE 2 (Grisés pour MVP) --- */}
          {/* Section title for future roadmap features */}
          <div style={{ marginTop: '24px', marginBottom: '8px', paddingLeft: '16px', fontSize: '11px', fontWeight: 700, color: '#A0A0A0', textTransform: 'uppercase', letterSpacing: '1px' }}>
            Modules Phase 2
          </div>
          
          <div className="nav-item" onClick={() => alert("Phase 2 : Cartographie géospatiale des épidémies en développement.")} style={{ opacity: 0.4, cursor: 'not-allowed', filter: 'grayscale(100%)' }}>
            <i className="ti ti-map-2"></i><span>Carte des épidémies</span>
          </div>
          
          <div className="nav-item" onClick={() => alert("Phase 2 : Regroupement par ménages et villages.")} style={{ opacity: 0.4, cursor: 'not-allowed', filter: 'grayscale(100%)' }}>
            <i className="ti ti-home-heart"></i><span>Ménages</span>
          </div>
          
          <div className="nav-item" onClick={() => alert("Phase 2 : Planification des visites de suivi pour les agents de santé.")} style={{ opacity: 0.4, cursor: 'not-allowed', filter: 'grayscale(100%)' }}>
            <i className="ti ti-calendar-event"></i><span>Planification</span>
          </div>
          
          <div className="nav-item" onClick={() => alert("Phase 2 : Suivi des stocks de médicaments antipaludéens.")} style={{ opacity: 0.4, cursor: 'not-allowed', filter: 'grayscale(100%)' }}>
            <i className="ti ti-first-aid-kit"></i><span>Pharmacie</span>
          </div>
          
          <div className="nav-item" onClick={() => alert("Phase 2 : Gestion du parc matériel et suivi des batteries (Arduino/Modules).")} style={{ opacity: 0.4, cursor: 'not-allowed', filter: 'grayscale(100%)' }}>
            <i className="ti ti-cpu"></i><span>Appareils</span>
          </div>
          
          <div className="nav-item" onClick={() => alert("Phase 2 : Historique de la passerelle SMS et messagerie directe.")} style={{ opacity: 0.4, cursor: 'not-allowed', filter: 'grayscale(100%)' }}>
            <i className="ti ti-message-2"></i><span>Communications</span>
          </div>
          
          <div className="nav-item" onClick={() => alert("Phase 2 : Analyses avancées et export de rapports CSV pour le district.")} style={{ opacity: 0.4, cursor: 'not-allowed', filter: 'grayscale(100%)' }}>
            <i className="ti ti-chart-bar"></i><span>Analyses</span>
          </div>
          
          <div className="nav-item" onClick={() => alert("Phase 2 : Protocoles de santé et modules de formation pour les agents.")} style={{ opacity: 0.4, cursor: 'not-allowed', filter: 'grayscale(100%)' }}>
            <i className="ti ti-book"></i><span>Formation</span>
          </div>
          
          <div className="nav-item" onClick={() => alert("Phase 2 : Configuration du système et gestion des autorisations.")} style={{ opacity: 0.4, cursor: 'not-allowed', filter: 'grayscale(100%)' }}>
            <i className="ti ti-settings"></i><span>Paramètres</span>
          </div>

          
        </nav>

        <a href="/simulator" target="_blank" rel="noopener noreferrer" className="sim-btn" style={{ textDecoration: 'none' }}>
  Simuler le module SIM800L
</a>

        <div className="sidebar-bottom">
          <div className="chw-info" style={{ justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div className="chw-avatar">{username.charAt(0).toUpperCase()}</div>
              <div>
                <div className="chw-name">{username}</div>
                <div className="chw-role">Agent de santé</div>
              </div>
            </div>
            <button onClick={handleLogout} title="Déconnexion" style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#888888', fontSize: '18px' }}><i className="ti ti-logout"></i></button>
          </div>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <div className="topbar-left">
            <div className="topbar-title">Kudo zanzan, {username} !</div>
            <div className="topbar-sub" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#22c55e', display: 'inline-block', animation: 'blink 1.5s step-start infinite' }}></span>
              Station de surveillance de Lokossa · En direct
            </div>
          </div>

          <div className="topbar-right">
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <i className="ti ti-search" style={{ position: 'absolute', left: '12px', color: '#888', fontSize: '16px' }}></i>
              <input type="text" placeholder="Rechercher..." value={globalSearch} onChange={(e) => setGlobalSearch(e.target.value)} style={{ padding: '8px 16px 8px 36px', borderRadius: '20px', border: '1px solid #EAEAEA', backgroundColor: '#F8F9FA', outline: 'none', fontSize: '13px', width: '100%', maxWidth: '200px', minWidth: '120px' }} />
            </div>

            {/* NEW: FONGBE / MINAN AUDIO BUTTON */}
            <button onClick={() => alert("Traduction Audio : Le module de synthèse vocale en Fongbé et Minan est en cours d'intégration (Phase 2).")} style={{ background: '#FFF9E6', border: '1px solid #FFD600', borderRadius: '20px', cursor: 'pointer', padding: '6px 12px', fontSize: '13px', fontWeight: 'bold', color: '#111', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <i className="ti ti-volume"></i> Audio
            </button>

            

            <button onClick={() => alert("Notifications Push en cours de développement.")} style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '24px', color: '#111' }}>
              <i className="ti ti-bell"></i>
            </button>
                
            <img src="https://ui-avatars.com/api/?name=Kenza+Health&background=FFD600&color=111&rounded=true&bold=true" alt="Profile" style={{ width: '36px', height: '36px', borderRadius: '50%', border: '2px solid #EAEAEA', cursor: 'pointer' }} />
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