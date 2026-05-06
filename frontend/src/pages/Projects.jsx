import { useEffect, useState } from "react";
import API from "../services/api";
import Sidebar from "../components/Sidebar";

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);

  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [selectedMembers, setSelectedMembers] = useState([]);

  const user = JSON.parse(localStorage.getItem("user"));

  // ✅ Fetch projects + users
  const fetchData = async () => {
    try {
      const [projRes, userRes] = await Promise.all([
        API.get("/api/projects"),
        API.get("/api/users"), // 🔥 required endpoint
      ]);

      setProjects(projRes.data);
      setUsers(userRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ Create project
  const createProject = async () => {
    if (!name) return;

    try {
      await API.post("/api/projects", {
        name,
        description: desc,
        members: selectedMembers,
      });

      setName("");
      setDesc("");
      setSelectedMembers([]);

      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <div className="flex-1 p-6 space-y-6">
        {/* HEADER */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Projects</h1>
            <p className="text-gray-500 text-sm">
              Manage projects and team tasks
            </p>
          </div>

          <div className="text-sm text-gray-600">
            {user?.name} ({user?.role})
          </div>
        </div>

        {/* 🔥 CREATE PROJECT (ADMIN ONLY) */}
        {user?.role === "admin" && (
          <div className="bg-white p-6 rounded-2xl shadow-lg border">
            <h2 className="font-semibold text-lg mb-4">Create New Project</h2>

            <div className="grid md:grid-cols-2 gap-3">
              {/* NAME */}
              <input
                placeholder="Project name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border p-3 rounded-lg focus:ring-2 focus:ring-indigo-400"
              />

              {/* DESCRIPTION */}
              <input
                placeholder="Description"
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                className="border p-3 rounded-lg focus:ring-2 focus:ring-indigo-400"
              />

              {/* 🔥 MEMBERS MULTI SELECT */}
              <select
                multiple
                value={selectedMembers}
                onChange={(e) =>
                  setSelectedMembers(
                    [...e.target.selectedOptions].map((o) => o.value),
                  )
                }
                className="border p-3 rounded-lg h-32 col-span-2"
              >
                {users.map((u) => (
                  <option key={u._id} value={u._id}>
                    {u.name} ({u.email})
                  </option>
                ))}
              </select>

              {/* SELECTED MEMBERS PREVIEW */}
              <div className="col-span-2 flex flex-wrap gap-2">
                {selectedMembers.map((id) => {
                  const u = users.find((x) => x._id === id);
                  return (
                    <span
                      key={id}
                      className="bg-indigo-100 text-indigo-600 px-3 py-1 rounded-full text-xs"
                    >
                      {u?.name}
                    </span>
                  );
                })}
              </div>

              {/* BUTTON */}
              <button
                onClick={createProject}
                className="col-span-2 bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition"
              >
                Create Project
              </button>
            </div>
          </div>
        )}

        {/* PROJECT GRID */}
        {projects.length === 0 ? (
          <p className="text-gray-500">No projects found</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {projects.map((p) => (
              <ProjectCard key={p._id} project={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* 🔥 PROJECT CARD */
function ProjectCard({ project }) {
  return (
    <div className="bg-white p-5 rounded-2xl shadow hover:shadow-lg transition">
      <h3 className="text-lg font-semibold">{project.name}</h3>

      <p className="text-gray-500 text-sm mt-1">
        {project.description || "No description"}
      </p>

      <div className="mt-3 text-sm text-gray-600">
        👤 {project.createdBy?.name}
      </div>

      {/* MEMBERS */}
      <div className="mt-3">
        <p className="text-sm font-medium">Members</p>

        <div className="flex flex-wrap gap-2 mt-2">
          {project.members.map((m) => (
            <span
              key={m._id}
              className="bg-gray-200 px-3 py-1 rounded-full text-xs"
            >
              {m.name}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
