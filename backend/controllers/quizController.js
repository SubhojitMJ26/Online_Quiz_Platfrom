const Quiz = require('../models/Quiz');
const Question = require('../models/Question');
const Result = require('../models/Result');

// ===============================
// Get all quizzes (student dashboard)
// ===============================
const getQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find()
      .select('title subject timeLimit difficulty totalQuestions totalMarks');

    res.json(quizzes);
  } catch (err) {
    console.error('Get quizzes error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// ===============================
// Get quiz + questions for student
// ===============================
const getQuizForStudent = async (req, res) => {
  try {
    const { id } = req.params;

    const quiz = await Quiz.findById(id);
    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found' });
    }

    const questions = await Question.find({ quiz: id });

    res.json({
      quiz: {
        _id: quiz._id,
        title: quiz.title,
        subject: quiz.subject,
        difficulty: quiz.difficulty, // ✅ ADDED
        totalMarks: quiz.totalMarks,
        totalQuestions: quiz.totalQuestions,
        timeLimit: quiz.timeLimit
      },
      questions: questions.map(q => ({
        _id: q._id,
        text: q.text,
        difficulty: q.difficulty,
        mark: q.mark,
        options: q.options.map(opt => ({
          _id: opt._id,
          text: opt.text
          // ✅ Correct answers NOT sent
        }))
      }))
    });
  } catch (err) {
    console.error('Get quiz error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// ===============================
// Submit quiz
// ===============================
const submitQuiz = async (req, res) => {
  try {
    const { id } = req.params;
    const { answers } = req.body;

    if (!answers || typeof answers !== 'object') {
      return res.status(400).json({ error: 'Invalid answers format' });
    }

    const quiz = await Quiz.findById(id);
    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found' });
    }

    const questions = await Question.find({ quiz: id });

    let totalScore = 0;
    let totalPossible = 0;

    for (const question of questions) {
      totalPossible += question.mark;

      const selectedOptionId = answers[question._id.toString()];
      if (selectedOptionId) {
        const correctOption = question.options.find(opt => opt.isCorrect);
        if (correctOption && correctOption._id.toString() === selectedOptionId) {
          totalScore += question.mark;
        }
      }
    }

    const percentage = Math.round((totalScore / totalPossible) * 100);

    const result = new Result({
      user: req.user.id,
      quiz: id,
      score: totalScore,
      totalMarks: totalPossible,
      percentage
    });

    await result.save();

    res.json({
      message: 'Quiz submitted successfully',
      result: {
        score: totalScore,
        totalMarks: totalPossible,
        percentage
      }
    });
  } catch (err) {
    console.error('Submit quiz error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// ===============================
// Leaderboard
// ===============================
const getLeaderboard = async (req, res) => {
  try {
    const { id } = req.params;
    const filter = id ? { quiz: id } : {};

    const leaderboard = await Result.find(filter)
      .populate('user', 'name')
      .populate('quiz', 'title')
      .sort({ percentage: -1, score: -1 })
      .limit(10)
      .select('user quiz score totalMarks percentage completedAt');

    res.json(leaderboard);
  } catch (err) {
    console.error('Leaderboard error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  getQuizzes,
  getQuizForStudent,
  submitQuiz,
  getLeaderboard
};
