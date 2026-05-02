import { useState, useEffect } from 'react';
import axios from 'axios';

export default function StudentHome() {
  const [stats, setStats] = useState({ 
    totalCourses: 0, 
    totalQuestions: 0 
  });
  const [leaderboard, setLeaderboard] = useState([]);
  
  const [currentUserRank, setCurrentUserRank] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const res = await axios.get('http://localhost:5000/api/student/stats', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStats(res.data);

        // Fetch leaderboard
        const leaderboardRes = await axios.get('http://localhost:5000/api/student/leaderboard', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setLeaderboard(leaderboardRes.data);
        
        // Find current user's rank
        const userRank = leaderboardRes.data.findIndex(entry => 
          entry.userName === user.name
        );
        setCurrentUserRank(userRank !== -1 ? userRank + 1 : null);


      } catch (err) {
        console.error('Failed to load stats:', err);
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
      <div className="row">
        <div className="col-md-6 mb-4">
          <div className="card border-left-primary shadow py-2">
            <div className="card-body">
              <div className="row align-items-center">
                <div className="col mr-2">
                  <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                    Total Courses
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">
                    {stats.totalCourses}
                  </div>
                </div>
                <div className="col-auto">
                  <i className="fas fa-book fa-2x text-gray-300"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-6 mb-4">
          <div className="card border-left-info shadow py-2">
            <div className="card-body">
              <div className="row align-items-center">
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
          <h6 className="m-0 font-weight-bold text-primary">🏆 Leaderboard - Top Performers</h6>
        </div>
        <div className="card-body">
          {currentUserRank && (
            <div className="alert alert-info mb-3">
              <strong>Your Rank:</strong> #{currentUserRank}
            </div>
          )}
          
          {leaderboard.length === 0 ? (
            <p className="text-muted">No quiz results yet. Start taking exams!</p>
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
                      <td>{entry.userName}</td>
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