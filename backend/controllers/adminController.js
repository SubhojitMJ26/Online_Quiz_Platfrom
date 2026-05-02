const Quiz = require('../models/Quiz');
const Question = require('../models/Question');
const Option = require('../models/Option'); 
const User = require('../models/User');
const Result = require('../models/Result');

const createQuiz = async (req, res) => {
  try {
    const { title, subject, timeLimit, difficulty, totalQuestions } = req.body;
    const quiz = new Quiz({title, subject, timeLimit, difficulty, totalQuestions, createdBy: req.user.id });
    await quiz.save();
    res.status(201).json({ quizId: quiz._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};


const getDashboardStats = async (req, res) => {
  try {
    const totalStudents = await User.countDocuments({ role: 'user' });
    const totalQuizzes = await Quiz.countDocuments();
    const totalQuestions = await Question.countDocuments();
    res.json({ totalStudents, totalQuizzes, totalQuestions });
  } catch (err) {
    console.error('Stats error:', err);
    res.status(500).json({ error: 'Failed to load stats' });
  }
};

// Create Course (Quiz)
const createCourse = async (req, res) => {
  try {
    const { title, totalQuestions, totalMarks } = req.body;
    
    // Basic validation
    if (!title || !totalQuestions || !totalMarks) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const course = new Quiz({
      title,
      subject: 'General', // Default subject
      timeLimit: 1800, // 30 minutes default
      difficulty: 'medium',
      totalQuestions,
      totalMarks,
      createdBy: req.user.id
    });

    await course.save();
    res.status(201).json({ message: 'Course created successfully', course });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get All Courses
const getCourses = async (req, res) => {
  try {
    const courses = await Quiz.find({}).select('title totalQuestions totalMarks createdAt');
    res.json(courses);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};


// Add this function
const deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const course = await Quiz.findByIdAndDelete(id);
    
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }
    
    res.json({ message: 'Course deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get all courses for dropdown
const getCoursesForQuestions = async (req, res) => {
  try {
    const courses = await Quiz.find({}).select('title _id');
    res.json(courses);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Add Question
const addQuestion = async (req, res) => {
  try {
    const { quizId, text, difficulty, mark, options, correctOptionIndex } = req.body;
    
    // Validate inputs
    if (!quizId || !text || !difficulty || !options || options.length < 2) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Create options array with correct answer marked
    const formattedOptions = options.map((optionText, index) => ({
      text: optionText,
      isCorrect: index === parseInt(correctOptionIndex)
    }));

    const question = new Question({
      quiz: quizId,
      text,
      difficulty,
      mark: parseInt(mark) || 1,
      options: formattedOptions
    });

    await question.save();
    res.status(201).json({ message: 'Question added successfully', question });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get questions by course
const getQuestionsByCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const questions = await Question.find({ quiz: courseId })
      .populate('quiz', 'title')
      .select('text difficulty mark options createdAt');
    
    res.json(questions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get all students (users with role: 'user')
const getStudents = async (req, res) => {
  try {
    const students = await User.find({ role: 'user' }).select('name email createdAt');
    res.json(students);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Delete student
const deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Prevent deleting admin users
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    if (user.role === 'admin') {
      return res.status(403).json({ error: 'Cannot delete admin users' });
    }
    
    await User.findByIdAndDelete(id);
    res.json({ message: 'Student deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get leaderboard (top performers)
const getLeaderboard = async (req, res) => {
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
          userEmail: '$userDetails.email',
          quizTitle: '$quizDetails.title',
          score: 1,
          totalMarks: 1,
          percentage: 1,
          completedAt: 1
        }
      },
      {
        $sort: { percentage: -1, score: -1 } // Highest first
      },
      {
        $limit: 10 // Top 10 performers
      }
    ]);

    res.json(leaderboard);
  } catch (err) {
    console.error('Leaderboard error:', err);
    res.status(500).json({ error: 'Failed to load leaderboard' });
  }
};


module.exports = { createQuiz, getDashboardStats, createCourse, getCourses, deleteCourse, getCoursesForQuestions, addQuestion, getQuestionsByCourse, getStudents, deleteStudent, getLeaderboard };

