// middleware/userMiddleware.js
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protectUser = async (req, res, next) => {
  let token;
  if (req.headers.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findByPk(decoded.id);
      if (!user) return res.status(401).json({ msg: "User not found" });

      // Optional: check normal user role
      // if (user.role !== "user") return res.status(403).json({ msg: "Forbidden" });

      req.user = user;
      next();
    } catch (err) {
      return res.status(401).json({ msg: "Not authorized, token failed" });
    }
  } else {
    return res.status(401).json({ msg: "Not authorized, no token provided" });
  }
};