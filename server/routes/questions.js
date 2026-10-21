const express = require("express");
const Question = require("../models/Question");
const auth = require("../middleware/auth");

const router = express.Router();

router.post("/", auth, async (req, res) => {
  const { text, options, correctAnswer, subject, topic, difficulty, type } =
    req.body || {};

  if (
    typeof text !== "string" ||
    !text.trim() ||
    typeof correctAnswer !== "string" ||
    !correctAnswer.trim() ||
    typeof subject !== "string" ||
    !subject.trim() ||
    typeof topic !== "string" ||
    !topic.trim()
  ) {
    return res.status(400).json({
      error: "Text, correct answer, subject and topic are required",
    });
  }

  if (
    options !== undefined &&
    (!Array.isArray(options) || options.some((option) => typeof option !== "string"))
  ) {
    return res.status(400).json({ error: "Options must be an array of strings" });
  }

  try {
    const question = await Question.create({
      text,
      options: options || [],
      correctAnswer,
      subject,
      topic,
      difficulty,
      type,
      addedBy: req.user.id,
    });

    return res.status(201).json(question);
  } catch (err) {
    if (err.name === "ValidationError" || err.name === "CastError") {
      return res.status(400).json({ error: err.message });
    }

    console.error(err);
    return res.status(500).json({ error: "Question creation failed" });
  }
});

module.exports = router;
