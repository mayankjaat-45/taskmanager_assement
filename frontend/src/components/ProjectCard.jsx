import { useEffect, useState } from "react";
import API from "../services/api";

function ProjectCard({ project }) {
  const user = JSON.parse(localStorage.getItem("user"));
  const [tasks, setTasks] = useState([]);

  const [title, setTitle] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [dueDate, setDueDate] = useState("");

  const fetchTasks = async () => {
    const res = await API.get(`/tasks?projectId=${project._id}`);
    setTasks(res.data);
  };

  const createTask = async () => {
    if (!title || !assignedTo) return;

    await API.post("/tasks", {
      title,
      projectId: project._id,
      assignedTo,
      dueDate,
    });

    setTitle("");
    setAssignedTo("");
    setDueDate("");

    fetchTasks();
  };

  useEffect(() => {
    fetchTasks();
  }, [project._id]);

  return (
    <div className="bg-white p-5 rounded-2xl shadow hover:shadow-lg transition space-y-4">
      {/* PROJECT HEADER */}
      <div>
        <h3 className="text-lg font-semibold">{project.name}</h3>
        <p className="text-sm text-gray-500">
          {project.description || "No description"}
        </p>

        <p className="text-xs text-gray-400 mt-1">
          Created by {project.createdBy?.name}
        </p>
      </div>

      {/* MEMBERS */}
      <div>
        <p className="text-sm font-medium">Team</p>
        <div className="flex flex-wrap gap-2 mt-1">
          {project.members.map((m) => (
            <span
              key={m._id}
              className="bg-indigo-100 text-indigo-600 px-2 py-1 rounded text-xs"
            >
              {m.name}
            </span>
          ))}
        </div>
      </div>

      {/* TASKS */}
      <div>
        <p className="text-sm font-medium mb-2">Tasks</p>

        {tasks.length === 0 ? (
          <p className="text-gray-400 text-sm">No tasks</p>
        ) : (
          <div className="space-y-2">
            {tasks.slice(0, 3).map((t) => (
              <div
                key={t._id}
                className="flex justify-between bg-gray-50 p-2 rounded"
              >
                <div>
                  <p className="text-sm">{t.title}</p>
                  <p className="text-xs text-gray-400">{t.assignedTo?.name}</p>
                </div>

                <span
                  className={`text-xs px-2 py-1 rounded ${
                    t.status === "done"
                      ? "bg-green-100 text-green-600"
                      : t.status === "in-progress"
                        ? "bg-yellow-100 text-yellow-600"
                        : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {t.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ADMIN: CREATE TASK */}
      {user?.role === "admin" && (
        <div className="border-t pt-3 space-y-2">
          <input
            placeholder="Task title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border p-2 rounded w-full text-sm"
          />

          <select
            value={assignedTo}
            onChange={(e) => setAssignedTo(e.target.value)}
            className="border p-2 rounded w-full text-sm"
          >
            <option value="">Assign member</option>
            {project.members.map((m) => (
              <option key={m._id} value={m._id}>
                {m.name}
              </option>
            ))}
          </select>

          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="border p-2 rounded w-full text-sm"
          />

          <button
            onClick={createTask}
            className="bg-indigo-500 text-white w-full py-1 rounded text-sm"
          >
            + Add Task
          </button>
        </div>
      )}
    </div>
  );
}

export default ProjectCard;
