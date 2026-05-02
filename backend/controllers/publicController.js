const Result = require('../models/Result');

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
          // Hide email for privacy
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
        $limit: 20 // Show top 20 publicly
      }
    ]);

    res.json(leaderboard);
  } catch (err) {
    console.error('Public leaderboard error:', err);
    res.status(500).json({ error: 'Failed to load leaderboard' });
  }
};

module.exports = { getPublicLeaderboard };