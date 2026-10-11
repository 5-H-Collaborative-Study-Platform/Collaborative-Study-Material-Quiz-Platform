require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => res.json({ status: "ok" }));

// app.use("/api/auth", require("./routes/auth")); // Bharat enables this

const PORT = process.env.PORT || 5000;

if (require.main === module) {
  connectDB(process.env.MONGO_URI)
    .then(() => app.listen(PORT, () => console.log(`Server on ${PORT}`)))
    .catch((err) => {
      console.error("Failed to start:", err.message);
      process.exit(1);
    });
}

module.exports = app;
