// controllers/authController.js
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Auth from "../models/Auth.js"; // ✅ Model name updated

// ✅ Register new user
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user exists
    const existingUser = await Auth.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ msg: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = await Auth.create({
      name,
      email,
      password: hashedPassword,
    });

    res.json({ msg: "User registered successfully", user: newUser });
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

// ✅ Login user
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await Auth.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ msg: "Invalid email or password" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid email or password" });
    }

    // Generate JWT (store authId instead of id)
    const token = jwt.sign({ authId: user.authId }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.json({
      msg: "Login successful",
      token,
      user: {
        authId: user.authId,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

// 🔹 Change Password
export const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const authId = req.user.authId; // middleware se aaya

    // Find user
    const user = await Auth.findByPk(authId);
    if (!user) return res.status(404).json({ msg: "User not found" });

    // Compare old password
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Old password is incorrect" });

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.json({ msg: "Password changed successfully" });
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};
