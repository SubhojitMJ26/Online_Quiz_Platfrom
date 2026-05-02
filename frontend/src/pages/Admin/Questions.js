import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Questions() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [viewingQuestions, setViewingQuestions] = useState(false);
  const [currentCourse, setCurrentCourse] = useState(null);

  // Load courses for dropdown
  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/admin/courses', {
        headers: { Authorization: `Bearer ${token}` }
      });      
      setCourses(res.data);
    } catch (err) {
      console.error('Failed to load courses:', err);
      alert('Failed to load courses');
    }
  };

  const handleAddQuestion = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    // Get all option values
    const options = [];
    for (let i = 1; i <= 4; i++) {
      const optionValue = formData.get(`option${i}`);
      if (optionValue) options.push(optionValue);
    }

    const questionData = {
      quizId: selectedCourse,
      text: formData.get('question'),
      difficulty: formData.get('difficulty'),
      mark: formData.get('mark'),
      options: options,
      correctOptionIndex: formData.get('answer')
    };

    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/admin/questions', questionData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      alert('Question added successfully!');
      setShowAddForm(false);
      setSelectedCourse('');
    } catch (err) {
      console.error('Add question error:', err);
      alert('Failed to add question: ' + (err.response?.data?.error || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const handleViewQuestions = async (course) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`http://localhost:5000/api/admin/questions/${course._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setQuestions(res.data);
      setCurrentCourse(course);
      setViewingQuestions(true);
    } catch (err) {
      console.error('Failed to load questions:', err);
      alert('Failed to load questions');
    }
  };

  const handleBackToCourses = () => {
    setViewingQuestions(false);
    setQuestions([]);
    setCurrentCourse(null);
  };

  if (viewingQuestions) {
    return (
      <div>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1>Questions for "{currentCourse.title}"</h1>
          <button 
            className="btn btn-secondary"
            onClick={handleBackToCourses}
          >
            Back to Courses
          </button>
        </div>

        {questions.length === 0 ? (
          <p className="text-muted">No questions found for this course.</p>
        ) : (
          <div className="row">
            {questions.map((question, index) => (
              <div key={question._id} className="col-md-6 mb-4">
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title">Question {index + 1}</h5>
                    <p className="card-text"><strong>Question:</strong> {question.text}</p>
                    <p className="card-text"><strong>Difficulty:</strong> {question.difficulty}</p>
                    <p className="card-text"><strong>Marks:</strong> {question.mark}</p>
                    <div className="mt-3">
                      <strong>Options:</strong>
                      <ul className="list-group list-group-flush">
                        {question.options.map((option, optIndex) => (
                          <li 
                            key={optIndex} 
                            className={`list-group-item ${option.isCorrect ? 'bg-success text-white' : ''}`}
                          >
                            {String.fromCharCode(65 + optIndex)}. {option.text}
                            {option.isCorrect && ' ✅'}
                          </li>
                        ))}
                      </ul>
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

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Questions</h1>
        <button 
          className="btn btn-primary"
          onClick={() => setShowAddForm(!showAddForm)}
        >
          {showAddForm ? 'Cancel' : 'Add Question'}
        </button>
      </div>

      {/* Add Question Form */}
      {showAddForm && (
        <div className="card mb-4">
          <div className="card-header">
            <h5>Add New Question</h5>
          </div>
          <div className="card-body">
            <form onSubmit={handleAddQuestion}>
              <div className="mb-3">
                <label className="form-label">Course *</label>
                <select 
                  className="form-control" 
                  value={selectedCourse}
                  onChange={(e) => setSelectedCourse(e.target.value)}
                  required
                >
                  <option value="">Select a course</option>
                  {courses.map(course => (
                    <option key={course._id} value={course._id}>
                      {course.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label">Question *</label>
                <textarea 
                  className="form-control" 
                  name="question" 
                  rows="3"
                  required
                />
              </div>

              <div className="row mb-3">
                <div className="col-md-6">
                  <label className="form-label">Difficulty *</label>
                  <select className="form-control" name="difficulty" required>
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="form-label">Marks *</label>
                  <input 
                    type="number" 
                    className="form-control" 
                    name="mark" 
                    min="1"
                    defaultValue="1"
                    required
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label">Options *</label>
                {[1, 2, 3, 4].map(num => (
                  <div key={num} className="mb-2">
                    <input 
                      type="text" 
                      className="form-control" 
                      name={`option${num}`}
                      placeholder={`Option ${num}`}
                      required={num <= 2} // At least 2 options required
                    />
                  </div>
                ))}
              </div>

              <div className="mb-3">
                <label className="form-label">Correct Answer *</label>
                <select className="form-control" name="answer" required>
                  <option value="">Select correct option</option>
                  <option value="0">Option 1</option>
                  <option value="1">Option 2</option>
                  <option value="2">Option 3</option>
                  <option value="3">Option 4</option>
                </select>
              </div>

              <button 
                type="submit" 
                className="btn btn-success"
                disabled={loading}
              >
                {loading ? 'Adding...' : 'Add Question'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Courses List with View Questions button */}
      <div className="card">
        <div className="card-header">
          <h5>Available Courses ({courses.length})</h5>
        </div>
        <div className="card-body">
          {courses.length === 0 ? (
            <p className="text-muted">No courses found. Create a course first in the Courses section.</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Course Name</th>
                    <th>Total Questions</th>
                    <th>Total Marks</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {courses.map(course => (
                    <tr key={course._id}>
                      <td>{course.title}</td>
                      <td>{course.totalQuestions}</td>
                      <td>{course.totalMarks}</td>
                      <td>
                        <button 
                          className="btn btn-info btn-sm"
                          onClick={() => handleViewQuestions(course)}
                        >
                          View Questions
                        </button>
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