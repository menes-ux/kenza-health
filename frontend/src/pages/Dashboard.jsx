import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

export default function Dashboard() {
  const [monitoredCount, setMonitoredCount] = useState(0);
  const [activeAlertsCount, setActiveAlertsCount] = useState(0);
  const [resolvedCount, setResolvedCount] = useState(0);
  const [offlineCount, setOfflineCount] = useState(0);

  const [activePatients, setActivePatients] = useState([]);
  const [actionRequiredAlerts, setActionRequiredAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Popup Toast State
  const [toast, setToast] = useState({ show: false, message: '' });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const showToast = (message) => {
    setToast({ show: true, message });
    setTimeout(() => {
      setToast({ show: false, message: '' });
    }, 3200);
  };

  const fetchDashboardData = async () => {
    setLoading(true);

    const { count: patientCount } = await supabase
      .from('patients')
      .select('*', { count: 'exact', head: true });
    setMonitoredCount(patientCount || 0);

    const { data: activeReadings, error: activeErr } = await supabase
      .from('readings')
      .select(`
        id,
        temperature,
        created_at,
        patient_id,
        patients (
          id,
          name,
          village,
          device_id
        )
      `)
      .eq('is_resolved', false)
      .order('created_at', { ascending: false });

    if (activeErr) console.error('Error fetching active readings:', activeErr);

    const activeList = activeReadings || [];
    setActiveAlertsCount(activeList.length);
    setActivePatients(activeList);
    setActionRequiredAlerts(activeList);

    const { count: resolvedCountVal } = await supabase
      .from('readings')
      .select('*', { count: 'exact', head: true })
      .eq('is_resolved', true);
    setResolvedCount(resolvedCountVal || 0);

    setOfflineCount(0);
    setLoading(false);
  };

  const handleMarkTreated = async (readingId, patientName) => {
    const { error } = await supabase
      .from('readings')
      .update({ is_resolved: true })
      .eq('id', readingId);

    if (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status.');
    } else {
      showToast(`Status updated: ${patientName} resolved`);
      fetchDashboardData();
    }
  };

  return (
    <div className="content" style={{ position: 'relative', minHeight: '100%' }}>
      
      {/* MINIMALIST DARK GRAY TOAST POPUP (BOTTOM RIGHT) */}
      {toast.show && (
        <div style={{
          position: 'fixed',
          bottom: '30px',
          right: '30px',
          zIndex: 9999,
          backgroundColor: '#2A2A2A',
          color: '#F4F4F5',
          padding: '12px 20px',
          borderRadius: '6px',
          boxShadow: '0 8px 16px rgba(0,0,0,0.15)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontSize: '13px',
          fontWeight: 500,
          animation: 'slideUp 0.3s ease-out'
        }}>
          <i className="ti ti-check" style={{ fontSize: '16px', color: '#A1CFA4' }}></i>
          <span>{toast.message}</span>
        </div>
      )}

      {/* SUMMARY CARDS */}
      <div className="summary-grid">
        <div className="s-card">
          <div className="s-card-label">Monitored</div>
          <div className="s-card-row">
            <div className="s-card-num">{monitoredCount}</div>
            <div className="s-card-icon icon-yellow">
              <i className="ti ti-activity" style={{ fontSize: '18px' }}></i>
            </div>
          </div>
        </div>

        <div className="s-card">
          <div className="s-card-label">Active Alerts</div>
          <div className="s-card-row">
            <div className="s-card-num" style={{ color: activeAlertsCount > 0 ? '#A32D2D' : '#111' }}>
              {activeAlertsCount}
            </div>
            <div className="s-card-icon icon-red">
              <i className="ti ti-alert-triangle" style={{ fontSize: '18px' }}></i>
            </div>
          </div>
        </div>

        <div className="s-card">
          <div className="s-card-label">Resolved Cases</div>
          <div className="s-card-row">
            <div className="s-card-num">{resolvedCount}</div>
            <div className="s-card-icon icon-green">
              <i className="ti ti-circle-check" style={{ fontSize: '18px' }}></i>
            </div>
          </div>
        </div>

        <div className="s-card">
          <div className="s-card-label">Offline Devices</div>
          <div className="s-card-row">
            <div className="s-card-num">{offlineCount}</div>
            <div className="s-card-icon icon-gray">
              <i className="ti ti-wifi-off" style={{ fontSize: '18px' }}></i>
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM PANELS */}
      <div className="bottom-grid">
        {/* Active Patients */}
        <div className="panel">
          <div className="panel-header">
            <div className="panel-title">Active Patients</div>
            <button className="view-all" style={{ fontSize: '12px' }}>View all</button>
          </div>

          {loading ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#666', fontSize: '13px', padding: '10px 0' }}>
               <i className="ti ti-loader" style={{ fontSize: '16px', animation: 'spin 1s linear infinite' }}></i>
               Syncing telemetry...
            </div>
          ) : activePatients.length === 0 ? (
            <p style={{ color: '#888', fontSize: '13px' }}>No active fever alerts.</p>
          ) : (
            activePatients.map((reading) => (
              <div className="patient-card" key={reading.id}>
                <div className="patient-left">
                  <div className="patient-dot dot-red">
                    <i className="ti ti-user" style={{ fontSize: '16px', color: '#A32D2D' }}></i>
                  </div>
                  <div>
                    <div className="patient-name">{reading.patients?.name || 'Unknown'}</div>
                    <div className="patient-village" style={{ fontSize: '12px' }}>
                      {reading.patients?.village || 'Lokossa'} • <span style={{ color: '#999' }}>{reading.patients?.device_id}</span>
                    </div>
                  </div>
                </div>
                <div className="patient-right">
                  <div className="patient-temp temp-red" style={{ fontSize: '14px' }}>{reading.temperature}°C</div>
                  <div className="patient-time" style={{ fontSize: '12px', color: '#888' }}>
                    {new Date(reading.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Action Required */}
        <div className="panel">
          <div className="panel-header">
            <div className="panel-title">Action Required</div>
          </div>

          {loading ? (
             <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#666', fontSize: '13px', padding: '10px 0' }}>
               <i className="ti ti-loader" style={{ fontSize: '16px', animation: 'spin 1s linear infinite' }}></i>
               Syncing telemetry...
            </div>
          ) : actionRequiredAlerts.length === 0 ? (
            <p style={{ color: '#888', fontSize: '13px' }}>All patient alerts treated!</p>
          ) : (
            actionRequiredAlerts.map((reading) => (
              <div className="alert-row" key={reading.id}>
                <div>
                  <div className="alert-name" style={{ fontSize: '14px' }}>{reading.patients?.name || 'Unknown Patient'}</div>
                  <div className="alert-detail" style={{ fontSize: '12px', color: '#888' }}>
                    {reading.temperature}°C • {new Date(reading.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
                <button
                  className="treat-btn"
                  style={{ fontSize: '12px', padding: '6px 12px', borderRadius: '4px' }}
                  onClick={() => handleMarkTreated(reading.id, reading.patients?.name || 'Patient')}
                >
                  Mark treated
                </button>
              </div>
            ))
          )}
        </div>
      </div>
      
     
      <style>{`
        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes spin {
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}