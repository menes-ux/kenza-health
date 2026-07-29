import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

// This little component is only responsible for showing the live clock at the top.
// It updates itself every second, independently from the rest of the dashboard,
// so the parent component doesn't need to re-render everything just for the time.
const LiveHeader = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    // We refresh the "time" state every 1000ms (1 second) to keep the clock alive.
    const timer = setInterval(() => setTime(new Date()), 1000);
    // Cleanup function: this removes the interval when the component unmounts,
    // otherwise we would keep a "ghost" timer running in the background forever.
    return () => clearInterval(timer);
  }, []);

  // Note: the locale codes ('en-GB', 'en-US') and the timeZone ('GMT') are part
  // of the code logic, so they are left as they are, as instructed.
  const gmtDate = time.toLocaleDateString('en-GB', { timeZone: 'GMT', weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
  const gmtTime = time.toLocaleTimeString('en-US', { timeZone: 'GMT', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });

  return (
    <div style={{ marginBottom: '32px' }}>
      {/* Main title of the page, translated to French */}
      <h1 style={{ fontSize: '28px', fontWeight: '800', margin: '0 0 4px 0', color: '#111' }}>Tableau de bord</h1>
      <div style={{ fontSize: '14px', color: '#666', fontWeight: '500' }}>{gmtDate} | {gmtTime} (GMT)</div>
    </div>
  );
};

export default function Dashboard({ globalSearch = '' }) {
  // All the counters shown in the top cards are kept in local state.
  const [monitoredCount, setMonitoredCount] = useState(0);
  const [activeAlertsCount, setActiveAlertsCount] = useState(0);
  const [resolvedCount, setResolvedCount] = useState(0);
  const [offlineCount, setOfflineCount] = useState(0);
  const [activePatients, setActivePatients] = useState([]);
  


  useEffect(() => {
    // First call happens right away when the component mounts.
    fetchDashboardData();
    // Then we poll the database every 3 seconds to simulate a "live" feed.
    // This is a simple approach; a real-time subscription would be more efficient,
    // but polling is easier to reason about for now.
    const liveInterval = setInterval(() => {
      fetchDashboardData();
    }, 3000);
    return () => clearInterval(liveInterval);
  }, []);

  const fetchDashboardData = async () => {
    // Count how many patients exist in total (head: true means we only want the count,
    // not the actual rows, which is more efficient).
    const { count: patientCount } = await supabase.from('patients').select('*', { count: 'exact', head: true });
    setMonitoredCount(patientCount || 0);

    // Get every reading that is NOT resolved yet, along with some patient info.
    // The join syntax patients(name, village, device_id) pulls related data from the
    // patients table in a single query, which avoids extra round trips.
    const { data: activeReadings } = await supabase.from('readings').select('id, temperature, created_at, patients(name, village, device_id)').eq('is_resolved', false).order('created_at', { ascending: false });
    const activeList = activeReadings || [];
    setActiveAlertsCount(activeList.length);
    setActivePatients(activeList);

    // Separately, we also count how many readings have already been marked resolved.
    const { count: resolvedCountVal } = await supabase.from('readings').select('*', { count: 'exact', head: true }).eq('is_resolved', true);
    setResolvedCount(resolvedCountVal || 0);
    // Offline devices detection isn't implemented yet, so this stays at 0 for now.
    setOfflineCount(0);
    
  
  };

  // Called when a caregiver clicks the "resolve" button next to an alert.
  const handleMarkTreated = async (readingId) => {
    await supabase.from('readings').update({ is_resolved: true }).eq('id', readingId);
    // Once the update succeeds, we refetch everything so the UI reflects the change immediately.
    fetchDashboardData();
  };

  // This filters the alert list based on the global search bar (passed down as a prop).
  // We check the patient's name, village, and device id, all lower-cased so the
  // search is not case sensitive.
  const filteredActivePatients = activePatients.filter((reading) => {
    const searchTerm = globalSearch.toLowerCase();
    const patientName = reading.patients?.name?.toLowerCase() || reading.patients?.[0]?.name?.toLowerCase() || '';
    const village = reading.patients?.village?.toLowerCase() || '';
    const deviceId = reading.patients?.device_id?.toLowerCase() || '';
    return patientName.includes(searchTerm) || village.includes(searchTerm) || deviceId.includes(searchTerm);
  });

  // Small reusable style object for the round icon boxes in each stat card.
  const iconBoxStyle = { display: 'flex', alignItems: 'center', justifyContent: 'center', width: '48px', height: '48px', borderRadius: '12px', fontSize: '20px' };


  return (
    <div className="fade-in" style={{ backgroundColor: '#F8F9FA', minHeight: '100%', padding: '32px', width: '100%', boxSizing: 'border-box' }}>
      <style>{`
        @keyframes blink { 50% { opacity: 0; } }
        .blinking-degree { animation: blink 1s step-start infinite; }
      `}</style>
      
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <LiveHeader />

        {/* Grid of the four summary cards at the top of the dashboard */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '32px' }}>
          <div style={{ backgroundColor: '#FFF', padding: '20px', borderRadius: '16px', border: '1px solid #EAEAEA' }}>
            {/* Card 1: total number of patients currently being monitored */}
            <div style={{ fontSize: '14px', color: '#666', fontWeight: 600, marginBottom: '12px' }}>Patients surveillé(e)s</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
              <div style={{ fontSize: '32px', fontWeight: 800, color: '#111' }}>{monitoredCount}</div>
              <div style={{ ...iconBoxStyle, backgroundColor: '#FFF9E6', color: '#FFD600' }}><i className="ti ti-users"></i></div>
            </div>
          </div>
          <div style={{ backgroundColor: '#FFF', padding: '20px', borderRadius: '16px', border: activeAlertsCount > 0 ? '1px solid #E03131' : '1px solid #EAEAEA' }}>
            {/* Card 2: alerts that still need attention. Border turns red if count > 0 */}
            <div style={{ fontSize: '14px', color: '#666', fontWeight: 600, marginBottom: '12px' }}>Alertes actives</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
              <div style={{ fontSize: '32px', fontWeight: 800, color: activeAlertsCount > 0 ? '#E03131' : '#111' }}>{activeAlertsCount}</div>
              <div style={{ ...iconBoxStyle, backgroundColor: '#FFF0F0', color: '#E03131' }}><i className="ti ti-activity"></i></div>
            </div>
          </div>
          <div style={{ backgroundColor: '#FFF', padding: '20px', borderRadius: '16px', border: '1px solid #EAEAEA' }}>
            {/* Card 3: how many cases have already been treated / closed */}
            <div style={{ fontSize: '14px', color: '#666', fontWeight: 600, marginBottom: '12px' }}>Cas résolu(e)s</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
              <div style={{ fontSize: '32px', fontWeight: 800, color: '#111' }}>{resolvedCount}</div>
              <div style={{ ...iconBoxStyle, backgroundColor: '#FFF9E6', color: '#FFD600' }}><i className="ti ti-circle-check"></i></div>
            </div>
          </div>
          <div style={{ backgroundColor: '#FFF', padding: '20px', borderRadius: '16px', border: '1px solid #EAEAEA' }}>
            {/* Card 4: devices that stopped sending data (not implemented server side yet) */}
            <div style={{ fontSize: '14px', color: '#666', fontWeight: 600, marginBottom: '12px' }}>Appareils hors ligne</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
              <div style={{ fontSize: '32px', fontWeight: 800, color: '#999' }}>{offlineCount}</div>
              <div style={{ ...iconBoxStyle, backgroundColor: '#F4F4F5', color: '#A0A0A0' }}><i className="ti ti-wifi-off"></i></div>
            </div>
          </div>
        </div>

        {/* Bottom panel: the live log of alerts that still require an action */}
        <div style={{ backgroundColor: '#FFF', padding: '24px', borderRadius: '16px', border: '1px solid #EAEAEA', color: '#111' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', borderBottom: '1px solid #F0F0F0', paddingBottom: '12px' }}>
            <h2 style={{ fontSize: '15px', fontWeight: 700, margin: 0, color: '#111', textTransform: 'uppercase', letterSpacing: '-0.5px' }}>
              Action requise / Journal
            </h2>
            {/* LOCAL SEARCH BAR  */}
          </div>

          {filteredActivePatients.length === 0 ? (
            // Empty state, shown when the search filter doesn't match anything
            <div style={{ padding: '10px 0', color: '#888', fontSize: '13px', fontFamily: 'monospace' }}>&gt; Aucune alerte active ne correspond à votre recherche.</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {/* We loop through every active (unresolved) reading and render one row each */}
              {filteredActivePatients.map((reading) => (
                <div key={reading.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', borderRadius: '8px', borderBottom: '1px solid #F8F9FA', fontFamily: 'monospace', fontSize: '14px' }}>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1 }}>
                    {/* "ALERTE" is kept exactly as requested (Kudo zanzan exception) */}
                    <div style={{ color: '#E03131', fontWeight: 'bold' }}>● ALERTE</div>
                    <div style={{ color: '#666' }}>
                      {new Date(reading.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </div>
                    {/* Fallback chain: patients can come back either as an object or an array
                        depending on how Supabase resolves the join, so we handle both cases. */}
                    <div style={{ color: '#111', fontWeight: 600 }}>{reading.patients?.name || reading.patients?.[0]?.name || 'Inconnu(e)'}</div>
                    <div style={{ color: '#888' }}>{reading.patients?.device_id}</div>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                    <div style={{ color: '#E03131', fontWeight: 800, fontSize: '16px' }}>
                      {/* The little degree symbol keeps blinking thanks to the CSS animation above */}
                      {Number(reading.temperature).toFixed(1)}<span className="blinking-degree">°</span>C
                    </div>
                    <button onClick={() => handleMarkTreated(reading.id)} style={{ backgroundColor: '#FFF', color: '#111', border: '1px solid #CCC', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', fontFamily: 'monospace', fontWeight: 'bold', cursor: 'pointer', transition: 'background 0.2s' }}>
                      RÉSOUDRE
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