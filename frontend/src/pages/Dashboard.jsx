import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

const LiveHeader = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const gmtDate = time.toLocaleDateString('en-GB', { timeZone: 'GMT', weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
  const gmtTime = time.toLocaleTimeString('en-US', { timeZone: 'GMT', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });

  return (
    <div style={{ marginBottom: '32px' }}>
      <h1 style={{ fontSize: '28px', fontWeight: '800', margin: '0 0 4px 0', color: '#111' }}>Dashboard</h1>
      <div style={{ fontSize: '14px', color: '#666', fontWeight: '500' }}>{gmtDate} | {gmtTime} (GMT)</div>
    </div>
  );
};

export default function Dashboard() {
  const [monitoredCount, setMonitoredCount] = useState(0);
  const [activeAlertsCount, setActiveAlertsCount] = useState(0);
  const [resolvedCount, setResolvedCount] = useState(0);
  const [offlineCount, setOfflineCount] = useState(0);
  const [activePatients, setActivePatients] = useState([]);
  
  // New States for Search and Initial Load
  const [initialLoad, setInitialLoad] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    // 1. Fetch immediately on load
    fetchDashboardData();
    
    // 2. Set up the LIVE Polling every 3 seconds (Silent background update)
    const liveInterval = setInterval(() => {
      fetchDashboardData();
    }, 3000);

    return () => clearInterval(liveInterval);
  }, []);

  const fetchDashboardData = async () => {
    const { count: patientCount } = await supabase.from('patients').select('*', { count: 'exact', head: true });
    setMonitoredCount(patientCount || 0);

    const { data: activeReadings } = await supabase.from('readings').select('id, temperature, created_at, patients(name, village, device_id)').eq('is_resolved', false).order('created_at', { ascending: false });
    const activeList = activeReadings || [];
    setActiveAlertsCount(activeList.length);
    setActivePatients(activeList);

    const { count: resolvedCountVal } = await supabase.from('readings').select('*', { count: 'exact', head: true }).eq('is_resolved', true);
    setResolvedCount(resolvedCountVal || 0);
    setOfflineCount(0);
    
    // Turn off the full-screen spinner after the first data pull
    setInitialLoad(false);
  };

  const handleMarkTreated = async (readingId) => {
    await supabase.from('readings').update({ is_resolved: true }).eq('id', readingId);
    fetchDashboardData();
  };

  // The Search Filter Logic
  const filteredActivePatients = activePatients.filter((reading) => {
    const searchTerm = search.toLowerCase();
    const patientName = reading.patients?.name?.toLowerCase() || '';
    const village = reading.patients?.village?.toLowerCase() || '';
    const deviceId = reading.patients?.device_id?.toLowerCase() || '';
    return patientName.includes(searchTerm) || village.includes(searchTerm) || deviceId.includes(searchTerm);
  });

  const iconBoxStyle = { display: 'flex', alignItems: 'center', justifyContent: 'center', width: '48px', height: '48px', borderRadius: '12px', fontSize: '20px' };

 // --- THE FULL-SCREEN YELLOW SPINNER OVERLAY ---
  if (initialLoad) {
    return (
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F8F9FA' }}>
        <style>{`
          @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
          .yellow-spinner { border: 4px solid rgba(255, 214, 0, 0.2); width: 48px; height: 48px; border-radius: 50%; border-left-color: #FFD600; animation: spin 0.4s linear infinite; }
        `}</style>
        <div className="yellow-spinner"></div>
        <div style={{ marginTop: '16px', fontSize: '14px', color: '#111', fontWeight: 700, letterSpacing: '1px' }}>LOADING...</div>
      </div>
    );
  }

  return (
    <div className="fade-in" style={{ backgroundColor: '#F8F9FA', minHeight: '100vh', padding: '32px', width: '100%', boxSizing: 'border-box' }}>
      <style>{`
        @keyframes blink { 50% { opacity: 0; } }
        .blinking-degree { animation: blink 1s step-start infinite; }
      `}</style>
      
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <LiveHeader />

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '32px' }}>
          <div style={{ backgroundColor: '#FFF', padding: '20px', borderRadius: '16px', border: '1px solid #EAEAEA' }}>
            <div style={{ fontSize: '14px', color: '#666', fontWeight: 600, marginBottom: '12px' }}>Monitored Patients</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
              <div style={{ fontSize: '32px', fontWeight: 800, color: '#111' }}>{monitoredCount}</div>
              <div style={{ ...iconBoxStyle, backgroundColor: '#FFF9E6', color: '#FFD600' }}><i className="ti ti-users"></i></div>
            </div>
          </div>
          <div style={{ backgroundColor: '#FFF', padding: '20px', borderRadius: '16px', border: activeAlertsCount > 0 ? '1px solid #E03131' : '1px solid #EAEAEA' }}>
            <div style={{ fontSize: '14px', color: '#666', fontWeight: 600, marginBottom: '12px' }}>Active Alerts</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
              <div style={{ fontSize: '32px', fontWeight: 800, color: activeAlertsCount > 0 ? '#E03131' : '#111' }}>{activeAlertsCount}</div>
              <div style={{ ...iconBoxStyle, backgroundColor: '#FFF0F0', color: '#E03131' }}><i className="ti ti-activity"></i></div>
            </div>
          </div>
          <div style={{ backgroundColor: '#FFF', padding: '20px', borderRadius: '16px', border: '1px solid #EAEAEA' }}>
            <div style={{ fontSize: '14px', color: '#666', fontWeight: 600, marginBottom: '12px' }}>Resolved Cases</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
              <div style={{ fontSize: '32px', fontWeight: 800, color: '#111' }}>{resolvedCount}</div>
              <div style={{ ...iconBoxStyle, backgroundColor: '#FFF9E6', color: '#FFD600' }}><i className="ti ti-circle-check"></i></div>
            </div>
          </div>
          <div style={{ backgroundColor: '#FFF', padding: '20px', borderRadius: '16px', border: '1px solid #EAEAEA' }}>
            <div style={{ fontSize: '14px', color: '#666', fontWeight: 600, marginBottom: '12px' }}>Offline Devices</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
              <div style={{ fontSize: '32px', fontWeight: 800, color: '#999' }}>{offlineCount}</div>
              <div style={{ ...iconBoxStyle, backgroundColor: '#F4F4F5', color: '#A0A0A0' }}><i className="ti ti-wifi-off"></i></div>
            </div>
          </div>
        </div>

        <div style={{ backgroundColor: '#FFF', padding: '24px', borderRadius: '16px', border: '1px solid #EAEAEA', color: '#111' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', borderBottom: '1px solid #F0F0F0', paddingBottom: '12px' }}>
            <h2 style={{ fontSize: '15px', fontWeight: 700, margin: 0, color: '#111', textTransform: 'uppercase', letterSpacing: '-0.5px' }}>
              Action Required / Log
            </h2>
            
            {/* THE WORKING SEARCH BAR */}
            <input
              type="text"
              placeholder="Search alerts..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ padding: '8px 14px', borderRadius: '6px', border: '1px solid #DDD', fontSize: '13px', width: '220px', outline: 'none', fontFamily: 'monospace' }}
            />
          </div>

          {filteredActivePatients.length === 0 ? (
            <div style={{ padding: '10px 0', color: '#888', fontSize: '13px', fontFamily: 'monospace' }}>&gt; No active alerts match your search.</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', maxHeight: '400px', overflowY: 'auto', paddingRight: '8px' }}>
              {filteredActivePatients.map((reading) => (
                <div key={reading.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', borderRadius: '8px', borderBottom: '1px solid #F8F9FA', fontFamily: 'monospace', fontSize: '14px' }}>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1 }}>
                    <div style={{ color: '#E03131', fontWeight: 'bold' }}>● ALERTE</div>
                    <div style={{ color: '#666' }}>
                      {new Date(reading.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </div>
                    <div style={{ color: '#111', fontWeight: 600 }}>{reading.patients?.name || 'Unknown'}</div>
                    <div style={{ color: '#888' }}>{reading.patients?.device_id}</div>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                    <div style={{ color: '#E03131', fontWeight: 800, fontSize: '16px' }}>
                      {/* FIXING THE DECIMALS HERE */}
                      {Number(reading.temperature).toFixed(1)}<span className="blinking-degree">°</span>C
                    </div>
                    <button onClick={() => handleMarkTreated(reading.id)} style={{ backgroundColor: '#FFF', color: '#111', border: '1px solid #CCC', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', fontFamily: 'monospace', fontWeight: 'bold', cursor: 'pointer', transition: 'background 0.2s' }}>
                      RESOLVE
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}