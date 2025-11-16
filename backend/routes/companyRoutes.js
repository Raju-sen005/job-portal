import express from "express";
import multer from "multer";
import path from "path";
import {
  createCompany,
  getMyCompany,
  updateCompany,
  getCompanyById,
} from "../controllers/companyControllers.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Multer setup for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});

const upload = multer({ storage });

// Routes
router.post("/", protect, upload.single("companyLogo"), createCompany);
router.get("/me", protect, getMyCompany);
router.put("/", protect, upload.single("companyLogo"), updateCompany); // 👈 new route for update
// 🔹 Public route - get company by ID (no auth required)
router.get("/:id", getCompanyById);

export default router;
