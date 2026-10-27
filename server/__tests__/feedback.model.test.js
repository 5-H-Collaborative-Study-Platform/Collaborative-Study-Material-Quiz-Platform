const mongoose = require("mongoose");
const Feedback = require("../models/Feedback");

const base = {
  targetId: new mongoose.Types.ObjectId(),
  user: new mongoose.Types.ObjectId(),
  rating: 4,
  comment: "Very helpful",
};

describe("Feedback model", () => {
  test("creates feedback with required fields", async () => {
    const f = await Feedback.create(base);
    expect(f.rating).toBe(4);
    expect(f.targetType).toBe("material");
    expect(f.comment).toBe("Very helpful");
  });

  test("requires a rating", async () => {
    await expect(
      Feedback.create({ ...base, rating: undefined }),
    ).rejects.toThrow();
  });

  test("rejects a rating above 5", async () => {
    await expect(Feedback.create({ ...base, rating: 6 })).rejects.toThrow();
  });
});
