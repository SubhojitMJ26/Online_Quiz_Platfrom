import { useState } from 'react';
import { useNavigate, Link, Routes, Route, useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

// Existing Pages
import StudentHome from './StudentHome';
import Exams from './Exams';
import Marks from './Marks';

// NEW Pages (inline for single flow)
function Scoreboard() {
  return (
    <div className="card p-3">
      <h4>🏆 Scoreboard</h4>
      <p>Top performers will be displayed here.</p>
    </div>
  );
}

function Results() {
  return (
    <div className="card p-3">
      <h4>📊 Results</h4>
      <p>Your quiz results will appear here.</p>
    </div>
  );
}

// Navigation Items
const navItems = [
  { id: 'home', label: 'Home', icon: 'fa-home', path: '/dashboard' },
  { id: 'exams', label: 'Exams', icon: 'fa-book', path: '/dashboard/exams' },
  { id: 'marks', label: 'Marks', icon: 'fa-chart-bar', path: '/dashboard/marks' },
  { id: 'scoreboard', label: 'Scoreboard', icon: 'fa-trophy', path: '/dashboard/scoreboard' },
  { id: 'results', label: 'Results', icon: 'fa-poll', path: '/dashboard/results' }
];

// Styles
const styles = {
  container: { background: '#f6f7fa', minHeight: '100vh' },
  sidebar: { background: '#0e1a35', height: '100vh', position: 'fixed', width: '250px' },
  logo: { textAlign: 'center', padding: '16px 0' },
  logoImg: { maxWidth: '180px', width: '100%' },
  navItem: {
    color: '#fff',
    display: 'block',
    padding: '20px',
    textDecoration: 'none'
  },
  navItemActive: {
    background: '#122143',
    borderLeft: '5px solid #5584ff'
  },
  navIcon: { marginRight: '10px', color: '#5584ff' },
  mainContent: { marginLeft: '250px', padding: '20px' },
  header: {
    background: '#fff',
    padding: '15px',
    marginBottom: '20px'
  }
};

export default function StudentDashboard() {
  const navigate = useNavigate();
  const location = useLocation();

  const [sidebarOpen] = useState(true);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  // Detect active tab
  const getActiveTab = () => {
    const found = navItems.find(item => item.path === location.pathname);
    return found ? found.id : 'home';
  };

  const activeTab = getActiveTab();

  // Dynamic header title
  const getTitle = () => {
    const found = navItems.find(item => item.id === activeTab);
    return found ? found.label : 'Dashboard';
  };

  return (
    <div style={styles.container}>
      
      {/* Sidebar */}
      <div style={styles.sidebar}>
        <div style={styles.logo}>
          <img src="/logo.png" alt="logo" style={styles.logoImg} />
        </div>

        <ul style={{ listStyle: 'none', padding: 0 }}>
          {navItems.map(item => (
            <li key={item.id}>
              <Link
                to={item.path}
                style={{
                  ...styles.navItem,
                  ...(activeTab === item.id ? styles.navItemActive : {})
                }}
              >
                <i className={`fa ${item.icon}`} style={styles.navIcon}></i>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Main Content */}
      <div style={styles.mainContent}>
        
        {/* Header */}
        <div style={styles.header} className="d-flex justify-content-between">
          <h2>{getTitle()}</h2>
          <button onClick={handleLogout} className="btn btn-danger btn-sm">
            Logout
          </button>
        </div>

        {/* Routes */}
        <Routes>
          <Route index element={<StudentHome />} />
          <Route path="exams" element={<Exams />} />
          <Route path="marks" element={<Marks />} />
          <Route path="scoreboard" element={<Scoreboard />} />
          <Route path="results" element={<Results />} />
        </Routes>

      </div>
    </div>
  );
}