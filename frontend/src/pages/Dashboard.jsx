export default function Dashboard() {
  return (
    <div className="content">
      <div className="summary-grid">
        <div className="s-card">
          <div className="s-card-label">Monitored</div>
          <div className="s-card-row">
            <div className="s-card-num">24</div>
            <div className="s-card-icon icon-yellow"><i className="ti ti-heart-rate-monitor"></i></div>
          </div>
        </div>
        <div className="s-card">
          <div className="s-card-label">Active alerts</div>
          <div className="s-card-row">
            <div className="s-card-num" style={{ color: '#A32D2D' }}>3</div>
            <div className="s-card-icon icon-red"><i className="ti ti-alert-triangle"></i></div>
          </div>
        </div>
        <div className="s-card">
          <div className="s-card-label">Resolved today</div>
          <div className="s-card-row">
            <div className="s-card-num" style={{ color: '#3B6D11' }}>7</div>
            <div className="s-card-icon icon-green"><i className="ti ti-circle-check"></i></div>
          </div>
        </div>
        <div className="s-card">
          <div className="s-card-label">Offline devices</div>
          <div className="s-card-row">
            <div className="s-card-num" style={{ color: '#5F5E5A' }}>1</div>
            <div className="s-card-icon icon-gray"><i className="ti ti-wifi-off"></i></div>
          </div>
        </div>
      </div>

      <div className="bottom-grid">
        <div className="panel">
          <div className="panel-header">
            <div className="panel-title">Active patients</div>
            <div className="view-all">View all</div>
          </div>
          <div className="patient-card">
            <div className="patient-left">
              <div className="patient-dot dot-red"></div>
              <div>
                <div className="patient-name">Kofi Mensah</div>
                <div className="patient-village">Lokossa · WB-102</div>
              </div>
            </div>
            <div className="patient-right">
              <div className="patient-temp temp-red">39.1°C</div>
              <div className="patient-time">02:34 AM</div>
            </div>
          </div>
          <div className="patient-card">
            <div className="patient-left">
              <div className="patient-dot dot-red"></div>
              <div>
                <div className="patient-name">Amara Dossou</div>
                <div className="patient-village">Lokossa · WB-104</div>
              </div>
            </div>
            <div className="patient-right">
              <div className="patient-temp temp-red">38.7°C</div>
              <div className="patient-time">01:58 AM</div>
            </div>
          </div>
          <div className="patient-card">
            <div className="patient-left">
              <div className="patient-dot dot-green"></div>
              <div>
                <div className="patient-name">Brice Ahounou</div>
                <div className="patient-village">Comè · WB-101</div>
              </div>
            </div>
            <div className="patient-right">
              <div className="patient-temp temp-green">37.1°C</div>
              <div className="patient-time">02:30 AM</div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="panel">
            <div className="panel-header">
              <div className="panel-title">Alerts this week</div>
            </div>
            <div className="chart-bars">
              <div className="bar-wrap"><div className="bar" style={{ height: '40%', background: '#FFD600' }}></div><div className="bar-label">Mon</div></div>
              <div className="bar-wrap"><div className="bar" style={{ height: '60%', background: '#FFD600' }}></div><div className="bar-label">Tue</div></div>
              <div className="bar-wrap"><div className="bar" style={{ height: '30%', background: '#FFD600' }}></div><div className="bar-label">Wed</div></div>
              <div className="bar-wrap"><div className="bar" style={{ height: '80%', background: '#E24B4A' }}></div><div className="bar-label">Thu</div></div>
              <div className="bar-wrap"><div className="bar" style={{ height: '50%', background: '#FFD600' }}></div><div className="bar-label">Fri</div></div>
              <div className="bar-wrap"><div className="bar" style={{ height: '70%', background: '#E24B4A' }}></div><div className="bar-label">Sat</div></div>
              <div className="bar-wrap"><div className="bar" style={{ height: '90%', background: '#E24B4A' }}></div><div className="bar-label">Sun</div></div>
            </div>
          </div>

          <div className="panel">
            <div className="panel-header">
              <div className="panel-title">Recent alerts</div>
            </div>
            <div className="alert-row">
              <div>
                <div className="alert-name">Kofi Mensah</div>
                <div className="alert-detail">39.1°C · 02:34 AM</div>
              </div>
              <button className="treat-btn">Mark treated</button>
            </div>
            <div className="alert-row">
              <div>
                <div className="alert-name">Amara Dossou</div>
                <div className="alert-detail">38.7°C · 01:58 AM</div>
              </div>
              <button className="treat-btn">Mark treated</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}