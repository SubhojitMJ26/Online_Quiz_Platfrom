const Option = require('../models/Option');

const gradeQuiz = async (responses) => {
  let correctCount = 0;
  const gradedResponses = [];

  for (const resp of responses) {
    const option = await Option.findById(resp.selectedOptionId);
    if (option && option.isCorrect) {
      correctCount++;
    }
    gradedResponses.push({
      question: resp.questionId,
      selectedOption: resp.selectedOptionId,
      isCorrect: option?.isCorrect || false
    });
  }

  return { correctCount, gradedResponses };
};

module.exports = gradeQuiz;