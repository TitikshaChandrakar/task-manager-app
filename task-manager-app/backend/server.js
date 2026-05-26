const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const authRoutes     = require("./routes/authRoutes");
const taskRoutes     = require("./routes/taskRoutes");
const categoryRoutes = require("./routes/categoryRoutes");

const app = express();

// ── Middleware ────────────────────────────────────────────────────────────────

app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true,
}));

app.use(express.json({ limit: "10kb" }));   // reject oversized payloads
app.use(express.urlencoded({ extended: true }));

// ── Routes ────────────────────────────────────────────────────────────────────

app.use("/api/auth",       authRoutes);
app.use("/api/tasks",      taskRoutes);
app.use("/api/categories", categoryRoutes);

// Health check — GET /health
app.get("/health", (req, res) => {
  const states = { 0: "disconnected", 1: "connected", 2: "connecting", 3: "disconnecting" };
  res.json({
    status: "ok",
    db: states[mongoose.connection.readyState] ?? "unknown",
    uptime: process.uptime(),
  });
});

// 404 handler — catches any unmatched route
app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.method} ${req.originalUrl} not found` });
});

// Global error handler
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(err.status || 500).json({
    message: err.message || "Internal server error",
  });
});

// ── MongoDB connection ────────────────────────────────────────────────────────

const MONGO_URI = process.env.MONGO_URI;
const PORT      = process.env.PORT || 5000;

if (!MONGO_URI) {
  console.error("❌  MONGO_URI is not defined in .env");
  process.exit(1);
}

mongoose.connection.on("connected",    () => console.log("✅  MongoDB connected"));
mongoose.connection.on("error",   (e) => console.error("❌  MongoDB error:", e.message));
mongoose.connection.on("disconnected", () => console.warn("⚠️   MongoDB disconnected"));

// Graceful shutdown
process.on("SIGINT", async () => {
  await mongoose.connection.close();
  console.log("MongoDB connection closed — process exiting");
  process.exit(0);
});

mongoose
  .connect(MONGO_URI, { serverSelectionTimeoutMS: 5000 })
  .then(() => {
    app.listen(PORT, () => console.log(`🚀  Server running on http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error("❌  Failed to connect to MongoDB:", err.message);
    process.exit(1);
  });
