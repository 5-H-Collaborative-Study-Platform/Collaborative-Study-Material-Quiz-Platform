const mongoose = require("mongoose");
const Quiz = require("../models/Quiz");
const Attempt = require("../models/Attempt");

describe("Quiz & Attempt models", () => {
  test("creates a quiz with a title and topic", async () => {
    const quiz = await Quiz.create({
      title: "Algebra Quiz",
      topic: "Algebra",
      questions: [],
      createdBy: new mongoose.Types.ObjectId(),
    });

    expect(quiz.title).toBe("Algebra Quiz");
  });

  test("a quiz requires a title", async () => {
    await expect(
      Quiz.create({
        topic: "Algebra",
        createdBy: new mongoose.Types.ObjectId(),
      }),
    ).rejects.toThrow();
  });

  test("creates an attempt linked to a quiz and user", async () => {
    const attempt = await Attempt.create({
      quiz: new mongoose.Types.ObjectId(),
      user: new mongoose.Types.ObjectId(),
      answers: [],
    });

    expect(attempt.score).toBe(0);
  });
});