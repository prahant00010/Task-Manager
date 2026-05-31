export function formatDate(date) {
  if (!date) return "—";
  return new Date(date).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric"
  });
}

export function isOverdue(dueDate, status) {
  if (!dueDate || status === "done") return false;
  return new Date(dueDate) < new Date();
}

export function getStatusLabel(status) {
  const map = { todo: "To Do", in_progress: "In Progress", done: "Done" };
  return map[status] || status;
}

export function getPriorityLabel(priority) {
  return priority ? priority.charAt(0).toUpperCase() + priority.slice(1) : "";
}
