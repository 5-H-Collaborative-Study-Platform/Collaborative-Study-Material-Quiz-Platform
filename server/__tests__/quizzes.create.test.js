const request = require("supertest");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const app = require("../index");
const Question = require("../models/Question");

const token = () =>
  jwt.sign(
    { id: "6512a0000000000000000003", role: "student" },
    process.env.JWT_SECRET
  );

const makeQ = () =>
  Question.create({
    text: "q",
    correctAnswer: "a",
    subject: "S",
    topic: "T",
    addedBy: new mongoose.Types.ObjectId(),
  });

describe("POST /api/quizzes", () => {
  test("creates a quiz from existing questions", async () => {
    const q1 = await makeQ();
    const q2 = await makeQ();

    const res = await request(app)
      .post("/api/quizzes")
      .set("Authorization", `Bearer ${token()}`)
      .send({
        title: "Quiz 1",
        topic: "T",
        questionIds: [q1._id, q2._id],
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.questions).toHaveLength(2);
  });

  test("rejects an empty question list", async () => {
    const res = await request(app)
      .post("/api/quizzes")
      .set("Authorization", `Bearer ${token()}`)
      .send({ title: "Q", topic: "T", questionIds: [] });

    expect(res.statusCode).toBe(400);
  });

  test("rejects questions that do not exist", async () => {
    const res = await request(app)
      .post("/api/quizzes")
      .set("Authorization", `Bearer ${token()}`)
      .send({
        title: "Q",
        topic: "T",
        questionIds: [new mongoose.Types.ObjectId()],
      });

    expect(res.statusCode).toBe(400);
  });
});