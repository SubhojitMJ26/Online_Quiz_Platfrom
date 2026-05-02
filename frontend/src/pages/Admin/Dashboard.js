import { useState, useEffect } from 'react';
import { useNavigate, Link, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

import Home from './Home';
import Students from './Students';
import Courses from './Courses';
import Questions from './Questions';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const path = window.location.pathname;
    if (path === '/admin') setActiveTab('dashboard');
    else if (path === '/admin/students') setActiveTab('students');
    else if (path === '/admin/courses') setActiveTab('courses');
    else if (path === '/admin/questions') setActiveTab('questions');
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  useEffect(() => {
    const handleResize = () => {
      setSidebarOpen(window.innerWidth >= 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'fa-chart-line', path: '/admin' },
    { id: 'students', label: 'Students', icon: 'fa-users', path: '/admin/students' },
    { id: 'courses', label: 'Courses', icon: 'fa-book-open', path: '/admin/courses' },
    { id: 'questions', label: 'Questions', icon: 'fa-question-circle', path: '/admin/questions' }
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'linear-gradient(135deg, #eef2ff, #f8fafc)' }}>

      {/* SIDEBAR */}
      <div style={{
        width: sidebarOpen ? '250px' : '0',
        background: '#0f172a',
        color: 'white',
        transition: '0.3s',
        overflow: 'hidden',
        position: 'fixed',
        height: '100vh',
        boxShadow: '4px 0 20px rgba(0,0,0,0.2)'
      }}>
        <div style={{ padding: '25px', textAlign: 'center' }}>
          <img src="/logo.png" style={{ width: '80px', borderRadius: '50%' }} />
          <h5 style={{ marginTop: '10px', color: '#cbd5f5' }}>Admin Panel</h5>
        </div>

        {menuItems.map(item => (
          <Link
            key={item.id}
            to={item.path}
            onClick={() => setActiveTab(item.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '14px 20px',
              color: activeTab === item.id ? '#fff' : '#94a3b8',
              background: activeTab === item.id ? '#1e293b' : 'transparent',
              borderLeft: activeTab === item.id ? '4px solid #3b82f6' : 'none',
              textDecoration: 'none',
              transition: '0.2s'
            }}
          >
            <i className={`fas ${item.icon}`} style={{ marginRight: '12px' }}></i>
            {item.label}
          </Link>
        ))}
      </div>

      {/* MAIN CONTENT */}
      <div style={{
        flex: 1,
        marginLeft: sidebarOpen ? '250px' : '0',
        padding: '25px'
      }}>

        {/* HEADER */}
        <div style={{
          background: '#ffffff',
          borderRadius: '12px',
          padding: '18px 25px',
          marginBottom: '25px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: '0 10px 30px rgba(0,0,0,0.05)'
        }}>
          <div>
            <h4 style={{ margin: 0, fontWeight: '600' }}>Admin Dashboard</h4>
            <small style={{ color: '#64748b' }}>
              Manage students, courses, and questions
            </small>
          </div>

          <div>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              style={{
                marginRight: '10px',
                border: 'none',
                background: '#e2e8f0',
                padding: '6px 10px',
                borderRadius: '6px'
              }}
            >
              ☰
            </button>

            <button
              onClick={handleLogout}
              style={{
                background: '#ef4444',
                border: 'none',
                color: 'white',
                padding: '8px 14px',
                borderRadius: '8px'
              }}
            >
              Logout
            </button>
          </div>
        </div>

        {/* CONTENT AREA */}
        <div style={{
          background: '#ffffff',
          borderRadius: '12px',
          padding: '20px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.05)'
        }}>
          <Routes>
            <Route index element={<Home />} />
            <Route path="students" element={<Students />} />
            <Route path="courses" element={<Courses />} />
            <Route path="questions" element={<Questions />} />
          </Routes>
        </div>

      </div>
    </div>
  );
}