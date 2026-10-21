const request = require("supertest");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const app = require("../index");
const Question = require("../models/Question");

const token = () =>
  jwt.sign(
    { id: "6512a0000000000000000002", role: "student" },
    process.env.JWT_SECRET
  );

const makeQuestion = (overrides = {}) =>
  Question.create({
    text: "Default question",
    options: ["A", "B"],
    correctAnswer: "A",
    subject: "Math",
    topic: "Algebra",
    difficulty: "medium",
    addedBy: new mongoose.Types.ObjectId(),
    ...overrides,
  });

describe("GET /api/questions", () => {
  beforeEach(async () => {
    await makeQuestion({
      text: "Solve a linear equation",
      subject: "Math",
      topic: "Algebra",
      difficulty: "easy",
    });

    await makeQuestion({
      text: "Calculate the triangle area",
      subject: "Math",
      topic: "Geometry",
      difficulty: "medium",
    });

    await makeQuestion({
      text: "Explain photosynthesis",
      subject: "Science",
      topic: "Biology",
      difficulty: "hard",
    });
  });

  test("returns all questions", async () => {
    const res = await request(app)
      .get("/api/questions")
      .set("Authorization", `Bearer ${token()}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveLength(3);
  });

  test("filters by subject", async () => {
    const res = await request(app)
      .get("/api/questions?subject=Math")
      .set("Authorization", `Bearer ${token()}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveLength(2);
    expect(res.body.every((q) => q.subject === "Math")).toBe(true);
  });

  test("filters by topic", async () => {
    const res = await request(app)
      .get("/api/questions?topic=Biology")
      .set("Authorization", `Bearer ${token()}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].topic).toBe("Biology");
  });

  test("filters by difficulty", async () => {
    const res = await request(app)
      .get("/api/questions?difficulty=hard")
      .set("Authorization", `Bearer ${token()}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].difficulty).toBe("hard");
  });

  test("searches question text case-insensitively", async () => {
    const res = await request(app)
      .get("/api/questions?q=LINEAR EQUATION")
      .set("Authorization", `Bearer ${token()}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].text).toBe("Solve a linear equation");
  });

  test("combines filters", async () => {
    const res = await request(app)
      .get("/api/questions?subject=Math&difficulty=easy&q=linear")
      .set("Authorization", `Bearer ${token()}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].text).toBe("Solve a linear equation");
  });

  test("returns an empty array when nothing matches", async () => {
    const res = await request(app)
      .get("/api/questions?subject=History")
      .set("Authorization", `Bearer ${token()}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([]);
  });

  test("rejects an invalid difficulty", async () => {
    const res = await request(app)
      .get("/api/questions?difficulty=extreme")
      .set("Authorization", `Bearer ${token()}`);

    expect(res.statusCode).toBe(400);
  });

  test("rejects requests without authentication", async () => {
    const res = await request(app).get("/api/questions");

    expect(res.statusCode).toBe(401);
  });
});
