// Full system (end-to-end) test.
//
// Unlike the unit tests, this drives one complete user journey through the
// whole stack in a single flow: register -> login -> upload material ->
// browse -> add a question -> build a quiz -> attempt it (auto-grading) ->
// read the performance dashboard -> leave feedback. Every step uses the real
// Express app and the in-memory MongoDB, exactly as the running server would.
//
// It is one test on purpose: the shared test setup wipes the database between
// tests, so the journey must run start-to-finish in a single test block.

const request = require("supertest");
const app = require("../index");

describe("System end-to-end: full study/quiz journey", () => {
  test("a student can register, contribute, attempt a quiz and see results", async () => {
    const email = `student_${Date.now()}@test.com`;

    // 1. Register a new student.
    const register = await request(app)
      .post("/api/auth/register")
      .send({ name: "E2E Student", email, password: "pass1234" });
    expect(register.statusCode).toBe(201);
    expect(register.body.email).toBe(email);

    // 2. Log in and collect the auth token used for every protected call.
    const login = await request(app)
      .post("/api/auth/login")
      .send({ email, password: "pass1234" });
    expect(login.statusCode).toBe(200);
    const token = login.body.token;
    expect(typeof token).toBe("string");
    const authHeader = ["Authorization", `Bearer ${token}`];

    // 3. Upload a study material (multipart file + metadata).
    const upload = await request(app)
      .post("/api/materials")
      .set(...authHeader)
      .field("title", "Algebra Notes")
      .field("subject", "Math")
      .field("topic", "Algebra")
      .attach("file", Buffer.from("%PDF-1.4 minimal test pdf"), {
        filename: "algebra.pdf",
        contentType: "application/pdf",
      });
    expect(upload.statusCode).toBe(201);
    expect(upload.body.title).toBe("Algebra Notes");

    // 4. Browse materials and confirm the upload is listed.
    const browse = await request(app).get("/api/materials");
    expect(browse.statusCode).toBe(200);
    expect(browse.body.length).toBeGreaterThanOrEqual(1);

    // 5. Contribute two questions to the question bank.
    const q1 = await request(app)
      .post("/api/questions")
      .set(...authHeader)
      .send({
        text: "2 + 2 = ?",
        options: ["3", "4"],
        correctAnswer: "4",
        subject: "Math",
        topic: "Algebra",
        difficulty: "easy",
        type: "mcq",
      });
    expect(q1.statusCode).toBe(201);

    const q2 = await request(app)
      .post("/api/questions")
      .set(...authHeader)
      .send({
        text: "Capital of France?",
        options: ["Paris", "Rome"],
        correctAnswer: "Paris",
        subject: "GK",
        topic: "Geography",
        difficulty: "easy",
        type: "mcq",
      });
    expect(q2.statusCode).toBe(201);

    // 6. Build a quiz from those questions.
    const quiz = await request(app)
      .post("/api/quizzes")
      .set(...authHeader)
      .send({
        title: "Mixed Quiz",
        topic: "Algebra",
        questionIds: [q1.body._id, q2.body._id],
      });
    expect(quiz.statusCode).toBe(201);

    // 7. Attempt the quiz: one right, one wrong -> auto-graded 50%.
    const attempt = await request(app)
      .post("/api/attempts")
      .set(...authHeader)
      .send({
        quizId: quiz.body._id,
        answers: [
          { question: q1.body._id, selected: "4" },
          { question: q2.body._id, selected: "Rome" },
        ],
      });
    expect(attempt.statusCode).toBe(201);
    expect(attempt.body.score).toBe(50);

    // 8. The performance dashboard reflects that attempt.
    const performance = await request(app)
      .get("/api/performance/me")
      .set(...authHeader);
    expect(performance.statusCode).toBe(200);
    expect(performance.body.attempts).toBe(1);
    expect(performance.body.averageScore).toBe(50);

    // 9. Leave feedback on the quiz.
    const feedback = await request(app)
      .post("/api/feedback")
      .set(...authHeader)
      .send({
        targetId: quiz.body._id,
        targetType: "quiz",
        rating: 5,
        comment: "Helpful quiz",
      });
    expect(feedback.statusCode).toBe(201);
    expect(feedback.body.rating).toBe(5);
  });
});