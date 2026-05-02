import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Exams() {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/quizzes', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setQuizzes(res.data);
      } catch (err) {
        console.error('Failed to load quizzes:', err);
        alert('Failed to load quizzes');
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, []);

  // ✅ Convert backend difficulty → display level
  const formatLevel = (difficulty) => {
    if (!difficulty) return 'N/A';
    return difficulty.charAt(0).toUpperCase() + difficulty.slice(1);
  };

  const getLevelBadgeClass = (difficulty) => {
    switch (difficulty) {
      case 'easy':
        return 'success';
      case 'medium':
        return 'warning';
      case 'hard':
        return 'danger';
      default:
        return 'secondary';
    }
  };

  return (
    <div>
      <h1 className="mb-4">Available Exams</h1>

      {loading ? (
        <p>Loading exams...</p>
      ) : quizzes.length === 0 ? (
        <p className="text-muted">No exams available at the moment.</p>
      ) : (
        <div className="row">
          {quizzes.map(quiz => (
            <div key={quiz._id} className="col-md-6 col-lg-4 mb-4">
              <div className="card h-100 shadow-sm">
                <div className="card-body d-flex flex-column">

                  <h5 className="card-title">{quiz.title}</h5>

                  <p className="card-text mb-2">
                    <strong>Subject:</strong> {quiz.subject}
                  </p>

                  {/* ✅ LEVEL DISPLAY */}
                  <p className="card-text mb-2">
                    <strong>Level:</strong>{' '}
                    <span className={`badge bg-${getLevelBadgeClass(quiz.difficulty)}`}>
                      {formatLevel(quiz.difficulty)}
                    </span>
                  </p>

                  <p className="card-text">
                    <strong>Questions:</strong> {quiz.totalQuestions}<br />
                    <strong>Total Marks:</strong> {quiz.totalMarks}<br />
                    <strong>Time Limit:</strong> {Math.floor(quiz.timeLimit / 60)} minutes
                  </p>

                  <div className="mt-auto">
                    <button
                      onClick={() => navigate(`/quiz/${quiz._id}`)}
                      className="btn btn-primary w-100"
                    >
                      Take Exam
                    </button>
                  </div>

                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
