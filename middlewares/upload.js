import multer from "multer";
import path from "node:path";
import crypto from "node:crypto";

// Storage engine
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads");
  },

  filename: function (req, file, cb) {
    const uniqueName = crypto.randomBytes(16).toString("hex");
    const ext = path.extname(file.originalname);
    cb(null, uniqueName + ext);
  },
});

// File filter (optional — allows only images)
function fileFilter(req, file, cb) {
  const allowed = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
  if (allowed.includes(file.mimetype)) cb(null, true);
  else cb(new Error("Only image files are allowed."), false);
}

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

export default upload;
