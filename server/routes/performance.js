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

// GET /api/performance/by-topic  ->  [{ topic, attempts, averageScore }]
router.get("/by-topic", auth, async (req, res) => {
  const attempts = await Attempt.find({ user: req.user.id }).populate(
    "quiz",
    "topic",
  );
  const byTopic = {};
  for (const a of attempts) {
    const topic = a.quiz ? a.quiz.topic : "unknown";
    byTopic[topic] = byTopic[topic] || { topic, total: 0, count: 0 };
    byTopic[topic].total += a.score || 0;
    byTopic[topic].count += 1;
  }
  const result = Object.values(byTopic).map((t) => ({
    topic: t.topic,
    attempts: t.count,
    averageScore: t.total / t.count,
  }));
  res.json(result);
});

// GET /api/performance/over-time  ->  [{ score, submittedAt }] oldest first
router.get("/over-time", auth, async (req, res) => {
  const attempts = await Attempt.find({ user: req.user.id })
    .sort({ submittedAt: 1 })
    .select("score submittedAt");
  res.json(attempts.map((a) => ({ score: a.score, submittedAt: a.submittedAt })));
});

module.exports = router;