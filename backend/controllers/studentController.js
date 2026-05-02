const Quiz = require('../models/Quiz');
const Question = require('../models/Question');
const Result = require('../models/Result'); 

const getStudentStats = async (req, res) => {
  try {
    const totalCourses = await Quiz.countDocuments();
    const totalQuestions = await Question.countDocuments();
    res.json({ totalCourses, totalQuestions });
  } catch (err) {
    console.error('Student stats error:', err);
    res.status(500).json({ error: 'Failed to load stats' });
  }
};

// Get student's results
const getStudentResults = async (req, res) => {
  try {
    const results = await Result.find({ user: req.user.id })
      .populate('quiz', 'title')
      .sort({ completedAt: -1 })
      .select('quiz score totalMarks percentage completedAt');

    const formattedResults = results.map(result => ({
      _id: result._id,
      quizTitle: result.quiz?.title || 'Unknown Quiz',
      score: result.score,
      totalMarks: result.totalMarks,
      percentage: result.percentage,
      completedAt: result.completedAt
    }));

    res.json(formattedResults);
  } catch (err) {
    console.error('Student results error:', err);
    res.status(500).json({ error: 'Failed to load results' });
  }
};

// Get public leaderboard (top 10)
const getPublicLeaderboard = async (req, res) => {
  try {
    const leaderboard = await Result.aggregate([
      {
        $lookup: {
          from: 'users',
          localField: 'user',
          foreignField: '_id',
          as: 'userDetails'
        }
      },
      {
        $lookup: {
          from: 'quizzes',
          localField: 'quiz',
          foreignField: '_id',
          as: 'quizDetails'
        }
      },
      {
        $unwind: '$userDetails'
      },
      {
        $unwind: '$quizDetails'
      },
      {
        $project: {
          _id: 1,
          userName: '$userDetails.name',
          quizTitle: '$quizDetails.title',
          score: 1,
          totalMarks: 1,
          percentage: 1,
          completedAt: 1
        }
      },
      {
        $sort: { percentage: -1, score: -1 }
      },
      {
        $limit: 10 // Top 10 for dashboard
      }
    ]);

    res.json(leaderboard);
  } catch (err) {
    console.error('Public leaderboard error:', err);
    res.status(500).json({ error: 'Failed to load leaderboard' });
  }
};


module.exports = { getStudentStats, getStudentResults, getPublicLeaderboard };