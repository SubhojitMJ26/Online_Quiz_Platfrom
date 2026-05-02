import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Home() {
  const [stats, setStats] = useState({
    totalStudents: '--',
    totalQuizzes: '--',
    totalQuestions: '--'
  });
  
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No token');

        const response = await axios.get('http://localhost:5000/api/admin/stats', {
          headers: { Authorization: `Bearer ${token}` }
        });

        setStats(response.data);
        setError('');

        // Fetch leaderboard
        const leaderboardRes = await axios.get('http://localhost:5000/api/admin/leaderboard', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setLeaderboard(leaderboardRes.data);


      } catch (err) {
        console.error('Dashboard error:', err);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <div>Loading dashboard...</div>;
  }

  return (
    <div>
      <h1 className="mb-4"></h1>
      
      {error && (
        <div className="alert alert-danger mb-4">{error}</div>
      )}

      <div className="row">
        {/* Students Card */}
        <div className="col-md-4 mb-4">
          <div className="card border-left-primary shadow h-100 py-2">
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col mr-2">
                  <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                    Total Students
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">
                    {stats.totalStudents}
                  </div>
                </div>
                <div className="col-auto">
                  <i className="fas fa-user fa-2x text-gray-300"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Courses Card */}
        <div className="col-md-4 mb-4">
          <div className="card border-left-success shadow h-100 py-2">
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col mr-2">
                  <div className="text-xs font-weight-bold text-success text-uppercase mb-1">
                    Total Courses
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">
                    {stats.totalQuizzes}
                  </div>
                </div>
                <div className="col-auto">
                  <i className="fas fa-book fa-2x text-gray-300"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Questions Card */}
        <div className="col-md-4 mb-4">
          <div className="card border-left-info shadow h-100 py-2">
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col mr-2">
                  <div className="text-xs font-weight-bold text-info text-uppercase mb-1">
                    Total Questions
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">
                    {stats.totalQuestions}
                  </div>
                </div>
                <div className="col-auto">
                  <i className="fas fa-question fa-2x text-gray-300"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Leaderboard Section */}
      <div className="card shadow mb-4">
        <div className="card-header py-3">
          <h6 className="m-0 font-weight-bold text-primary">Leaderboard - Top Performers</h6>
        </div>
        <div className="card-body">
          {leaderboard.length === 0 ? (
            <p className="text-muted">No quiz results yet. Students need to complete quizzes first.</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-bordered" id="dataTable" width="100%" cellSpacing="0">
                <thead>
                  <tr>
                    <th>Rank</th>
                    <th>Student</th>
                    <th>Quiz</th>
                    <th>Score</th>
                    <th>Percentage</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboard.map((entry, index) => (
                    <tr key={entry._id}>
                      <td>
                        <span className={`badge ${
                          index === 0 ? 'bg-warning text-dark' : 
                          index === 1 ? 'bg-secondary' : 
                          index === 2 ? 'bg-success' : 'bg-primary'
                        }`}>
                          #{index + 1}
                        </span>
                      </td>
                      <td>{entry.userName || entry.userEmail}</td>
                      <td>{entry.quizTitle}</td>
                      <td>{entry.score} / {entry.totalMarks}</td>
                      <td>
                        <span className={`${
                          entry.percentage >= 90 ? 'text-success' :
                          entry.percentage >= 70 ? 'text-primary' :
                          entry.percentage >= 50 ? 'text-warning' : 'text-danger'
                        }`}>
                          {entry.percentage.toFixed(1)}%
                        </span>
                      </td>
                      <td>{new Date(entry.completedAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}