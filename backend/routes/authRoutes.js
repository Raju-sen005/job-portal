// routes/authRoutes.js
import express from "express";
import { registerUser, loginUser } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";
import { changePassword } from "../controllers/authController.js";


const router = express.Router();

// Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// Protected route example
router.get("/profile", protect, (req, res) => {
  res.json({
    msg: "Profile data fetched successfully",
    user: req.user,
  });
});
// Protected route – change password
router.put("/change-password", protect, changePassword);


export default router;