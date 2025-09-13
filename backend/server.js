require('dotenv').config();
const express = require("express");
const pool = require("./db/dbconnec");

const app = express();
app.use(express.json());

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "Server is running", timestamp: new Date().toISOString() });
});

// Database test endpoint
app.get("/test-db", async (req, res) => {
  try {
    console.log("Testing database connection...");
    const result = await pool.query("SELECT NOW() as current_time, version() as postgres_version");
    console.log("Database query successful");
    res.json({ 
      success: true,
      time: result.rows[0].current_time,
      version: result.rows[0].postgres_version,
      message: "Database connection successful"
    });
  } catch (err) {
    console.error("Database connection error:", err.message);
    console.error("Error details:", err);
    res.status(500).json({ 
      success: false,
      error: "DB connection failed",
      details: err.message,
      code: err.code
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal server error" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🔍 DB test: http://localhost:${PORT}/test-db`);
});