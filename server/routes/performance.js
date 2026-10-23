const express = require("express");
const Attempt = require("../models/Attempt");
const auth = require("../middleware/auth");

const router = express.Router();

// GET /api/performance/me  ->  { attempts, averageScore }
router.get("/me", auth, async (req, res) => {
  const attempts = await Attempt.find({ user: req.user.id });
  const total = attempts.reduce((sum, a) => sum + (a.score || 0), 0);
  const averageScore = attempts.length ? total / attempts.length : 0;
  res.json({ attempts: attempts.length, averageScore });
});

module.exports = router;