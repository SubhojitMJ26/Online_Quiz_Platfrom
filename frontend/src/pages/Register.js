import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (password.length < 6) {
      alert('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', {
        name,
        email,
        password
      });

      localStorage.setItem('token', res.data.token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
      navigate('/dashboard');

    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Registration failed';
      alert(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      height: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      background: 'linear-gradient(135deg, #020617, #0f172a)',
      fontFamily: 'Inter, sans-serif'
    }}>

      <div style={{
        width: '420px',
        padding: '45px 35px',
        borderRadius: '18px',
        background: '#0f172a',
        border: '1px solid #1e293b',
        boxShadow: '0 25px 60px rgba(0,0,0,0.7)'
      }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <img src="/logo.png" alt="logo"
            style={{ width: '70px', borderRadius: '50%', marginBottom: '10px' }} />
          
          <h2 style={{ color: '#fff', fontWeight: '600' }}>
            Create Account
          </h2>

          <p style={{ color: '#94a3b8', fontSize: '14px' }}>
            Join Online Quiz Platform
          </p>
        </div>

        <form onSubmit={handleSubmit}>

          {/* NAME */}
          <div style={{ marginBottom: '18px' }}>
            <label style={{ color: '#94a3b8', fontSize: '13px' }}>Full Name</label>

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
              <i className="fas fa-user" style={{ color: '#64748b', marginRight: '10px' }}></i>

              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                required
                style={{
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: 'white',
                  width: '100%'
                }}
              />
            </div>
          </div>

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
                  width: '100%'
                }}
              />
            </div>
          </div>

          {/* PASSWORD */}
          <div style={{ marginBottom: '22px' }}>
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
                placeholder="Min 6 characters"
                required
                style={{
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: 'white',
                  width: '100%'
                }}
              />
            </div>
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '13px',
              borderRadius: '10px',
              border: 'none',
              background: 'linear-gradient(90deg, #22c55e, #16a34a)',
              color: 'white',
              fontWeight: '600',
              fontSize: '15px',
              boxShadow: '0 10px 25px rgba(34,197,94,0.4)'
            }}
          >
            {loading ? 'Creating Account...' : 'Register'}
          </button>

        </form>

        {/* Footer */}
        <div style={{ textAlign: 'center', marginTop: '18px' }}>
          <span style={{ color: '#94a3b8', fontSize: '13px' }}>
            Already have an account?{' '}
            <a href="/login" style={{ color: '#3b82f6' }}>
              Login
            </a>
          </span>
        </div>

      </div>
    </div>
  );
}