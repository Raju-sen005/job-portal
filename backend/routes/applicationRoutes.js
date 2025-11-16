import express from "express";
import {
  applyForJob,
  getMyApplications,
  getApplicationsByJob,
  getAllApplicationsForCompany,
  markApplicationsRead,
} from "../controllers/applicationController.js";
import { protect } from "../middleware/authMiddleware.js"; // company/admin
import { protectUser } from "../middleware/userMiddleware.js"; // normal user
import { protectCompany } from "../middleware/companyMiddleware.js";

const router = express.Router();

// ✅ User applies for a job
router.post("/", protectUser, applyForJob);

// ✅ Get my applications (user)
router.get("/me", protectUser, getMyApplications);

// ✅ Get all applicants for a specific job (admin/company)
router.get("/job/:jobId", protect, getApplicationsByJob);

// routes/applicationRoutes.js
router.get("/company/all", protectCompany, getAllApplicationsForCompany);
// routes/applicationRoutes.js
router.put("/mark-read", protectCompany, markApplicationsRead);
export default router;
