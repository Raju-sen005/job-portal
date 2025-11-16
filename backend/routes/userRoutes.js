import express from "express";
import { registerUser, loginUser, changePassword } from "../controllers/userController.js";
import { protectUser } from "../middleware/userMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.put("/change-password", protectUser, changePassword); // 👈 new route

export default router;
