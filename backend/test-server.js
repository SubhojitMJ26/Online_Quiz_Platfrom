const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const quizRoutes = require('./routes/quizRoutes');
const adminRoutes = require('./routes/adminRoutes');
const dotenv = require('dotenv');

dotenv.config();
connectDB();
const cors = require('cors');
const express = require('express');
const app = express();

app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());

app.get('/api/test', (req, res) => {
  res.json({ message: 'Basic server works!' });
});

app.listen(5000, () => console.log('Server running'));