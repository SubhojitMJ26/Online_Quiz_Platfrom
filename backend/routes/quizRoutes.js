const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');

const {
  getQuizzes,
  getQuizForStudent,
  submitQuiz,
  getLeaderboard
} = require('../controllers/quizController');

// ✅ Get leaderboard (keep BEFORE :id)
router.get('/leaderboard/:id?', protect, getLeaderboard);

// ✅ Get all quizzes (includes difficulty automatically)
router.get('/', protect, getQuizzes);

// ✅ Get single quiz for student
router.get('/:id', protect, getQuizForStudent);

// ✅ Submit quiz
router.post('/:id/submit', protect, submitQuiz);

module.exports = router;
