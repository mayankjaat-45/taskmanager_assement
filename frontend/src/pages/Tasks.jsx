import { useEffect, useState } from "react";
import API from "../services/api";
import Sidebar from "../components/Sidebar";

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);

  const [title, setTitle] = useState("");
  const [projectId, setProjectId] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [dueDate, setDueDate] = useState("");

  const [members, setMembers] = useState([]);

  const user = JSON.parse(localStorage.getItem("user"));

  // ✅ Fetch data
  const fetchData = async () => {
    try {
      const [taskRes, projRes] = await Promise.all([
        API.get("/api/tasks"),
        API.get("/api/projects"),
      ]);

      setTasks(taskRes.data);
      setProjects(projRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ Update members when project changes
  useEffect(() => {
    const selected = projects.find((p) => p._id === projectId);
    setMembers(selected?.members || []);
  }, [projectId, projects]);

  useEffect(() => {
    fetchData();
  }, []);

  // ✅ Create Task
  const createTask = async () => {
    if (!title || !projectId || !assignedTo) return;

    try {
      await API.post("/api/tasks", {
        title,
        projectId,
        assignedTo,
        dueDate,
      });

      setTitle("");
      setProjectId("");
      setAssignedTo("");
      setDueDate("");

      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ Update status
  const updateStatus = async (id, status) => {
    try {
      await API.patch(`/api/tasks/${id}`, { status });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <div className="flex-1 p-6 space-y-6">
        {/* HEADER */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Tasks</h1>
          <span className="text-gray-600 text-sm">
            {user?.name} ({user?.role})
          </span>
        </div>

        {/* 🔥 CREATE TASK */}
        <div className="bg-white p-6 rounded-2xl shadow-lg border">
          <h2 className="font-semibold mb-4">Create Task</h2>

          <div className="grid md:grid-cols-4 gap-3">
            {/* TITLE */}
            <input
              placeholder="Task title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border p-3 rounded-lg focus:ring-2 focus:ring-indigo-400"
            />

            {/* PROJECT */}
            <select
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              className="border p-3 rounded-lg"
            >
              <option value="">Select Project</option>
              {projects.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.name}
                </option>
              ))}
            </select>

            {/* MEMBER */}
            <select
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
              className="border p-3 rounded-lg"
              disabled={!projectId}
            >
              <option value="">Assign To</option>
              {members.map((m) => (
                <option key={m._id} value={m._id}>
                  {m.name}
                </option>
              ))}
            </select>

            {/* DUE DATE */}
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="border p-3 rounded-lg"
            />

            {/* BUTTON */}
            <button
              onClick={createTask}
              className="col-span-4 bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition"
            >
              Create Task
            </button>
          </div>
        </div>

        {/* 🔥 TASK LIST */}
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <h2 className="text-lg font-semibold mb-4">All Tasks</h2>

          {tasks.length === 0 ? (
            <p className="text-gray-500">No tasks found</p>
          ) : (
            <div className="space-y-3">
              {tasks.map((task) => (
                <div
                  key={task._id}
                  className="flex justify-between items-center border p-4 rounded-lg hover:shadow transition"
                >
                  <div>
                    <p className="font-semibold">{task.title}</p>

                    <p className="text-sm text-gray-500">
                      {task.projectId?.name} • {task.assignedTo?.name}
                    </p>

                    {task.dueDate && (
                      <p className="text-xs text-red-500 mt-1">
                        Due: {new Date(task.dueDate).toLocaleDateString()}
                      </p>
                    )}
                  </div>

                  {/* STATUS */}
                  <select
                    value={task.status}
                    onChange={(e) => updateStatus(task._id, e.target.value)}
                    className={`border rounded p-2 text-sm ${
                      task.status === "done"
                        ? "bg-green-100 text-green-600"
                        : task.status === "in-progress"
                          ? "bg-yellow-100 text-yellow-600"
                          : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    <option value="todo">Todo</option>
                    <option value="in-progress">In Progress</option>
                    <option value="done">Done</option>
                  </select>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
