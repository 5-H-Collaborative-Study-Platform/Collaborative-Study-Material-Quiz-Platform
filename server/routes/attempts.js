const express = require("express");
const Attempt = require("../models/Attempt");
const auth = require("../middleware/auth");

const router = express.Router();

router.post("/", auth, async (req, res) => {
  try {
    const { quizId, answers } = req.body;

    if (!quizId || !Array.isArray(answers)) {
      return res
        .status(400)
        .json({ error: "quizId and answers are required" });
    }

    const attempt = await Attempt.create({
      quiz: quizId,
      user: req.user.id,
      answers,
      submittedAt: new Date(),
    });

    return res.status(201).json(attempt);
  } catch (error) {
    return res.status(500).json({ error: "Failed to save attempt" });
  }
});

module.exports = router;