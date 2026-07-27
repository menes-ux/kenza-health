export default function TopBar() {
  return (
    <div className="topbar">
      <div className="topbar-left">
        <div className="topbar-title">Dashboard</div>
        <div className="topbar-sub">Mon 27, 2026 · 02:34 AM</div>
      </div>
      <div className="topbar-right">
        <div className="search">
          <i className="ti ti-search" aria-hidden="true"></i>
          <input placeholder="Search patient..." />
        </div>
        <div className="notif">
          <i className="ti ti-bell" aria-hidden="true"></i>
          <div className="badge">3</div>
        </div>
      </div>
    </div>
  );
}