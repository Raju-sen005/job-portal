import Profile from "../models/Profile.js";

export const createProfile = async (req, res) => {
  console.log("req.body:", req.body);
console.log("req.file:", req.file);
console.log("req.user:", req.user);


  try {
    const {
      name, email, phone, birthday, gender,
      country, city, description,
      professional, education, skills,
      portfolio,
      confirmHide
    } = req.body;

    const profileImage = req.file ? req.file.filename : null;

    const newProfile = await Profile.create({
      userId: req.user.id, // ✅ logged-in user id
      name,
      email,
      phone,
      birthday,
      gender,
      country,
      city,
      profileImage,
      description,
      professional: professional ? JSON.parse(professional) : [],
      education: education ? JSON.parse(education) : [],
      skills: skills ? JSON.parse(skills) : [],
       portfolio: portfolio ? JSON.parse(portfolio) : [],
      confirmHide: confirmHide === "true" || confirmHide === true
      
    });

    res.json({ message: "Profile saved successfully", profile: newProfile });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error saving profile" });
  }
};

export const getProfiles = async (req, res) => {
  try {
    const profiles = await Profile.findAll();
    res.json(profiles);
  } catch (err) {
    console.error("Error in getProfiles:", err);
    res.status(500).json({ message: "Error fetching profiles" });
  }
};


// Get single profile by ID
export const getProfileById = async (req, res) => {
  try {
    const id = req.params.id;
    const profile = await Profile.findByPk(id); // Sequelize में primary key से fetch

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.json(profile);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching profile" });
  }
};


// Get logged-in user profile
export const getMyProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne({ where: { userId: req.user.id } });
    if (!profile) return res.status(404).json({ message: "Profile not found" });
    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: "Error fetching profile" });
  }
};

