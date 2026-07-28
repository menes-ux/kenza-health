import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

export default function Dashboard() {
  const [alerts, setAlerts] = useState([]);
  const [stats, setStats] = useState({ monitored: 0, active: 0, resolved: 0 });

  // This runs automatically when the dashboard loads
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    // 1. Get total number of monitored patients
    const { count: monitoredCount } = await supabase
      .from('patients')
      .select('*', { count: 'exact', head: true });

    // 2. Get active fever alerts (and attach the patient's name/village)
    const { data: activeAlerts } = await supabase
      .from('readings')
      .select('*, patients(name, village)')
      .eq('is_alert', true)
      .eq('is_resolved', false)
      .order('recorded_at', { ascending: false });

    // 3. Get total resolved cases
    const { count: resolvedCount } = await supabase
      .from('readings')
      .select('*', { count: 'exact', head: true })
      .eq('is_alert', true)
      .eq('is_resolved', true);

    setStats({
      monitored: monitoredCount || 0,
      active: activeAlerts?.length || 0,
      resolved: resolvedCount || 0
    });
    setAlerts(activeAlerts || []);
  };

  // 4. Function to mark a case as treated and instantly refresh the UI
  const markTreated = async (readingId) => {
    await supabase
      .from('readings')
      .update({ is_resolved: true })
      .eq('id', readingId);
      
    fetchDashboardData(); // Refresh the screen instantly!
  };

  // Helper to format the timestamp into AM/PM
  const formatTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="content">
      {/* Top Stats Row */}
      <div className="summary-grid">
        <div className="s-card">
          <div className="s-card-label">Monitored</div>
          <div className="s-card-row">
            <div className="s-card-num">{stats.monitored}</div>
            <div className="s-card-icon icon-yellow"><i className="ti ti-activity"></i></div>
          </div>
        </div>
        <div className="s-card">
          <div className="s-card-label">Active Alerts</div>
          <div className="s-card-row">
            <div className="s-card-num" style={{ color: '#A32D2D' }}>{stats.active}</div>
            <div className="s-card-icon icon-red"><i className="ti ti-alert-triangle"></i></div>
          </div>
        </div>
        <div className="s-card">
          <div className="s-card-label">Resolved Today</div>
          <div className="s-card-row">
            <div className="s-card-num" style={{ color: '#3B6D11' }}>{stats.resolved}</div>
            <div className="s-card-icon icon-green"><i className="ti ti-circle-check"></i></div>
          </div>
        </div>
        <div className="s-card">
          <div className="s-card-label">Offline Devices</div>
          <div className="s-card-row">
            <div className="s-card-num">0</div>
            <div className="s-card-icon icon-gray"><i className="ti ti-wifi-off"></i></div>
          </div>
        </div>
      </div>

      {/* Bottom Grid for Lists */}
      <div className="bottom-grid">
        <div className="panel">
          <div className="panel-header">
            <div className="panel-title">Active Patients</div>
            <div className="view-all">View all</div>
          </div>
          {alerts.length === 0 ? (
            <p style={{ fontSize: '13px', color: '#888' }}>No active alerts. All clear!</p>
          ) : (
            alerts.map((alert) => (
              <div className="patient-card" key={alert.id}>
                <div className="patient-left">
                  <div className="patient-dot dot-red"></div>
                  <div>
                    <div className="patient-name">{alert.patients?.name}</div>
                    <div className="patient-village">{alert.patients?.village}</div>
                  </div>
                </div>
                <div className="patient-right">
                  <div className="patient-temp temp-red">{alert.temperature}°C</div>
                  <div className="patient-time">{formatTime(alert.recorded_at)}</div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="panel">
          <div className="panel-header">
            <div className="panel-title">Action Required</div>
          </div>
          {alerts.length === 0 ? (
            <p style={{ fontSize: '13px', color: '#888' }}>No pending actions.</p>
          ) : (
            alerts.map((alert) => (
              <div className="alert-row" key={alert.id}>
                <div>
                  <div className="alert-name">{alert.patients?.name}</div>
                  <div className="alert-detail">{alert.temperature}°C • {formatTime(alert.recorded_at)}</div>
                </div>
                <button onClick={() => markTreated(alert.id)} className="treat-btn">
                  Mark treated
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}