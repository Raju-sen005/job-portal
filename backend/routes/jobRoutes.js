import express from "express";
import {
  getJobs,
  getJobsForUser,
  createJob,
  updateJob,
  deleteJob,
  getJobById,
} from "../controllers/jobController.js";
import { protect } from "../middleware/authMiddleware.js";
import { protectUser } from "../middleware/userMiddleware.js";

const router = express.Router();

// ✅ Normal users: see all jobs
router.get("/all", protectUser, getJobsForUser);
router.get("/all/:id", protectUser, getJobById);

// ✅ Companies/Admin: see & manage their jobs
router.get("/", protect, getJobs); // GET company jobs
router.get("/:id", protect, getJobById);
router.post("/", protect, createJob);
router.put("/:id", protect, updateJob);
router.delete("/:id", protect, deleteJob);

export default router;
