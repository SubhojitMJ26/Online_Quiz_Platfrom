const mongoose = require('mongoose');

const userAttemptSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  quiz: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: true },
  score: { type: Number, required: true },
  totalTimeTaken: { type: Number, required: true },
  responses: [{
    question: { type: mongoose.Schema.Types.ObjectId, ref: 'Question' },
    selectedOption: { type: mongoose.Schema.Types.ObjectId, ref: 'Option' }
  }],
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('UserAttempt', userAttemptSchema);