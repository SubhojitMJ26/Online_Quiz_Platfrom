const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
  quiz: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quiz',
    required: true
  },
  text: {
    type: String,
    required: true
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    required: true
  },
  mark: {
    type: Number,
    required: true,
    default: 1
  },
  options: [{
    text: { type: String, required: true },
    isCorrect: { type: Boolean, default: false }
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Question', QuestionSchema);