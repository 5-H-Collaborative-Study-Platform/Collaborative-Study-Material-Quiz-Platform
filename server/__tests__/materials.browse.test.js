const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../index");
const Material = require("../models/Material");

const seed = (over) =>
  Material.create({
    title: "T", subject: "Math", topic: "Algebra",
    fileName: "f.pdf", filePath: "uploads/f.pdf", mimeType: "application/pdf",
    uploadedBy: new mongoose.Types.ObjectId(), ...over,
  });

describe("GET /api/materials", () => {
  test("lists all materials", async () => {
    await seed();
    await seed({ subject: "Science", topic: "Physics" });
    const res = await request(app).get("/api/materials");
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveLength(2);
  });

  test("filters by subject", async () => {
    await seed();
    await seed({ subject: "Science" });
    const res = await request(app).get("/api/materials?subject=Science");
    expect(res.body).toHaveLength(1);
    expect(res.body[0].subject).toBe("Science");
  });

  test("searches title with q (case-insensitive)", async () => {
    await seed({ title: "Linear Algebra Notes" });
    await seed({ title: "Optics" });
    const res = await request(app).get("/api/materials?q=algebra");
    expect(res.body).toHaveLength(1);
    expect(res.body[0].title).toBe("Linear Algebra Notes");
  });

  test("q with regex characters does not crash", async () => {
    await seed({ title: "C++ basics" });
    const res = await request(app).get("/api/materials?q=c%2B%2B");
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveLength(1);
  });
});
