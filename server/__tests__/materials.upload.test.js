const request = require("supertest");
const jwt = require("jsonwebtoken");
const app = require("../index");

const token = () =>
  jwt.sign({ id: "6512a0000000000000000001", role: "student" }, process.env.JWT_SECRET);

describe("POST /api/materials", () => {
  test("uploads a pdf -> 201", async () => {
    const res = await request(app)
      .post("/api/materials")
      .set("Authorization", `Bearer ${token()}`)
      .field("title", "Notes")
      .field("subject", "Math")
      .field("topic", "Algebra")
      .attach("file", Buffer.from("%PDF-1.4 test"), {
        filename: "n.pdf",
        contentType: "application/pdf",
      });
    expect(res.statusCode).toBe(201);
    expect(res.body.title).toBe("Notes");
  });

  test("no token -> 401", async () => {
    const res = await request(app)
      .post("/api/materials")
      .attach("file", Buffer.from("x"), {
        filename: "n.pdf",
        contentType: "application/pdf",
      });
    expect(res.statusCode).toBe(401);
  });

  test("disallowed file type -> 400", async () => {
    const res = await request(app)
      .post("/api/materials")
      .set("Authorization", `Bearer ${token()}`)
      .field("title", "Notes")
      .field("subject", "Math")
      .field("topic", "Algebra")
      .attach("file", Buffer.from("MZ"), {
        filename: "n.exe",
        contentType: "application/octet-stream",
      });
    expect(res.statusCode).toBe(400);
  });
});
