import { useEffect, useState } from "react";
import API from "../services/api";
import Sidebar from "../components/Sidebar";

export default function MemberDashboard() {
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({});

  const fetchData = async () => {
    const [taskRes, statRes] = await Promise.all([
      API.get("/api/tasks"),
      API.get("/api/dashboard"),
    ]);

    setTasks(taskRes.data);
    setStats(statRes.data);
  };

  const updateStatus = async (id, status) => {
    await API.patch(`/api/tasks/${id}`, { status });
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
        <h1 className="text-2xl font-bold">My Dashboard</h1>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-4">
          <StatCard title="My Tasks" value={stats.total} />
          <StatCard title="Todo" value={stats.todo} />
          <StatCard title="In Progress" value={stats.inProgress} />
          <StatCard title="Done" value={stats.done} />
        </div>

        {/* Overdue Warning */}
        {stats.overdue > 0 && (
          <div className="bg-red-100 text-red-600 p-3 rounded">
            ⚠️ You have {stats.overdue} overdue tasks
          </div>
        )}

        {/* Task List */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-lg font-semibold mb-4">My Tasks</h2>

          {tasks.length === 0 ? (
            <p className="text-gray-500">No tasks assigned</p>
          ) : (
            <div className="space-y-3">
              {tasks.map((task) => (
                <div
                  key={task._id}
                  className="flex justify-between items-center border p-3 rounded-lg"
                >
                  <div>
                    <p className="font-semibold">{task.title}</p>

                    <p className="text-sm text-gray-500">
                      {task.projectId?.name}
                    </p>

                    {/* Status Color */}
                    <p
                      className={`text-xs mt-1 ${
                        task.status === "done"
                          ? "text-green-500"
                          : task.status === "in-progress"
                            ? "text-yellow-500"
                            : "text-gray-500"
                      }`}
                    >
                      {task.status}
                    </p>
                  </div>

                  {/* Only action allowed */}
                  <select
                    value={task.status}
                    onChange={(e) => updateStatus(task._id, e.target.value)}
                    className="border p-1 rounded"
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

function StatCard({ title, value }) {
  return (
    <div className="bg-white p-4 rounded-xl shadow">
      <p className="text-gray-500 text-sm">{title}</p>
      <h2 className="text-xl font-bold">{value || 0}</h2>
    </div>
  );
}
