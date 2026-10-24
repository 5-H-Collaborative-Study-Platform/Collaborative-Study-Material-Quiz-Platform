const request = require("supertest");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const app = require("../index");
const Attempt = require("../models/Attempt");
const Quiz = require("../models/Quiz");

const USER = "6512a0000000000000000006";
const token = () => jwt.sign({ id: USER, role: "student" }, process.env.JWT_SECRET);

describe("GET /api/performance/by-topic", () => {
  test("groups the average score by quiz topic", async () => {
    const quiz = await Quiz.create({
      title: "Q",
      topic: "Algebra",
      questions: [],
      createdBy: new mongoose.Types.ObjectId(),
    });
    await Attempt.create({ quiz: quiz._id, user: USER, answers: [], score: 50 });
    await Attempt.create({ quiz: quiz._id, user: USER, answers: [], score: 100 });

    const res = await request(app)
      .get("/api/performance/by-topic")
      .set("Authorization", `Bearer ${token()}`);
    expect(res.statusCode).toBe(200);
    const algebra = res.body.find((t) => t.topic === "Algebra");
    expect(algebra.averageScore).toBe(75);
  });
});