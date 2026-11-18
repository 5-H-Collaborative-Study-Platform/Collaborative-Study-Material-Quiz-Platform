const express = require("express");
const mongoose = require("mongoose");
const Feedback = require("../models/Feedback");
const auth = require("../middleware/auth");

const router = express.Router();

// POST /api/feedback - Submit feedback
router.post("/", auth, async (req, res) => {
  try {
    const { targetId, targetType, rating, comment } = req.body;

    if (!targetId || rating === undefined) {
      return res
        .status(400)
        .json({ error: "targetId and rating are required" });
    }

    if (rating < 1 || rating > 5) {
      return res
        .status(400)
        .json({ error: "rating must be between 1 and 5" });
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

// GET /api/feedback?targetId=... - Fetch feedback, count, and average
router.get("/", async (req, res) => {
  try {
    const { targetId } = req.query;

    if (!targetId) {
      return res.status(400).json({
        error: "targetId is required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(targetId)) {
      return res.status(400).json({
        error: "Invalid targetId",
      });
    }

    const feedback = await Feedback.find({ targetId }).sort({
      createdAt: -1,
    });

    const count = feedback.length;

    const average = count
      ? feedback.reduce((sum, item) => sum + item.rating, 0) / count
      : 0;

    return res.status(200).json({
      count,
      average,
      feedback,
    });
  } catch (error) {
    return res.status(500).json({
      error: "Failed to fetch feedback",
    });
  }
});

module.exports = router;