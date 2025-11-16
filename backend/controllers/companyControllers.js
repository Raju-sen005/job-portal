import Company from "../models/Company.js";

// Create company
export const createCompany = async (req, res) => {
  try {
    const { companyName, websiteLink, linkedinLink, twitterLink, beLink } =
      req.body;
    const companyLogo = req.file ? req.file.filename : null;

    const company = await Company.create({
      companyName,
      websiteLink,
      linkedinLink,
      twitterLink,
      beLink,
      companyLogo,
      authId: req.user.authId, // linked to current user
    });

    res
      .status(201)
      .json({ message: "Company info saved successfully", company });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// Get company of current user
export const getMyCompany = async (req, res) => {
  try {
    console.log("Fetching company for user:", req.user?.id); // debug
    const company = await Company.findOne({
      where: { authId: req.user.authId },
    });
    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }
    res.json(company);
  } catch (error) {
    console.error("Get My Company Error:", error);
    res.status(500).json({ message: error.message });
  }
};

// ✅ Update company info
export const updateCompany = async (req, res) => {
  try {
    const { companyName, websiteLink, linkedinLink, twitterLink, beLink } =
      req.body;
    const companyLogo = req.file ? req.file.filename : null;

    // Pehle check karo company exist karti hai ya nahi
    let company = await Company.findOne({ where: { authId: req.user.authId } });

    if (!company) {
      // Agar company nahi mili to create karo
      company = await Company.create({
        companyName,
        websiteLink,
        linkedinLink,
        twitterLink,
        beLink,
        companyLogo,
        authId: req.user.authId,
      });

      return res
        .status(201)
        .json({ message: "Company created successfully", company });
    }

    // Agar mil gayi to update karo
    company.companyName = companyName || company.companyName;
    company.websiteLink = websiteLink || company.websiteLink;
    company.linkedinLink = linkedinLink || company.linkedinLink;
    company.twitterLink = twitterLink || company.twitterLink;
    company.beLink = beLink || company.beLink;
    if (companyLogo) company.companyLogo = companyLogo;

    await company.save();

    res.json({ message: "Company updated successfully", company });
  } catch (error) {
    console.error("Update Company Error:", error);
    res.status(500).json({ message: error.message });
  }
};


// 🔹 Get company by ID (public route)
export const getCompanyById = async (req, res) => {
  try {
    const { id } = req.params;

    const company = await Company.findByPk(id);
    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    res.json(company);
  } catch (error) {
    console.error("Get Company by ID Error:", error);
    res.status(500).json({ message: error.message });
  }
};
