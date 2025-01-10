import express from "express";
import passport from "../passport.js";
import User from "../models/user.js";
import { verifyToken, verifyAdmin } from "../jwt/jwt.js";

const router = express.Router();

// Google login route
router.get("/google/login", passport.authenticate("google", {
  scope: ["profile", "email"]
}));

// Google callback
router.get("/google/callback", passport.authenticate("google", {
  failureRedirect: "https://worldtoday.me?error=login_failed"
}), (req, res) => {
  if (!req.user || !req.user.token) {
    return res.redirect("https://worldtoday.me?error=token_missing");
  }

  res.cookie("token", req.user.token, {
  httpOnly: true, // Secure the cookie from client-side JavaScript access
  sameSite: "None", // Correct case for `SameSite`
  secure: process.env.NODE_ENV === "production", // Ensures cookies are only sent over HTTPS in production
  maxAge: 2 * 60 * 60 * 1000, // 2 hours
  //domain: ".worldtoday.me", // Uncomment and set this to the shared parent domain if applicable
});

  res.redirect("https://329b876b-7368-4d3b-8d30-cad353dd0676-00-224j6kmeq3r7c.sisko.replit.dev");
});

// Logout
router.get("/logout", verifyToken, (req, res) => {
  res.clearCookie("token", { domain: ".worldtoday.me" });
  res.status(200).json({ message: "Logged out successfully" });
});

// Get user data
router.get("/user", verifyToken, (req, res) => {
  res.status(200).json(req.user);
});

// Admin route
router.get("/admin", verifyAdmin, (req, res) => {
  res.status(200).json(req.user);
});

// Get all users (admin only)
router.get("/admin/users", verifyAdmin, async (req, res) => {
  try {
    const allUsers = await User.find();
    res.status(200).json(allUsers);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
                                                     
