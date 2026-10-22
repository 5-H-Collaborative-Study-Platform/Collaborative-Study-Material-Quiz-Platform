const fs = require("fs");
const path = require("path");
const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../index");
const Material = require("../models/Material");

describe("GET /api/materials/:id/download", () => {
  test("downloads an existing file", async () => {
    const dir = path.join(__dirname, "..", "uploads");
    fs.mkdirSync(dir, { recursive: true });
    const fp = path.join(dir, "dl-test.txt");
    fs.writeFileSync(fp, "hello");

    const m = await Material.create({
      title: "T", subject: "Math", topic: "Algebra",
      fileName: "dl-test.txt", filePath: fp, mimeType: "text/plain",
      uploadedBy: new mongoose.Types.ObjectId(),
    });

    const res = await request(app).get(`/api/materials/${m._id}/download`);
    expect(res.statusCode).toBe(200);
    expect(res.text).toContain("hello");
  });

  test("404 for unknown id", async () => {
    const res = await request(app).get(
      `/api/materials/${new mongoose.Types.ObjectId()}/download`,
    );
    expect(res.statusCode).toBe(404);
  });
});
