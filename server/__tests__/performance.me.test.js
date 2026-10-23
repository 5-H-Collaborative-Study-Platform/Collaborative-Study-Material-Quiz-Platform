const request = require("supertest");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const app = require("../index");
const Attempt = require("../models/Attempt");

const USER = "6512a0000000000000000005";
const token = () => jwt.sign({ id: USER, role: "student" }, process.env.JWT_SECRET);
const seed = (score) =>
  Attempt.create({
    quiz: new mongoose.Types.ObjectId(),
    user: USER,
    answers: [],
    score,
  });

describe("GET /api/performance/me", () => {
  test("returns the average score across attempts", async () => {
    await seed(60);
    await seed(80);
    const res = await request(app)
      .get("/api/performance/me")
      .set("Authorization", `Bearer ${token()}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.attempts).toBe(2);
    expect(res.body.averageScore).toBe(70);
  });

  test("no token -> 401", async () => {
    const res = await request(app).get("/api/performance/me");
    expect(res.statusCode).toBe(401);
  });
});