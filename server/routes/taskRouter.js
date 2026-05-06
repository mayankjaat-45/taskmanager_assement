import express from "express";
import {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
} from "../controllers/taskcontroller.js";

import { protect, isAdmin } from "../middleware/auth.js";

const taskrouter = express.Router();

taskrouter.post("/", protect, isAdmin, createTask);
taskrouter.get("/", protect, getTasks);
taskrouter.patch("/:id", protect, updateTask);
taskrouter.delete("/:id", protect, isAdmin, deleteTask);

export default taskrouter;
