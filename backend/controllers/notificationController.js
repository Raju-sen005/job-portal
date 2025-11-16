// controllers/notificationController.js
import Notification from "../models/Notification.js";
import Job from "../models/Job.js";

export const getUserNotifications = async (req, res) => {
  try {
    const notifications = await Notification.findAll({
      where: { userId: req.user.id, read: false },
      include: [{ model: Job, attributes: ["title"] }],
      order: [["createdAt", "DESC"]],
    });

    res.json({ success: true, notifications });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ Mark notifications as read
export const markNotificationsRead = async (req, res) => {
  try {
    await Notification.update(
      { read: true },
      { where: { userId: req.user.id } }
    );
    res.json({ success: true, message: "All notifications marked as read" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ Mark single notification as read by jobId
export const markNotificationReadByJob = async (req, res) => {
  try {
    const { jobId } = req.body;
    await Notification.update(
      { read: true },
      { where: { userId: req.user.id, jobId } }
    );
    res.json({
      success: true,
      message: "Notification for this job marked as read",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};
