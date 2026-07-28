import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import Dashboard from './pages/Dashboard';
import Patients from './pages/Patients';
import Alerts from './pages/Alerts';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import Login from './pages/Login';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  if (!isAuthenticated) {
    return <Login onLogin={() => setIsAuthenticated(true)} />;
  }

  return (
    <Router>
      <div className="wrap">
        <Sidebar />
        <div className="main">
          <TopBar />
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/patients" element={<Patients />} />
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;