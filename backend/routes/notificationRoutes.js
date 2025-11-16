import express from "express";
import { protectUser } from "../middleware/userMiddleware.js";
import {
  getUserNotifications,
  markNotificationsRead,
} from "../controllers/notificationController.js";
import { markNotificationReadByJob } from "../controllers/notificationController.js";

const router = express.Router();

router.get("/", protectUser, getUserNotifications);
router.put("/mark-read", protectUser, markNotificationsRead);
router.put("/mark-read/job", protectUser, markNotificationReadByJob);

export default router;
