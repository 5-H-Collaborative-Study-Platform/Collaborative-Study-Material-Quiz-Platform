const request = require("supertest");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const app = require("../index");
const Feedback = require("../models/Feedback");

const token = () =>
  jwt.sign(
    { id: "6512a0000000000000000009", role: "student" },
    process.env.JWT_SECRET,
  );

describe("submit feedback", () => {
  test("POST /api/feedback saves a rating and comment", async () => {
    const targetId = new mongoose.Types.ObjectId();

    const res = await request(app)
      .post("/api/feedback")
      .set("Authorization", `Bearer ${token()}`)
      .send({ targetId, rating: 5, comment: "Great material" });

    expect(res.statusCode).toBe(201);
    expect(res.body.rating).toBe(5);
    expect(res.body.comment).toBe("Great material");
    expect(res.body.targetType).toBe("material");

    const saved = await Feedback.findById(res.body._id);
    expect(saved).not.toBeNull();
  });

  test("rejects a rating outside 1-5", async () => {
    const res = await request(app)
      .post("/api/feedback")
      .set("Authorization", `Bearer ${token()}`)
      .send({ targetId: new mongoose.Types.ObjectId(), rating: 6 });

    expect(res.statusCode).toBe(400);
  });

  test("requires authentication", async () => {
    const res = await request(app)
      .post("/api/feedback")
      .send({ targetId: new mongoose.Types.ObjectId(), rating: 4 });

    expect(res.statusCode).toBe(401);
  });
});
