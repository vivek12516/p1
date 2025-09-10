const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Ensure directory exists before storing files
const ensureDirExists = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

// Configure Multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let folder = "uploads/misc";

    // Route based on MIME type
    if (file.mimetype.startsWith("image/")) {
      folder = "uploads/images";
    } else if (file.mimetype === "application/pdf") {
      folder = "uploads/pdfs";
    } else if (file.mimetype.startsWith("video/")) {
      folder = "uploads/videos";
    } else if (file.mimetype.startsWith("audio/")) {
      folder = "uploads/audio";
    }

    const fullPath = path.join(__dirname, "..", folder);
    ensureDirExists(fullPath);
    cb(null, fullPath);
  },
  filename: function (req, file, cb) {
    // Create unique filename with timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext);
    cb(null, `${name}-${uniqueSuffix}${ext}`);
  },
});

// File filter for security
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "image/jpeg", 
    "image/png", 
    "image/gif",
    "image/webp",
    "application/pdf",
    "video/mp4",
    "video/webm",
    "video/ogg",
    "audio/mpeg",
    "audio/wav",
    "audio/ogg"
  ];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Unsupported file type: ${file.mimetype}`), false);
  }
};

// Configure multer with size limits
const upload = multer({ 
  storage, 
  fileFilter,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB limit
    files: 10 // Max 10 files per request
  }
});

module.exports = upload;