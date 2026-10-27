const request = require("supertest");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const app = require("../index");
const Attempt = require("../models/Attempt");

const USER = "6512a0000000000000000009";
const token = () => jwt.sign({ id: USER, role: "student" }, process.env.JWT_SECRET);

describe("GET /api/performance/over-time", () => {
  test("returns attempts ordered oldest-first", async () => {
    await Attempt.create({
      quiz: new mongoose.Types.ObjectId(),
      user: USER,
      answers: [],
      score: 40,
      submittedAt: new Date("2026-01-01"),
    });
    await Attempt.create({
      quiz: new mongoose.Types.ObjectId(),
      user: USER,
      answers: [],
      score: 90,
      submittedAt: new Date("2026-02-01"),
    });
    const res = await request(app)
      .get("/api/performance/over-time")
      .set("Authorization", `Bearer ${token()}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveLength(2);
    expect(res.body[0].score).toBe(40);
    expect(res.body[1].score).toBe(90);
  });
});