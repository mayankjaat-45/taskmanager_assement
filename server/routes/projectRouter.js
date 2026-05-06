import express from "express";
import {
  createProject,
  getProjects,
  getSingleProject,
  addMembers,
} from "../controllers/projectController.js";

import { protect, isAdmin } from "../middleware/auth.js";

const projectrouter = express.Router();

projectrouter.post("/", protect, isAdmin, createProject);
projectrouter.get("/", protect, getProjects);
projectrouter.get("/:id", protect, getSingleProject);
projectrouter.put("/:id/members", protect, isAdmin, addMembers);

export default projectrouter;
