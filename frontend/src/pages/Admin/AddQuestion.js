import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function AddQuestion() {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const [question, setQuestion] = useState({
    text: '',
    explanation: ''
  });
  const [options, setOptions] = useState([
    { text: '', isCorrect: false },
    { text: '', isCorrect: false },
    { text: '', isCorrect: false },
    { text: '', isCorrect: false }
  ]);

  const handleOptionChange = (index, field, value) => {
    const newOptions = [...options];
    newOptions[index][field] = field === 'isCorrect' ? value === 'true' : value;
    setOptions(newOptions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `http://localhost:5000/api/admin/quizzes/${quizId}/questions`,
        { ...question, options },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Question added!');
      // Optionally stay to add more or go back
      navigate(`/admin/quizzes`);
    } catch (err) {
      alert('Failed to add question: ' + (err.response?.data?.error || err.message));
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Add Question</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-1">Question Text</label>
          <textarea
            value={question.text}
            onChange={e => setQuestion(prev => ({ ...prev, text: e.target.value }))}
            className="w-full p-2 border"
            rows="3"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1">Explanation (Optional)</label>
          <textarea
            value={question.explanation}
            onChange={e => setQuestion(prev => ({ ...prev, explanation: e.target.value }))}
            className="w-full p-2 border"
            rows="2"
          />
        </div>

        <h2 className="font-bold mb-2">Options</h2>
        {options.map((opt, index) => (
          <div key={index} className="mb-3 p-3 border rounded">
            <div className="flex items-center mb-2">
              <input
                type="radio"
                name={`correct-${quizId}`}
                checked={opt.isCorrect}
                onChange={() => {
                  // Ensure only one correct answer
                  const newOpts = options.map((o, i) => ({
                    ...o,
                    isCorrect: i === index
                  }));
                  setOptions(newOpts);
                }}
                className="mr-2"
              />
              <strong>Option {index + 1}:</strong>
            </div>
            <input
              type="text"
              placeholder={`Option ${index + 1} text`}
              value={opt.text}
              onChange={e => handleOptionChange(index, 'text', e.target.value)}
              className="w-full p-2 border"
              required
            />
          </div>
        ))}

        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Add Question
        </button>
      </form>
    </div>
  );
}