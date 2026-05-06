import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import authrouter from "./routes/authRouter.js";
import projectrouter from "./routes/projectRouter.js";
import taskrouter from "./routes/taskRouter.js";
import connectDB from "./config/db.js";
import dashboardrouter from "./routes/dashboardRouter.js";
import userRouter from "./routes/userRouter.js";

dotenv.config();

const app = express();
const allowedOrigins = [process.env.FRONTEND_URL, "http://localhost:5173"];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  }),
);
app.use(express.json());
const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("Hello from server");
});
app.use("/api/auth", authrouter);
app.use("/api/projects", projectrouter);
app.use("/api/tasks", taskrouter);
app.use("/api/dashboard", dashboardrouter);
app.use("/api/users", userRouter);

connectDB().then(() => {
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
});
