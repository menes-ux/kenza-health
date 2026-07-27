import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <div className="wrap">
      <Sidebar />
      <div className="main">
        <TopBar />
        <Dashboard />
      </div>
    </div>
  );
}

export default App;