<<<<<<< HEAD
/* eslint-disable react-hooks/set-state-in-effect, react-hooks/exhaustive-deps */
import { useCallback, useEffect, useState } from "react";
import "./App.css";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user") || "null"));
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({ total: 0, todo: 0, inProgress: 0, done: 0, overdue: 0 });
  const [authForm, setAuthForm] = useState({ name: "", email: "", password: "", role: "member" });
  const [projectForm, setProjectForm] = useState({ name: "", description: "" });
  const [memberForm, setMemberForm] = useState({ projectId: "", userEmail: "", role: "member" });
  const [taskForm, setTaskForm] = useState({
    title: "",
    description: "",
    projectId: "",
    assignedTo: "",
    dueDate: "",
    priority: "medium"
  });
  const [message, setMessage] = useState("");

  const apiUrl = import.meta.env.VITE_API_URL || '/api';

  async function api(path, options = {}) {
    const headers = { "Content-Type": "application/json", ...(options.headers || {}) };
    if (token) headers.Authorization = `Bearer ${token}`;
    const res = await fetch(`${apiUrl}${path}`, { ...options, headers });
    const contentType = res.headers.get("content-type") || "";
    const isJson = contentType.includes("application/json");
    const data = isJson ? await res.json() : null;
    if (!res.ok) {
      throw new Error(data?.message || `Request failed (${res.status})`);
    }
    return data;
  }

  const refreshData = useCallback(async () => {
    if (!token) return;
    const [projectRes, taskRes, dashboardRes, usersRes] = await Promise.all([
      api("/projects"),
      api("/tasks"),
      api("/dashboard"),
      api("/users")
    ]);
    setProjects(projectRes.projects);
    setTasks(taskRes.tasks);
    setStats(dashboardRes.stats);
    setUsers(usersRes.users);
  }, [token]);

  useEffect(() => {
    refreshData().catch(() => {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setToken("");
      setUser(null);
    });
  }, [refreshData]);

  function onAuthChange(event) {
    setAuthForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  }

  async function signup() {
    try {
      if (!authForm.name.trim() || !authForm.email.trim() || !authForm.password) {
        setMessage("Please fill name, email and password.");
        return;
      }
      const data = await api("/auth/signup", { method: "POST", body: JSON.stringify(authForm) });
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      setToken(data.token);
      setUser(data.user);
      setMessage("Signup successful.");
    } catch (error) {
      setMessage(error.message);
    }
  }

  async function login() {
    try {
      if (!authForm.email.trim() || !authForm.password) {
        setMessage("Please enter email and password.");
        return;
      }
      const data = await api("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email: authForm.email, password: authForm.password })
      });
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      setToken(data.token);
      setUser(data.user);
      setMessage("Login successful.");
    } catch (error) {
      setMessage(error.message);
    }
  }

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken("");
    setUser(null);
    setProjects([]);
    setTasks([]);
  }

  async function createProject() {
    try {
      if (user?.role !== "admin") {
        setMessage("Only admin users can create projects.");
        return;
      }
      if (!projectForm.name.trim()) {
        setMessage("Project name is required.");
        return;
      }
      await api("/projects", { method: "POST", body: JSON.stringify(projectForm) });
      setProjectForm({ name: "", description: "" });
      setMessage("Project created.");
      refreshData();
    } catch (error) {
      setMessage(error.message);
    }
  }

  async function addMember() {
    try {
      if (!memberForm.projectId) {
        setMessage("Select a project before adding member.");
        return;
      }
      if (!memberForm.userEmail.trim()) {
        setMessage("Member email is required.");
        return;
      }
      await api(`/projects/${memberForm.projectId}/members`, {
        method: "POST",
        body: JSON.stringify({ userEmail: memberForm.userEmail, role: memberForm.role })
      });
      setMemberForm((p) => ({ ...p, userEmail: "" }));
      setMessage("Member added.");
      refreshData();
    } catch (error) {
      setMessage(error.message);
    }
  }

  async function createTask() {
    try {
      if (!taskForm.title.trim() || !taskForm.projectId) {
        setMessage("Task title and project are required.");
        return;
      }
      await api("/tasks", {
        method: "POST",
        body: JSON.stringify({
          ...taskForm,
          projectId: Number(taskForm.projectId),
          assignedTo: taskForm.assignedTo ? Number(taskForm.assignedTo) : null,
          dueDate: taskForm.dueDate || null
        })
      });
      setTaskForm({ title: "", description: "", projectId: "", assignedTo: "", dueDate: "", priority: "medium" });
      setMessage("Task created.");
      refreshData();
    } catch (error) {
      setMessage(error.message);
    }
  }

  async function updateTask(taskId, status) {
    try {
      await api(`/tasks/${taskId}`, { method: "PATCH", body: JSON.stringify({ status }) });
      setMessage("Task updated.");
      refreshData();
    } catch (error) {
      setMessage(error.message);
    }
  }

  if (!token) {
    return (
      <main className="container">
        <section className="card">
          <h1>Team Task Manager</h1>
          {message ? <p>{message}</p> : null}
          <input name="name" placeholder="Name" value={authForm.name} onChange={onAuthChange} />
          <input name="email" placeholder="Email" value={authForm.email} onChange={onAuthChange} />
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={authForm.password}
            onChange={onAuthChange}
          />
          <select name="role" value={authForm.role} onChange={onAuthChange}>
            <option value="member">Member</option>
            <option value="admin">Admin</option>
          </select>
          <div className="row">
            <button onClick={signup}>Signup</button>
            <button onClick={login}>Login</button>
          </div>
        </section>
      </main>
    );
  }
=======
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import ErrorBoundary from "./components/ErrorBoundary";
import { AppProvider } from "./context/AppContext";
import { AuthProvider } from "./context/AuthContext";
import AppRoutes from "./routes/AppRoutes";
>>>>>>> 1fc9ac0 (Migrate to MERN stack with modern dashboard and production-ready API)

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <AppProvider>
            <AppRoutes />
            <Toaster
              position="top-right"
              toastOptions={{
                style: {
                  background: "#0f172a",
                  color: "#f1f5f9",
                  border: "1px solid #334155"
                }
              }}
            />
          </AppProvider>
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
