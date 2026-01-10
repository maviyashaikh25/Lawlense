const express = require("express");
const cors = require("cors");

const app = express();
const authRoutes = require("./routes/auth.routes");
const documentRoutes = require("./routes/document.routes");

/* ---------- GLOBAL MIDDLEWARES ---------- */
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ---------- ROUTES ---------- */
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "LawLens Backend is running 🚀",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/documents", documentRoutes);
app.use("/api", require("./routes/search.routes"));
app.use("/api/chat", require("./routes/chat.routes"));

/* ---------- ERROR HANDLER ---------- */
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

module.exports = app;
