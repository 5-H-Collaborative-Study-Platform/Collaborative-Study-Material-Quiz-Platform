const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../index");
const Feedback = require("../models/Feedback");

describe("GET /api/feedback", () => {
  test("returns count and average for a target", async () => {
    const targetId = new mongoose.Types.ObjectId();

    await Feedback.create({
      targetId,
      rating: 4,
      user: new mongoose.Types.ObjectId(),
    });

    await Feedback.create({
      targetId,
      rating: 2,
      user: new mongoose.Types.ObjectId(),
    });

    const res = await request(app).get(
      `/api/feedback?targetId=${targetId}`
    );

    expect(res.statusCode).toBe(200);
    expect(res.body.count).toBe(2);
    expect(res.body.average).toBe(3);
    expect(res.body.feedback).toHaveLength(2);
  });

  test("returns 400 when targetId is missing", async () => {
    const res = await request(app).get("/api/feedback");

    expect(res.statusCode).toBe(400);
  });
});