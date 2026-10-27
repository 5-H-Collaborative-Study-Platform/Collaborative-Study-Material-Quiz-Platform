const express = require("express");
const Feedback = require("../models/Feedback");
const auth = require("../middleware/auth");

const router = express.Router();

router.post("/", auth, async (req, res) => {
  try {
    const { targetId, targetType, rating, comment } = req.body;

    if (!targetId || rating === undefined) {
      return res
        .status(400)
        .json({ error: "targetId and rating are required" });
    }
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: "rating must be between 1 and 5" });
    }

    const feedback = await Feedback.create({
      targetId,
      targetType,
      user: req.user.id,
      rating,
      comment,
    });

    return res.status(201).json(feedback);
  } catch (error) {
    return res.status(500).json({ error: "Failed to submit feedback" });
  }
});

module.exports = router;
