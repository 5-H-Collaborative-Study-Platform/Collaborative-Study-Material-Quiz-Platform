const request = require("supertest");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const app = require("../index");
const Quiz = require("../models/Quiz");
const Question = require("../models/Question");

const token = () =>
  jwt.sign(
    { id: "6512a0000000000000000004", role: "student" },
    process.env.JWT_SECRET
  );

describe("quiz attempt flow", () => {
  test("GET /api/quizzes/:id hides the correct answer", async () => {
    const question = await Question.create({
      text: "q",
      correctAnswer: "a",
      subject: "S",
      topic: "T",
      options: ["a", "b"],
      addedBy: new mongoose.Types.ObjectId(),
    });

    const quiz = await Quiz.create({
      title: "Q",
      topic: "T",
      questions: [question._id],
      createdBy: new mongoose.Types.ObjectId(),
    });

    const res = await request(app).get(`/api/quizzes/${quiz._id}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.questions[0].correctAnswer).toBeUndefined();
    expect(res.body.questions[0].text).toBe("q");
  });

  test("POST /api/attempts saves an attempt", async () => {
    const quiz = await Quiz.create({
      title: "Q",
      topic: "T",
      questions: [],
      createdBy: new mongoose.Types.ObjectId(),
    });

    const res = await request(app)
      .post("/api/attempts")
      .set("Authorization", `Bearer ${token()}`)
      .send({ quizId: quiz._id, answers: [] });

    expect(res.statusCode).toBe(201);
  });

  test("POST /api/attempts without a token returns 401", async () => {
    const res = await request(app)
      .post("/api/attempts")
      .send({
        quizId: new mongoose.Types.ObjectId(),
        answers: [],
      });

    expect(res.statusCode).toBe(401);
  });
});