import { createContext, useCallback, useContext, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { dashboardApi, projectApi, taskApi, userApi } from "../api/services";
import { useAuth } from "./AuthContext";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    todo: 0,
    inProgress: 0,
    done: 0,
    overdue: 0,
    byPriority: { low: 0, medium: 0, high: 0 }
  });
  const [loading, setLoading] = useState(false);

  const refreshAll = useCallback(async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    try {
      const [projectsRes, tasksRes, dashboardRes, usersRes] = await Promise.all([
        projectApi.getAll(),
        taskApi.getAll(),
        dashboardApi.getStats(),
        userApi.getAll()
      ]);
      setProjects(projectsRes.data.projects || []);
      setTasks(tasksRes.data.tasks || []);
      setStats(dashboardRes.data.stats || {});
      setUsers(usersRes.data.users || []);
    } catch (error) {
      toast.error(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const refreshTasks = useCallback(async (params) => {
    const { data } = await taskApi.getAll(params);
    setTasks(data.tasks || []);
    return data.tasks;
  }, []);

  const createProject = useCallback(
    async (payload) => {
      const { data } = await projectApi.create(payload);
      toast.success("Project created");
      await refreshAll();
      return data.project;
    },
    [refreshAll]
  );

  const addMember = useCallback(
    async (projectId, payload) => {
      await projectApi.addMember(projectId, payload);
      toast.success("Member added");
      await refreshAll();
    },
    [refreshAll]
  );

  const createTask = useCallback(
    async (payload) => {
      const { data } = await taskApi.create(payload);
      toast.success("Task created");
      await refreshAll();
      return data.task;
    },
    [refreshAll]
  );

  const updateTask = useCallback(
    async (id, payload) => {
      const { data } = await taskApi.update(id, payload);
      toast.success("Task updated");
      await refreshAll();
      return data.task;
    },
    [refreshAll]
  );

  const deleteTask = useCallback(
    async (id) => {
      await taskApi.delete(id);
      toast.success("Task deleted");
      await refreshAll();
    },
    [refreshAll]
  );

  const addComment = useCallback(
    async (taskId, text) => {
      const { data } = await taskApi.addComment(taskId, text);
      toast.success("Comment added");
      await refreshAll();
      return data.task;
    },
    [refreshAll]
  );

  const value = useMemo(
    () => ({
      projects,
      tasks,
      users,
      stats,
      loading,
      refreshAll,
      refreshTasks,
      createProject,
      addMember,
      createTask,
      updateTask,
      deleteTask,
      addComment
    }),
    [
      projects,
      tasks,
      users,
      stats,
      loading,
      refreshAll,
      refreshTasks,
      createProject,
      addMember,
      createTask,
      updateTask,
      deleteTask,
      addComment
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
