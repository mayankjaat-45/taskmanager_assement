import express from "express";
import { getDashboardStats } from "../controllers/dashboardController.js";
import { protect } from "../middleware/auth.js";

const dashboardrouter = express.Router();

dashboardrouter.get("/", protect, getDashboardStats);

export default dashboardrouter;
