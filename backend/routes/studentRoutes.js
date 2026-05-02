const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');



const { getStudentStats,getStudentResults, getPublicLeaderboard } = require('../controllers/studentController');

router.get('/stats', protect, getStudentStats);
router.get('/results', protect, getStudentResults);
router.get('/leaderboard', protect, getPublicLeaderboard);
module.exports = router;