import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function TakeQuiz() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quizData, setQuizData] = useState(null);
  const [answers, setAnswers] = useState({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    loadQuiz();
  }, []);

  const loadQuiz = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`http://localhost:5000/api/quizzes/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setQuizData(res.data);
      setTimeLeft(res.data.quiz.timeLimit || 300); // Default 30 minutes
    } catch (err) {
      console.error('Load quiz error:', err);
      alert('Failed to load quiz');
      navigate('/quizzes');
    } finally {
      setLoading(false);
    }
  };

  // Timer effect
  useEffect(() => {
    if (timeLeft <= 0 && quizData && !submitted) {
      handleSubmit();
      return;
    }

    if (quizData && !submitted) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft, submitted, quizData]);

  const handleAnswerSelect = (questionId, optionId) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: optionId
    }));
  };

  const handleSubmit = async () => {
    if (submitted) return;
    
    if (!window.confirm('Are you sure you want to submit this quiz?')) {
      return;
    }

    try {
      setSubmitted(true);
      const token = localStorage.getItem('token');
      const res = await axios.post(
        `http://localhost:5000/api/quizzes/${id}/submit`,
        { answers },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setResult(res.data.result);
    } catch (err) {
      console.error('Submit error:', err);
      alert('Failed to submit quiz');
      setSubmitted(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return <div className="container mt-4">Loading quiz...</div>;
  }

  if (result) {
    return (
      <div className="container mt-4">
        <div className="card text-center">
          <div className="card-body">
            <h2>Quiz Completed! 🎉</h2>
            <h3 className="mt-3">Your Score</h3>
            <div className="display-4 text-primary mb-3">
              {result.score} / {result.totalMarks}
            </div>
            <div className="h4">
              Percentage: <span className={result.percentage >= 70 ? 'text-success' : 'text-danger'}>
                {result.percentage}%
              </span>
            </div>
            <button 
              className="btn btn-primary mt-3"
              onClick={() => navigate('/quizzes')}
            >
              Back to Quizzes
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!quizData || !quizData.questions.length) {
    return <div className="container mt-4">No questions available for this quiz.</div>;
  }

  const question = quizData.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / quizData.questions.length) * 100;

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>{quizData.quiz.title}</h2>
        <div className="bg-danger text-white p-2 rounded">
          <strong>Time: {formatTime(timeLeft)}</strong>
        </div>
      </div>

      {/* Progress bar */}
      <div className="progress mb-4">
        <div 
          className="progress-bar bg-success" 
          role="progressbar" 
          style={{ width: `${progress}%` }}
        >
          {Math.round(progress)}%
        </div>
      </div>

      {/* Question */}
      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title">
            Question {currentQuestion + 1}: {question.text}
          </h5>
          <p className="text-muted">Marks: {question.mark}</p>
          
          <div className="mt-3">
            {question.options.map((option) => (
              <div key={option._id} className="form-check mb-2">
                <input
                  className="form-check-input"
                  type="radio"
                  name={`question-${question._id}`}
                  id={`option-${option._id}`}
                  value={option._id}
                  checked={answers[question._id] === option._id}
                  onChange={() => handleAnswerSelect(question._id, option._id)}
                />
                <label className="form-check-label" htmlFor={`option-${option._id}`}>
                  {option.text}
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="d-flex justify-content-between">
        <button
          className="btn btn-secondary"
          disabled={currentQuestion === 0}
          onClick={() => setCurrentQuestion(currentQuestion - 1)}
        >
          Previous
        </button>
        
        {currentQuestion < quizData.questions.length - 1 ? (
          <button
            className="btn btn-primary"
            onClick={() => setCurrentQuestion(currentQuestion + 1)}
          >
            Next
          </button>
        ) : (
          <button
            className="btn btn-success"
            onClick={handleSubmit}
            disabled={submitted}
          >
            {submitted ? 'Submitting...' : 'Submit Quiz'}
          </button>
        )}
      </div>
    </div>
  );
}