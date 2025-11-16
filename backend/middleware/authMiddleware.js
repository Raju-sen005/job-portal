// middleware/authMiddleware.js
import jwt from "jsonwebtoken";
import Auth from "../models/Auth.js"; // ✅ updated model import

export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];

    try {
      // Decode token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Find user by authId (not id)
      const user = await Auth.findByPk(decoded.authId);

      if (!user) {
        return res.status(401).json({ msg: "User not found" });
      }

      req.user = user; // Attach user to request
      next();
    } catch (err) {
      return res.status(401).json({ msg: "Not authorized, token failed" });
    }
  } else {
    return res.status(401).json({ msg: "Not authorized, no token provided" });
  }
};