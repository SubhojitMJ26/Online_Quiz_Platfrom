const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { admin } = require('../middleware/admin');
const { createQuiz, addQuestion, getDashboardStats, createCourse, getCourses, deleteCourse, 
        getQuestionsByCourse, getStudents, deleteStudent, getLeaderboard  } = require('../controllers/adminController');

router.post('/quizzes', protect, admin, createQuiz);
router.post('/quizzes/:quizId/questions', protect, admin, addQuestion);
router.get('/stats', protect, admin, getDashboardStats);

router.post('/courses', protect, admin, createCourse);
router.get('/courses', protect, admin, getCourses);

router.delete('/courses/:id', protect, admin, deleteCourse);


//router.get('/courses-for-questions', protect, admin, getCoursesForQuestions);
router.post('/questions', protect, admin, addQuestion);
router.get('/questions/:courseId', protect, admin, getQuestionsByCourse);


router.get('/students', protect, admin, getStudents);
router.delete('/students/:id', protect, admin, deleteStudent);

router.get('/leaderboard', protect, admin, getLeaderboard);

module.exports = router;