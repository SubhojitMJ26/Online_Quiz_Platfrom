import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Marks() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/student/results', {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log('API Response:', res.data);
        setResults(res.data);
      } catch (err) {
        console.error('Failed to load results:', err);
        alert('Failed to load results');
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, []);

  return (
    <div>
      <h1 className="mb-4"></h1>
      
      {loading ? (
        <p>Loading results...</p>
      ) : results.length === 0 ? (
        <p className="text-muted">You haven't taken any exams yet.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered">
            <thead className="table-light">
              <tr>
                <th>Exam Name</th>
                <th>Score</th>
                <th>Percentage</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {results.map(result => (
                <tr key={result._id}>
                  <td>{result.quizTitle}</td>
                  <td>{result.score} / {result.totalMarks}</td>
                  <td>
                    <span className={`${
                      result.percentage >= 90 ? 'text-success' :
                      result.percentage >= 70 ? 'text-primary' :
                      result.percentage >= 35 ? 'text-warning' : 'text-danger'
                    }`}>
                      {result.percentage.toFixed(1)}%
                    </span>
                  </td>
                  <td>{new Date(result.completedAt).toLocaleDateString()}</td>
                  <td>
                    <span className={`badge ${
                      result.percentage >= 70 ? 'bg-success' : 'bg-danger'
                    }`}>
                      {result.percentage >= 35 ? 'Passed' : 'Failed'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}