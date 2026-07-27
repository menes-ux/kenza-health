export default function Sidebar() {
  return (
    <div className="sidebar">
      <div className="logo">
        <div className="logo-text">KENZA <span>H.</span></div>
        <div style={{ fontSize: '10px', color: '#555', marginTop: '2px' }}>Malaria monitoring</div>
      </div>
      <div className="nav">
        <div className="nav-item active"><i className="ti ti-layout-dashboard" aria-hidden="true"></i> Dashboard</div>
        <div className="nav-item"><i className="ti ti-users" aria-hidden="true"></i> Patients</div>
        <div className="nav-item"><i className="ti ti-bell" aria-hidden="true"></i> Alerts</div>
        <div className="nav-item"><i className="ti ti-chart-bar" aria-hidden="true"></i> Reports</div>
        <div className="nav-item"><i className="ti ti-settings" aria-hidden="true"></i> Settings</div>
      </div>
      <div className="sidebar-bottom">
        <div className="chw-info">
          <div className="chw-avatar">MK</div>
          <div>
            <div className="chw-name">Marie Koudjo</div>
            <div className="chw-role">CHW · Lokossa</div>
          </div>
        </div>
      </div>
    </div>
  );
}