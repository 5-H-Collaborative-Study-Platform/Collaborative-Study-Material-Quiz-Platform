// Edge-case tests: auth validation/error paths + performance aggregation branches.
// These cover the failure and boundary cases the happy-path tests don't reach.
const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../index");
const Attempt = require("../models/Attempt");

// Register a user and log in; returns the token and the new user's id.
async function registerAndLogin(email) {
  const reg = await request(app)
    .post("/api/auth/register")
    .send({ name: "Perf User", email, password: "pass1234" });
  const login = await request(app)
    .post("/api/auth/login")
    .send({ email, password: "pass1234" });
  return { token: login.body.token, id: reg.body.id };
}

describe("auth edge cases", () => {
  test("register rejects missing fields (400)", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({ email: "x@test.com" });
    expect(res.statusCode).toBe(400);
  });

  test("register rejects a duplicate email (409)", async () => {
    const email = "dup@test.com";
    await request(app)
      .post("/api/auth/register")
      .send({ name: "A", email, password: "pass1234" });
    const res = await request(app)
      .post("/api/auth/register")
      .send({ name: "B", email, password: "pass1234" });
    expect(res.statusCode).toBe(409);
  });

  test("login rejects missing fields (400)", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "x@test.com" });
    expect(res.statusCode).toBe(400);
  });

  test("login rejects an unknown user (401)", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "nouser@test.com", password: "whatever" });
    expect(res.statusCode).toBe(401);
  });

  test("login rejects a wrong password (401)", async () => {
    const email = "real@test.com";
    await request(app)
      .post("/api/auth/register")
      .send({ name: "R", email, password: "pass1234" });
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email, password: "wrongpass" });
    expect(res.statusCode).toBe(401);
  });
});

describe("performance aggregation edge cases", () => {
  test("/me returns zero average when there are no attempts", async () => {
    const { token } = await registerAndLogin("empty@test.com");
    const res = await request(app)
      .get("/api/performance/me")
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.attempts).toBe(0);
    expect(res.body.averageScore).toBe(0);
  });

  test("/by-topic groups an attempt with a missing quiz under 'unknown'", async () => {
    const { token, id } = await registerAndLogin("orphan@test.com");
    await Attempt.create({
      quiz: new mongoose.Types.ObjectId(),
      user: id,
      score: 80,
    });
    const res = await request(app)
      .get("/api/performance/by-topic")
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body[0].topic).toBe("unknown");
    expect(res.body[0].averageScore).toBe(80);
  });

  test("/over-time returns attempts oldest-first", async () => {
    const { token, id } = await registerAndLogin("timeline@test.com");
    await Attempt.create({
      quiz: new mongoose.Types.ObjectId(),
      user: id,
      score: 40,
      submittedAt: new Date("2026-01-01"),
    });
    await Attempt.create({
      quiz: new mongoose.Types.ObjectId(),
      user: id,
      score: 60,
      submittedAt: new Date("2026-02-01"),
    });
    const res = await request(app)
      .get("/api/performance/over-time")
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.map((a) => a.score)).toEqual([40, 60]);
  });
});