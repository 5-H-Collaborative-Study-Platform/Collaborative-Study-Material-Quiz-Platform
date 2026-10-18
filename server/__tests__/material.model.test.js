const mongoose = require("mongoose");
const Material = require("../models/Material");

const base = {
  title: "Algebra Notes",
  subject: "Math",
  topic: "Algebra",
  fileName: "algebra.pdf",
  filePath: "uploads/algebra.pdf",
  mimeType: "application/pdf",
  uploadedBy: new mongoose.Types.ObjectId(),
};

describe("Material model", () => {
  test("creates a material with required fields", async () => {
    const m = await Material.create(base);
    expect(m.title).toBe("Algebra Notes");
    expect(m.description).toBe("");
  });

  test("requires a title", async () => {
    await expect(Material.create({ ...base, title: undefined })).rejects.toThrow();
  });
});
