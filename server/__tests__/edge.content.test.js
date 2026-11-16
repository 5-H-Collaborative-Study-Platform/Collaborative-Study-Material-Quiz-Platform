
// Edge-case tests: validation and error paths for questions, quizzes,
// feedback and materials. These cover the branches the happy-path tests miss.

const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../index");

// Register a user and log in; returns a bearer token.
async function tokenFor(email) {
  await request(app)
    .post("/api/auth/register")
    .send({
      name: "Content User",
      email,
      password: "pass1234",
    });

  const login = await request(app)
    .post("/api/auth/login")
    .send({
      email,
      password: "pass1234",
    });

  return login.body.token;
}

describe("questions edge cases", () => {
  test("search rejects an invalid difficulty (400)", async () => {
    const token = await tokenFor("q1@test.com");

    const res = await request(app)
      .get("/api/questions?difficulty=impossible")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(400);
  });

  test("create rejects missing required fields (400)", async () => {
    const token = await tokenFor("q2@test.com");

    const res = await request(app)
      .post("/api/questions")
      .set("Authorization", `Bearer ${token}`)
      .send({ text: "Only text" });

    expect(res.statusCode).toBe(400);
  });

  test("create rejects options that are not an array of strings (400)", async () => {
    const token = await tokenFor("q3@test.com");

    const res = await request(app)
      .post("/api/questions")
      .set("Authorization", `Bearer ${token}`)
      .send({
        text: "2+2?",
        correctAnswer: "4",
        subject: "Math",
        topic: "Algebra",
        options: "not-an-array",
      });

    expect(res.statusCode).toBe(400);
  });

  test("create rejects an invalid question type via schema validation (400)", async () => {
    const token = await tokenFor("q4@test.com");

    const res = await request(app)
      .post("/api/questions")
      .set("Authorization", `Bearer ${token}`)
      .send({
        text: "2+2?",
        correctAnswer: "4",
        subject: "Math",
        topic: "Algebra",
        type: "bogus-type",
      });

    expect(res.statusCode).toBe(400);
  });
});

describe("quizzes edge cases", () => {
  test("create rejects missing fields (400)", async () => {
    const token = await tokenFor("qz1@test.com");

    const res = await request(app)
      .post("/api/quizzes")
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "No questions" });

    expect(res.statusCode).toBe(400);
  });

  test("create rejects questions that do not exist (400)", async () => {
    const token = await tokenFor("qz2@test.com");

    const res = await request(app)
      .post("/api/quizzes")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Ghost",
        topic: "Algebra",
        questionIds: [new mongoose.Types.ObjectId().toString()],
      });

    expect(res.statusCode).toBe(400);
  });

  test("create rejects a malformed question id (400)", async () => {
    const token = await tokenFor("qz3@test.com");

    const res = await request(app)
      .post("/api/quizzes")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Bad id",
        topic: "Algebra",
        questionIds: ["not-an-id"],
      });

    expect(res.statusCode).toBe(400);
  });

  test("fetching a non-existent quiz returns 404", async () => {
    const res = await request(app).get(
      `/api/quizzes/${new mongoose.Types.ObjectId().toString()}`
    );

    expect(res.statusCode).toBe(404);
  });

  test("fetching a quiz with a malformed id returns 500", async () => {
    const res = await request(app).get("/api/quizzes/not-a-valid-id");

    expect(res.statusCode).toBe(500);
  });
});

describe("feedback edge cases", () => {
  test("submit rejects missing targetId/rating (400)", async () => {
    const token = await tokenFor("fb1@test.com");

    const res = await request(app)
      .post("/api/feedback")
      .set("Authorization", `Bearer ${token}`)
      .send({ comment: "no target or rating" });

    expect(res.statusCode).toBe(400);
  });

  test("fetch requires a targetId (400)", async () => {
    const res = await request(app).get("/api/feedback");

    expect(res.statusCode).toBe(400);
  });

  test("fetch rejects an invalid targetId (400)", async () => {
    const res = await request(app).get(
      "/api/feedback?targetId=not-an-id"
    );

    expect(res.statusCode).toBe(400);
  });
});

describe("materials edge cases", () => {
  test("upload rejects missing title/subject/topic (400)", async () => {
    const token = await tokenFor("m1@test.com");

    const res = await request(app)
      .post("/api/materials")
      .set("Authorization", `Bearer ${token}`)
      .field("subject", "Math")
      .field("topic", "Algebra")
      .attach("file", Buffer.from("%PDF-1.4 test"), {
        filename: "a.pdf",
        contentType: "application/pdf",
      });

    expect(res.statusCode).toBe(400);
  });
});