import Company from "../models/Company.js";
import Job from "../models/Job.js";
import User from "../models/User.js";
import Notification from "../models/Notification.js";

// ✅ Get all jobs for normal users (with company info)
export const getJobsForUser = async (req, res) => {
  try {
    const jobs = await Job.findAll({
      include: [
        {
          model: Company,
          as: "company", // alias must match Job.belongsTo
          attributes: ["id", "companyName", "companyLogo"],
        },
      ],
    });

    res.status(200).json({ success: true, data: jobs });
  } catch (error) {
    console.error("Error fetching jobs:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Get all jobs for logged-in company (with pagination)
export const getJobs = async (req, res) => {
  try {
    const authId = req.user.authId;

    const company = await Company.findOne({ where: { authId } });
    if (!company) {
      return res
        .status(404)
        .json({ message: "Company not found for this user" });
    }

    const { page = 1, limit = 16 } = req.query;
    const offset = (page - 1) * limit;

    const jobs = await Job.findAndCountAll({
      where: { companyId: company.id },
      limit: parseInt(limit),
      offset: parseInt(offset),
    });

    res.json({
      total: jobs.count,
      totalPages: Math.ceil(jobs.count / limit),
      currentPage: parseInt(page),
      data: jobs.rows,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// ✅ Create a new job for logged-in company
export const createJob = async (req, res) => {
  try {
    const company = await Company.findOne({
      where: { authId: req.user.authId },
    });
    if (!company)
      return res
        .status(400)
        .json({ message: "Company not found for this user" });

    const job = await Job.create({
      ...req.body,
      companyId: company.id,
    });
    // ✅ Create notifications for all users
    const allUsers = await User.findAll({ attributes: ["id"] });
    const notifications = allUsers.map((u) => ({
      userId: u.id,
      jobId: job.id,
      message: `New job posted: ${job.title}`,
    }));
    await Notification.bulkCreate(notifications);

    res.status(201).json(job);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
};

// ✅ Get Job by ID
export const getJobById = async (req, res) => {
  console.log("Job ID:", req.params.id);
  console.log("User:", req.user); // check logged-in user
  try {
    const { id } = req.params;
    const job = await Job.findByPk(id);
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Update Job
export const updateJob = async (req, res) => {
  try {
    const { id } = req.params;
    const job = await Job.findByPk(id);
    if (!job) return res.status(404).json({ message: "Job not found" });

    await job.update(req.body);
    res.json(job);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// ✅ Delete Job
export const deleteJob = async (req, res) => {
  try {
    const { id } = req.params;
    const job = await Job.findByPk(id);
    if (!job) return res.status(404).json({ message: "Job not found" });

    await job.destroy();
    res.json({ message: "Job deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
