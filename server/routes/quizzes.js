const express = require("express");
const Quiz = require("../models/Quiz");
const Question = require("../models/Question");
const auth = require("../middleware/auth");

const router = express.Router();

// POST /api/quizzes
// Body: { title, topic, questionIds: [] }
router.post("/", auth, async (req, res) => {
  try {
    const { title, topic, questionIds } = req.body;

    if (
      !title ||
      !topic ||
      !Array.isArray(questionIds) ||
      questionIds.length === 0
    ) {
      return res.status(400).json({
        error: "title, topic and at least one question are required",
      });
    }

    const found = await Question.find({
      _id: { $in: questionIds },
    });

    if (found.length !== questionIds.length) {
      return res.status(400).json({
        error: "Some questions do not exist",
      });
    }

    const quiz = await Quiz.create({
      title,
      topic,
      questions: questionIds,
      createdBy: req.user.id,
    });

    return res.status(201).json(quiz);
  } catch (err) {
    if (err.name === "CastError" || err.name === "BSONError") {
      return res.status(400).json({ error: "Invalid question ID" });
    }

    console.error("Create quiz error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id).populate(
      "questions",
      "-correctAnswer"
    );

    if (!quiz) {
      return res.status(404).json({ error: "Quiz not found" });
    }

    return res.json(quiz);
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch quiz" });
  }
});

module.exports = router;