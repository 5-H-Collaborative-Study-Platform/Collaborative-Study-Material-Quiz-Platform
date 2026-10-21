const request = require("supertest");
const jwt = require("jsonwebtoken");
const app = require("../index");

const token = () =>
  jwt.sign(
    { id: "6512a0000000000000000002", role: "student" },
    process.env.JWT_SECRET
  );

const body = {
  text: "2 + 2 = ?",
  options: ["3", "4"],
  correctAnswer: "4",
  subject: "Math",
  topic: "Addition",
};

describe("POST /api/questions", () => {
  test("creates a question -> 201", async () => {
    const res = await request(app)
      .post("/api/questions")
      .set("Authorization", `Bearer ${token()}`)
      .send(body);

    expect(res.statusCode).toBe(201);
    expect(res.body.text).toBe(body.text);
    expect(res.body.options).toEqual(body.options);
    expect(res.body.addedBy).toBe("6512a0000000000000000002");
  });

  test("no token -> 401", async () => {
    const res = await request(app).post("/api/questions").send(body);

    expect(res.statusCode).toBe(401);
  });

  test("missing text -> 400", async () => {
    const res = await request(app)
      .post("/api/questions")
      .set("Authorization", `Bearer ${token()}`)
      .send({ ...body, text: "" });

    expect(res.statusCode).toBe(400);
  });
});
