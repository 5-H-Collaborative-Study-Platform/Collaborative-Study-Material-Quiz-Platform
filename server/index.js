require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/auth", require("./routes/auth"));
app.use("/api/questions", require("./routes/questions"));
app.use("/api/materials", require("./routes/materials"));
app.use("/api/quizzes", require("./routes/quizzes"));
app.use("/api/attempts", require("./routes/attempts"));
app.use("/api/performance", require("./routes/performance"));
app.get("/api/health", (req, res) => res.json({ status: "ok" }));


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
