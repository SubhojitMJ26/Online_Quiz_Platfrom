import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password,
        role,
      });

      login(res.data);

      if (res.data.user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      alert('Login failed: ' + (err.response?.data?.error || 'Invalid credentials'));
    }
  };

  return (
    <div
      style={{
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: 'Inter, sans-serif',
        background: 'linear-gradient(135deg, #020617, #0f172a)',
      }}
    >
      <div
        style={{
          width: '420px',
          padding: '45px 35px',
          borderRadius: '18px',
          background: '#0f172a',
          border: '1px solid #1e293b',
          boxShadow: '0 25px 60px rgba(0,0,0,0.7)',
        }}
      >
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <img
            src="/logo.png"
            alt="logo"
            style={{ width: '70px', borderRadius: '50%', marginBottom: '10px' }}
          />
          <h2 style={{ color: '#fff', fontWeight: '600' }}>
            Online Quiz Platform
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '14px' }}>
            Sign in to continue
          </p>
        </div>

        <form onSubmit={handleSubmit}>

          {/* EMAIL */}
          <div style={{ marginBottom: '18px' }}>
            <label style={{ color: '#94a3b8', fontSize: '13px' }}>Email</label>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              marginTop: '6px',
              background: '#020617',
              border: '1px solid #334155',
              borderRadius: '10px',
              padding: '10px 12px',
              boxShadow: 'inset 0 0 6px rgba(0,0,0,0.5)'
            }}>
              <i className="fas fa-envelope" style={{ color: '#64748b', marginRight: '10px' }}></i>

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                style={{
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: 'white',
                  width: '100%',
                }}
              />
            </div>
          </div>

          {/* PASSWORD */}
          <div style={{ marginBottom: '18px' }}>
            <label style={{ color: '#94a3b8', fontSize: '13px' }}>Password</label>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              marginTop: '6px',
              background: '#020617',
              border: '1px solid #334155',
              borderRadius: '10px',
              padding: '10px 12px',
              boxShadow: 'inset 0 0 6px rgba(0,0,0,0.5)'
            }}>
              <i className="fas fa-lock" style={{ color: '#64748b', marginRight: '10px' }}></i>

              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                style={{
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: 'white',
                  width: '100%',
                }}
              />
            </div>
          </div>

          {/* ROLE */}
          <div style={{ marginBottom: '22px' }}>
            <label style={{ color: '#94a3b8', fontSize: '13px' }}>Role</label>

            <div style={{
              display: 'flex',
              marginTop: '8px',
              background: '#020617',
              borderRadius: '10px',
              padding: '5px',
              border: '1px solid #334155'
            }}>
              <button
                type="button"
                onClick={() => setRole('student')}
                style={{
                  flex: 1,
                  padding: '10px',
                  borderRadius: '8px',
                  border: 'none',
                  background: role === 'student' ? '#22c55e' : 'transparent',
                  color: role === 'student' ? '#000' : '#94a3b8',
                  fontWeight: '500'
                }}
              >
                Student
              </button>

              <button
                type="button"
                onClick={() => setRole('admin')}
                style={{
                  flex: 1,
                  padding: '10px',
                  borderRadius: '8px',
                  border: 'none',
                  background: role === 'admin' ? '#3b82f6' : 'transparent',
                  color: role === 'admin' ? '#fff' : '#94a3b8',
                  fontWeight: '500'
                }}
              >
                Admin
              </button>
            </div>
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            style={{
              width: '100%',
              padding: '13px',
              borderRadius: '10px',
              border: 'none',
              background: 'linear-gradient(90deg, #3b82f6, #06b6d4)',
              color: 'white',
              fontWeight: '600',
              fontSize: '15px',
              boxShadow: '0 10px 25px rgba(59,130,246,0.4)',
              transition: '0.2s'
            }}
          >
            Login →
          </button>

        </form>

        {/* Footer */}
        <div style={{ textAlign: 'center', marginTop: '18px' }}>
          <span style={{ color: '#94a3b8', fontSize: '13px' }}>
            Don’t have an account?{' '}
            <a href="/register" style={{ color: '#22c55e' }}>
              Sign Up
            </a>
          </span>
        </div>

      </div>
    </div>
  );
}