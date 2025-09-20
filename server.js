const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const app = express();
const PORT = 1121;

// Ensure upload folder exists
const uploadDir = path.join(__dirname, "public/uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});

const upload = multer({ storage: storage });

// Upload endpoint
app.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }
  // Return JSON so frontend can build the path
  res.json({ filename: req.file.filename });
});

// Middleware to parse JSON
app.use(express.json());

// Serve static files (HTML, CSS, JS)
app.use(express.static(path.join(__dirname)));

// Serve uploaded images at /uploads
app.use("/uploads", express.static(uploadDir));

// Save profile data (demo only)
app.post("/save", (req, res) => {
  console.log("Received data:", req.body);
  res.json({ success: true, message: "Data saved (demo only)." });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
