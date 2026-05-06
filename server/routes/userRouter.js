// routes/userRouter.js
import express from "express";
import User from "../models/User.js";
import { protect } from "../middleware/auth.js";

const userRouter = express.Router();

// ✅ Get all users (for assigning members)
userRouter.get("/", protect, async (req, res) => {
  try {
    const users = await User.find().select("_id name email role");
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default userRouter;
