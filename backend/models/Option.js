const mongoose = require('mongoose');

const optionSchema = new mongoose.Schema({
  question: { type: mongoose.Schema.Types.ObjectId, ref: 'Question', required: true },
  text: { type: String, required: true },
  isCorrect: { type: Boolean, default: false }
});

module.exports = mongoose.model('Option', optionSchema);