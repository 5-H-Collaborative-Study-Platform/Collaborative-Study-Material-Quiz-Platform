const request = require("supertest");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const app = require("../index");
const Quiz = require("../models/Quiz");
const Question = require("../models/Question");

const token = () =>
  jwt.sign(
    { id: "6512a0000000000000000008", role: "student" },
    process.env.JWT_SECRET
  );

describe("auto-grading attempts", () => {
  test("scores a submission against the correct answers", async () => {
    const q1 = await Question.create({
      text: "a",
      correctAnswer: "4",
      subject: "S",
      topic: "T",
      addedBy: new mongoose.Types.ObjectId(),
    });

    const q2 = await Question.create({
      text: "b",
      correctAnswer: "9",
      subject: "S",
      topic: "T",
      addedBy: new mongoose.Types.ObjectId(),
    });

    const quiz = await Quiz.create({
      title: "Q",
      topic: "T",
      questions: [q1._id, q2._id],
      createdBy: new mongoose.Types.ObjectId(),
    });

    const res = await request(app)
      .post("/api/attempts")
      .set("Authorization", `Bearer ${token()}`)
      .send({
        quizId: quiz._id,
        answers: [
          { question: q1._id, selected: "4" },
          { question: q2._id, selected: "wrong" },
        ],
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.score).toBe(50);
  });

  test("a fully correct submission scores 100", async () => {
    const q = await Question.create({
      text: "a",
      correctAnswer: "4",
      subject: "S",
      topic: "T",
      addedBy: new mongoose.Types.ObjectId(),
    });

    const quiz = await Quiz.create({
      title: "Q",
      topic: "T",
      questions: [q._id],
      createdBy: new mongoose.Types.ObjectId(),
    });

    const res = await request(app)
      .post("/api/attempts")
      .set("Authorization", `Bearer ${token()}`)
      .send({
        quizId: quiz._id,
        answers: [{ question: q._id, selected: "4" }],
      });

    expect(res.body.score).toBe(100);
  });
});