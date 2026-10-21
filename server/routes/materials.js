const express = require("express");
const Material = require("../models/Material");
const auth = require("../middleware/auth");
const upload = require("../middleware/upload");

const router = express.Router();

// POST /api/materials  (multipart: file + title/subject/topic)
router.post("/", auth, (req, res) => {
  upload.single("file")(req, res, async (err) => {
    if (err) return res.status(400).json({ error: err.message });
    if (!req.file) return res.status(400).json({ error: "File is required" });

    const { title, subject, topic, description } = req.body;
    if (!title || !subject || !topic) {
      return res
        .status(400)
        .json({ error: "title, subject and topic are required" });
    }

    const material = await Material.create({
      title,
      description: description || "",
      subject,
      topic,
      fileName: req.file.originalname,
      filePath: req.file.path,
      mimeType: req.file.mimetype,
      uploadedBy: req.user.id,
    });

    res.status(201).json(material);
  });
});

module.exports = router;
