const multer = require("multer");
const path = require("path");

// =========================
// KONFIGURASI STORAGE
// =========================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

// =========================
// FILTER FILE
// =========================
const fileFilter = (req, file, cb) => {
  const allowed = /jpg|jpeg|png/;
  const ext = path.extname(file.originalname).toLowerCase();

  if (allowed.test(ext)) {
    cb(null, true);
  } else {
    cb(new Error("Hanya file JPG, JPEG, PNG"), false);
  }
};

// =========================
// EXPORT MULTER INSTANCE
// =========================
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB
  },
});

module.exports = upload; // ⬅️ PENTING
