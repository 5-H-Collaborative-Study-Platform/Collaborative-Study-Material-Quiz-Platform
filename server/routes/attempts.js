const express = require("express");
const Attempt = require("../models/Attempt");
const Question = require("../models/Question");
const auth = require("../middleware/auth");

const router = express.Router();

// POST /api/attempts
// { quizId, answers: [{ question, selected }] } -> auto-graded
router.post("/", auth, async (req, res) => {
  const { quizId, answers } = req.body;

  if (!quizId || !Array.isArray(answers)) {
    return res.status(400).json({
      error: "quizId and answers are required",
    });
  }

  // Look up the correct answer for each answered question.
  const ids = answers.map((a) => a.question).filter(Boolean);
  const questions = await Question.find({
    _id: { $in: ids },
  });

  const correct = {};
  questions.forEach((q) => {
    correct[q._id.toString()] = q.correctAnswer;
  });

  let right = 0;
  answers.forEach((a) => {
    if (
      a.question &&
      correct[a.question.toString()] === a.selected
    ) {
      right += 1;
    }
  });

  const score = answers.length
    ? Math.round((right / answers.length) * 100)
    : 0;

  const attempt = await Attempt.create({
    quiz: quizId,
    user: req.user.id,
    answers,
    score,
    submittedAt: new Date(),
  });

  res.status(201).json(attempt);
});

module.exports = router;