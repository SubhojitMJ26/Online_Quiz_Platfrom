const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

const quizRoutes = require('./routes/quizRoutes');
const adminRoutes = require('./routes/adminRoutes');
const authRoutes = require('./routes/authRoutes');

const publicRoutes = require('./routes/publicRoutes');
const studentRoutes = require('./routes/studentRoutes');
dotenv.config();
connectDB();

const app = express();

app.use(cors({
  origin: 'http://localhost:3000', // Allow frontend origin
  credentials: true
}));
app.use(express.json());
app.use('/api/admin',adminRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/quizzes', quizRoutes);


const PORT = process.env.PORT || 5000;

// Add this BEFORE app.listen()
app.get('/api/test-stats', async (req, res) => {
  const User = require('./models/User');
  const Quiz = require('./models/Quiz');
  const Question = require('./models/Question');

  const totalStudents = await User.countDocuments({ role: 'user' });
  const totalQuizzes = await Quiz.countDocuments();
  const totalQuestions = await Question.countDocuments();

  res.json({ totalStudents, totalQuizzes, totalQuestions });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

app.use('/api/public', publicRoutes);
app.use('/api/student', studentRoutes);