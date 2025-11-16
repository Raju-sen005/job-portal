import express from "express";
import multer from "multer";
import { createProfile, getProfiles,getProfileById } from "../controllers/profileController.js";
import { protectUser } from "../middleware/userMiddleware.js";
import { getMyProfile } from "../controllers/profileController.js";


const router = express.Router();

// File Upload setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + "-" + file.originalname)
});

const upload = multer({ storage });

// Routes
// routes/profileRoutes.js
router.post(
  "/", 
  protectUser, // 🟢 must come BEFORE controller
  upload.single("profileImage"), 
  createProfile
);

router.get("/", getProfiles);
router.get("/me", protectUser, getMyProfile);
router.get("/:id", getProfileById);

export default router;