import { Link, useLocation } from 'react-router-dom';

export default function Sidebar() {
  const location = useLocation();

  // Helper function to check if a path is active
  const isActive = (path) => location.pathname === path ? "nav-item active" : "nav-item";

  return (
    <div className="sidebar">
      <div className="logo">
        <div className="logo-text">KENZA <span>H.</span></div>
        <div style={{ fontSize: '10px', color: '#555', marginTop: '2px' }}>Malaria monitoring</div>
      </div>
      <div className="nav">
        <Link to="/" className={isActive("/")}><i className="ti ti-layout-dashboard"></i> Dashboard</Link>
        <Link to="/patients" className={isActive("/patients")}><i className="ti ti-users"></i> Patients</Link>
        <Link to="/alerts" className={isActive("/alerts")}><i className="ti ti-bell"></i> Alerts</Link>
        <Link to="/reports" className={isActive("/reports")}><i className="ti ti-chart-bar"></i> Reports</Link>
        <Link to="/settings" className={isActive("/settings")}><i className="ti ti-settings"></i> Settings</Link>
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