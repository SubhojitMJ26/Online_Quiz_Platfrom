import { useState, useEffect } from 'react';
import axios from 'axios';

export default function PublicLeaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/public/leaderboard');
        setLeaderboard(res.data);
      } catch (err) {
        console.error('Leaderboard error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4">🏆 Leaderboard</h1>
      
      {loading ? (
        <p className="text-center">Loading leaderboard...</p>
      ) : leaderboard.length === 0 ? (
        <p className="text-center text-muted">No results yet. Start taking quizzes!</p>
      ) : (
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="table-responsive">
              <table className="table table-striped">
                <thead className="table-dark">
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
                      <td>{entry.userName || 'Anonymous'}</td>
                      <td>{entry.quizTitle}</td>
                      <td>{entry.score} / {entry.totalMarks}</td>
                      <td className={`${entry.percentage >= 90 ? 'text-success' : entry.percentage >= 35 ? 'text-primary' : 'text-danger'}`}>
                        {entry.percentage.toFixed(1)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}