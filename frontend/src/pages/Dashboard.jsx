import { useEffect, useState } from "react";
import API from "../services/api";
import Sidebar from "../components/Sidebar";

export default function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [stats, setStats] = useState({});
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));

  const fetchData = async () => {
    const [projRes, statRes] = await Promise.all([
      API.get("/api/projects"),
      API.get("/api/dashboard"),
    ]);

    setProjects(projRes.data);
    setStats(statRes.data);
  };

  const createProject = async () => {
    if (!name) return;

    await API.post("/api/projects", {
      name,
      description: desc,
    });

    setName("");
    setDesc("");
    fetchData();
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <div className="flex-1 p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <span className="text-gray-600">
            {user?.name} ({user?.role})
          </span>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-5 gap-4">
          <Card title="Total" value={stats.total} />
          <Card title="Todo" value={stats.todo} />
          <Card title="In Progress" value={stats.inProgress} />
          <Card title="Done" value={stats.done} />
          <Card title="Overdue" value={stats.overdue} />
        </div>

        {/* Admin Create Project */}
        {user?.role === "admin" && (
          <div className="bg-white p-4 rounded-xl shadow">
            <h2 className="font-semibold mb-3">Create Project</h2>

            <div className="flex gap-2 flex-wrap">
              <input
                placeholder="Project name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border p-2 rounded w-48"
              />

              <input
                placeholder="Description"
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                className="border p-2 rounded w-64"
              />

              <button
                onClick={createProject}
                className="bg-indigo-500 text-white px-4 rounded"
              >
                Create
              </button>
            </div>
          </div>
        )}

        {/* Projects */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-lg font-semibold mb-4">Your Projects</h2>

          {projects.length === 0 ? (
            <p className="text-gray-500">No projects yet</p>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {projects.map((p) => (
                <ProjectCard key={p._id} project={p} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* STAT CARD */
function Card({ title, value }) {
  return (
    <div className="bg-white p-4 rounded-xl shadow">
      <p className="text-gray-500 text-sm">{title}</p>
      <h2 className="text-xl font-bold">{value || 0}</h2>
    </div>
  );
}

/* PROJECT CARD */
function ProjectCard({ project }) {
  return (
    <div className="border p-4 rounded-lg hover:shadow transition">
      <h3 className="font-semibold">{project.name}</h3>

      <p className="text-sm text-gray-500">{project.description}</p>

      <div className="mt-2 text-sm text-gray-600">
        👤 Created by: {project.createdBy?.name}
      </div>

      <div className="mt-2">
        <p className="text-sm font-medium">Members:</p>
        <ul className="text-sm text-gray-500">
          {project.members.map((m) => (
            <li key={m._id}>• {m.name}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
