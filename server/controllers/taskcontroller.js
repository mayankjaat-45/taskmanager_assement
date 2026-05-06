import Task from "../models/Task.js";

export const createTask = async (req, res) => {
  try {
    const { title, projectId, assignedTo } = req.body;

    if (!title || !projectId || !assignedTo) {
      return res.status(400).json({ msg: "Missing required fields" });
    }

    const task = await Task.create(req.body);

    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
export const getTasks = async (req, res) => {
  try {
    let filter = {};

    // ✅ Filter by project
    if (req.query.projectId) {
      filter.projectId = req.query.projectId;
    }

    // ✅ Members only see their tasks
    if (req.user.role === "member") {
      filter.assignedTo = req.user.id;
    }

    const tasks = await Task.find(filter)
      .populate("assignedTo", "name email")
      .populate("projectId", "name");

    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ msg: "Task not found" });
    }

    const assignedId =
      task.assignedTo._id?.toString?.() || task.assignedTo.toString();

    if (req.user.role === "member") {
      if (assignedId !== req.user.id) {
        return res.status(403).json({ msg: "Not allowed" });
      }

      task.status = req.body.status;
    } else {
      Object.assign(task, req.body);
    }

    await task.save();

    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteTask = async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ msg: "Task deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
