import Application from "../models/Application.js";
import User from "../models/User.js";
import Job from "../models/Job.js";
import Profile from "../models/Profile.js";

// ✅ Apply for a Job
export const applyForJob = async (req, res) => {
  try {
    const { jobId, coverLetter, resumeUrl } = req.body;
    const userId = req.user.id; // from JWT auth middleware

    // check if already applied
    const existing = await Application.findOne({ where: { userId, jobId } });
    if (existing) {
      return res.status(400).json({ message: "Already applied for this job" });
    }

    const newApp = await Application.create({
      userId,
      jobId,
      coverLetter,
      resumeUrl,
    });

    res.status(201).json({
      success: true,
      message: "Application submitted successfully",
      application: newApp,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Get all applications of logged-in user
export const getMyApplications = async (req, res) => {
  try {
    const userId = req.user.id;
    const apps = await Application.findAll({
      where: { userId },
      include: [{ model: Job }],
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({ success: true, applications: apps });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Get all applications for a specific job (Admin / Company)
// export const getApplicationsByJob = async (req, res) => {
//   try {
//     const jobId = req.params.jobId;
//     const apps = await Application.findAll({
//       where: { jobId },
//       include: [{ model: User }],
//     });

//     res.status(200).json({ success: true, applications: apps });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// ✅ Get all applications for a specific job (Admin / Company)
export const getApplicationsByJob = async (req, res) => {
  try {
    const jobId = req.params.jobId;

    const apps = await Application.findAll({
      where: { jobId },
      include: [
        {
          model: User,
          attributes: ["name", "email"],
          include: [
            {
              model: Profile,
              attributes: ["profileImage","phone","skills","city"], // Profile nested inside User
            },
          ],
        },
      ],
      attributes: ["id", "createdAt"],
    });

    res.status(200).json({ success: true, applications: apps });
  } catch (error) {
    console.error("Get Applications Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Get latest applications for logged-in company
// controllers/applicationController.js
export const getAllApplicationsForCompany = async (req, res) => {
  try {
    const company = req.company; // middleware se aaya

    // Company ke jobs fetch karo
    const jobs = await Job.findAll({
      where: { companyId: company.id },
      attributes: ["id", "title"],
    });

    const jobIds = jobs.map((job) => job.id);
    if (jobIds.length === 0)
      return res.json({ success: true, applications: [] });
    
    // Applications fetch karo user aur profile ke saath
    const applications = await Application.findAll({
      where: { jobId: jobIds },
      include: [
        {
          model: User,
          attributes: ["id", "name", "email"],
          include: [
            {
              model: Profile,
              attributes: ["profileImage"], // ✅ fetch profileImage
            },
          ],
        },
        {
          model: Job,
          attributes: ["id", "title"],
        },
      ],

      order: [["createdAt", "DESC"]],
    });

    res.json({ success: true, applications });
  } catch (error) {
    console.error("Error fetching applications:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// controllers/applicationController.js
export const markApplicationsRead = async (req, res) => {
  try {
    const { jobId } = req.body;
    const companyId = req.company?.id; // ✅ correct

    if (!jobId) return res.status(400).json({ message: "Job ID required" });

    const job = await Job.findOne({ where: { id: jobId, companyId } });
    if (!job) return res.status(403).json({ message: "Unauthorized" });

    await Application.update({ read: true }, { where: { jobId } });

    res.json({ success: true, message: "Applications marked as read" });
  } catch (err) {
    console.error("markApplicationsRead error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
