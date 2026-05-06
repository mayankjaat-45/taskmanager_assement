import { Link, useNavigate } from "react-router-dom";
import { logout } from "../utils/auth";

export default function Sidebar() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <aside className="w-64 bg-white shadow-lg hidden md:flex flex-col">
      <div className="p-6 text-2xl font-bold text-indigo-600">TaskFlow</div>

      <nav className="flex-1 px-4 space-y-2">
        <Link to="/dashboard" className="block p-3 rounded hover:bg-gray-100">
          Dashboard
        </Link>
        <Link to="/projects" className="block p-3 rounded hover:bg-gray-100">
          Projects
        </Link>
        <Link to="/tasks" className="block p-3 rounded hover:bg-gray-100">
          Tasks
        </Link>
      </nav>

      <div className="p-4">
        <button
          onClick={logout}
          className="w-full bg-red-500 text-white py-2 rounded"
        >
          Logout
        </button>
      </div>
    </aside>
  );
}
