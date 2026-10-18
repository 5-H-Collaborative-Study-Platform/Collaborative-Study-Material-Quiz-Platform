
const mongoose = require("mongoose");
const Question = require("../models/Question");

const base = {
  text: "2 + 2 = ?",
  options: ["3", "4"],
  correctAnswer: "4",
  subject: "Math",
  topic: "Addition",
  addedBy: new mongoose.Types.ObjectId(),
};

describe("Question model", () => {
  test("creates with sensible defaults", async () => {
    const q = await Question.create(base);

    expect(q.difficulty).toBe("medium");
    expect(q.type).toBe("mcq");
  });

  test("requires text", async () => {
    await expect(
      Question.create({ ...base, text: undefined })
    ).rejects.toThrow();
  });

  test("rejects an invalid difficulty", async () => {
    await expect(
      Question.create({ ...base, difficulty: "insane" })
    ).rejects.toThrow();
  });
});
