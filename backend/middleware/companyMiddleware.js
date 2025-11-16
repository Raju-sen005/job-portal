// middleware/companyMiddleware.js
import jwt from "jsonwebtoken";
import Company from "../models/Company.js";

export const protectCompany = async (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Correct: use decoded.authId
      const company = await Company.findOne({
        where: { authId: decoded.authId },
      });
      if (!company) {
        return res.status(401).json({ msg: "Company not found" });
      }

      req.company = company; // attach company object to request
      next();
    } catch (err) {
      console.error("Company Auth Error:", err);
      return res.status(401).json({ msg: "Not authorized, invalid token" });
    }
  } else {
    return res.status(401).json({ msg: "No token provided" });
  }
};
