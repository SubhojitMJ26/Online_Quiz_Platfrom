import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function CreateQuiz() {
  const [formData, setFormData] = useState({
    title: '',
    subject: '',
    timeLimit: 600, // default 10 mins
    difficulty: 'medium',
    totalQuestions: 5
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'timeLimit' || name === 'totalQuestions' ? Number(value) : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        'http://localhost:5000/api/admin/quizzes',
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Quiz created successfully!');
      navigate(`/admin/quizzes/${res.data.quizId}/questions/new`);
    } catch (err) {
      alert('Failed to create quiz: ' + (err.response?.data?.error || err.message));
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Create New Quiz</h1>
      <form onSubmit={handleSubmit} className="max-w-lg">
        <div className="mb-4">
          <label className="block mb-1">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full p-2 border"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1">Subject</label>
          <input
            type="text"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            className="w-full p-2 border"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1">Time Limit (seconds)</label>
          <input
            type="number"
            name="timeLimit"
            value={formData.timeLimit}
            onChange={handleChange}
            className="w-full p-2 border"
            min="30"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1">Difficulty</label>
          <select
            name="difficulty"
            value={formData.difficulty}
            onChange={handleChange}
            className="w-full p-2 border"
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block mb-1">Total Questions</label>
          <input
            type="number"
            name="totalQuestions"
            value={formData.totalQuestions}
            onChange={handleChange}
            className="w-full p-2 border"
            min="1"
            required
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Create Quiz
        </button>
      </form>
    </div>
  );
}