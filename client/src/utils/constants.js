export const TASK_STATUSES = [
  { value: "todo", label: "To Do", color: "bg-slate-500/20 text-slate-300" },
  { value: "in_progress", label: "In Progress", color: "bg-amber-500/20 text-amber-300" },
  { value: "done", label: "Done", color: "bg-emerald-500/20 text-emerald-300" }
];

export const TASK_PRIORITIES = [
  { value: "low", label: "Low", color: "bg-sky-500/20 text-sky-300" },
  { value: "medium", label: "Medium", color: "bg-violet-500/20 text-violet-300" },
  { value: "high", label: "High", color: "bg-rose-500/20 text-rose-300" }
];

export const USER_ROLES = [
  { value: "member", label: "Member" },
  { value: "admin", label: "Admin" }
];

export const NAV_ITEMS = [
  { path: "/dashboard", label: "Overview", icon: "LayoutDashboard" },
  { path: "/projects", label: "Projects", icon: "FolderKanban" },
  { path: "/tasks", label: "Tasks", icon: "CheckSquare" },
  { path: "/team", label: "Team", icon: "Users" },
  { path: "/profile", label: "Profile", icon: "User" },
  { path: "/settings", label: "Settings", icon: "Settings" }
];
