const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    subject: {
      type: String,
      required: true
    },
    timeLimit: {
      type: Number, // in seconds
      required: true
    },

    // ✅ Difficulty level of quiz
    // easy | medium | hard
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
      required: true
    },

    totalQuestions: {
      type: Number,
      required: true
    },
    totalMarks: {
      type: Number,
      required: true
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Quiz', quizSchema);
