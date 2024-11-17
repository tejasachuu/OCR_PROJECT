const express = require("express");
const bodyParser = require("body-parser");
const crypto = require("crypto");
const cors = require("cors");
const multer = require("multer");
const tesseract = require("tesseract.js");
const path = require("path");

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));

// In-memory database for API keys
const apiKeys = new Set();

// Multer setup for handling file uploads
const upload = multer({ dest: "uploads/" });

// Generate API Key
app.post("/generate-api", (req, res) => {
  const apiKey = crypto.randomBytes(16).toString("hex");
  apiKeys.add(apiKey);
  res.json({ apiKey });
});

// OCR Endpoint
app.post("/ocr", upload.single("image"), async (req, res) => {
  const { apiKey } = req.body;

  // Check API Key
  if (!apiKeys.has(apiKey)) {
    return res.status(403).json({ error: "Invalid API Key" });
  }

  // Perform OCR
  try {
    const imagePath = req.file.path;
    const { data } = await tesseract.recognize(imagePath);
    res.json({ text: data.text });
  } catch (err) {
    res.status(500).json({ error: "OCR Processing Failed", details: err.message });
  }
});

// Serve Frontend
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
