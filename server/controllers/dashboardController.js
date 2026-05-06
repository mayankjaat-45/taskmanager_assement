import Task from "../models/Task.js";

export const getDashboardStats = async (req, res) => {
  try {
    let filter = {};

    // Members → only their tasks
    if (req.user.role === "member") {
      filter.assignedTo = req.user.id;
    }

    const total = await Task.countDocuments(filter);

    const todo = await Task.countDocuments({
      ...filter,
      status: "todo",
    });

    const inProgress = await Task.countDocuments({
      ...filter,
      status: "in-progress",
    });

    const done = await Task.countDocuments({
      ...filter,
      status: "done",
    });

    const overdue = await Task.countDocuments({
      ...filter,
      dueDate: { $lt: new Date() },
      status: { $ne: "done" },
    });

    res.json({
      total,
      todo,
      inProgress,
      done,
      overdue,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
