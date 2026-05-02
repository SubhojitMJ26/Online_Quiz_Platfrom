import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

export default function QuizList() {
  const [quizzes, setQuizzes] = useState([]);
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    // Add auth header
    const token = localStorage.getItem('token');
    axios.get('http://localhost:5000/api/quizzes', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => setQuizzes(res.data))
    .catch(err => {
      console.error('Fetch quizzes error:', err);
      if (err.response?.status === 401) {
        logout();
        navigate('/login');
      }
    });
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Debug: Log user role
  useEffect(() => {
    console.log('Current user:', user);
  }, [user]);

  return (
    <div className="container mt-4">
      {/* User Info & Controls */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3">Welcome, {user?.name}!</h1>
          <span className={`badge ${
            user?.role === 'admin' 
              ? 'bg-danger' 
              : 'bg-primary'
          }`}>
            {user?.role}
          </span>
        </div>
        
        <div>
          {/* Show Admin Dashboard link only for admins */}
          {user?.role === 'admin' && (
            <button
              onClick={() => navigate('/admin')}
              className="btn btn-outline-primary me-2"
            >
              Admin Dashboard
            </button>
          )}
          
          <button
            onClick={handleLogout}
            className="btn btn-outline-danger"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Quiz List */}
      <h2 className="h4 mb-3">Available Quizzes</h2>
      {quizzes.length === 0 ? (
        <p className="text-muted">No quizzes available.</p>
      ) : (
        <div className="row">
          {quizzes.map(q => (
            <div key={q._id} className="col-md-6 col-lg-4 mb-3">
              <div className="card h-100">
                <div className="card-body">
                  <h5 className="card-title">{q.title}</h5>
                  <p className="card-text">
                    Subject: {q.subject}<br/>
                    Time: {Math.floor(q.timeLimit / 60)} mins | {q.difficulty}
                  </p>
                  <button
                    onClick={() => navigate(`/quiz/${q._id}`)}
                    className="btn btn-success"
                  >
                    Start Quiz
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}