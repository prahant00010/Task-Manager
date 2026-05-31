import { useMemo, useState } from "react";
import { MessageSquare, Plus, Search, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import PageHeader from "../components/PageHeader";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import Modal, { ModalActions } from "../components/ui/Modal";
import Select from "../components/ui/Select";
import { PriorityBadge, StatusBadge } from "../components/TaskStatusBadge";
import { useApp } from "../context/AppContext";
import { TASK_PRIORITIES, TASK_STATUSES } from "../utils/constants";
import { formatDate, isOverdue } from "../utils/helpers";

export default function TasksPage() {
  const { tasks, projects, createTask, updateTask, deleteTask, addComment, refreshTasks } =
    useApp();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [view, setView] = useState("list");
  const [createOpen, setCreateOpen] = useState(false);
  const [commentOpen, setCommentOpen] = useState(null);
  const [commentText, setCommentText] = useState("");
  const [saving, setSaving] = useState(false);
  const [taskForm, setTaskForm] = useState({
    title: "",
    description: "",
    projectId: "",
    assignedTo: "",
    dueDate: "",
    priority: "medium"
  });

  const filteredTasks = useMemo(() => {
    let list = [...tasks];
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.projectName?.toLowerCase().includes(q)
      );
    }
    if (statusFilter) list = list.filter((t) => t.status === statusFilter);
    if (priorityFilter) list = list.filter((t) => t.priority === priorityFilter);
    list.sort((a, b) => {
      const av = a[sortBy] ?? "";
      const bv = b[sortBy] ?? "";
      return av > bv ? -1 : av < bv ? 1 : 0;
    });
    return list;
  }, [tasks, search, statusFilter, priorityFilter, sortBy]);

  const kanbanColumns = TASK_STATUSES.map((s) => ({
    ...s,
    tasks: filteredTasks.filter((t) => t.status === s.value)
  }));

  const selectedProject = projects.find((p) => String(p.id) === String(taskForm.projectId));
  const projectMembers = selectedProject?.members ?? [];

  function onProjectChange(projectId) {
    setTaskForm((prev) => {
      const project = projects.find((p) => String(p.id) === String(projectId));
      const members = project?.members ?? [];
      const assigneeStillValid = members.some(
        (m) => String(m.userId) === String(prev.assignedTo)
      );
      return {
        ...prev,
        projectId,
        assignedTo: assigneeStillValid ? prev.assignedTo : ""
      };
    });
  }

  async function handleCreate() {
    if (!taskForm.title.trim() || !taskForm.projectId) {
      toast.error("Title and project are required");
      return;
    }
    setSaving(true);
    try {
      await createTask({
        title: taskForm.title,
        description: taskForm.description,
        projectId: taskForm.projectId,
        assignedTo: taskForm.assignedTo || null,
        dueDate: taskForm.dueDate || null,
        priority: taskForm.priority
      });
      setTaskForm({
        title: "",
        description: "",
        projectId: "",
        assignedTo: "",
        dueDate: "",
        priority: "medium"
      });
      setCreateOpen(false);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleStatusChange(taskId, status) {
    try {
      await updateTask(taskId, { status });
    } catch (error) {
      toast.error(error.message);
    }
  }

  async function handleComment() {
    if (!commentText.trim() || !commentOpen) return;
    setSaving(true);
    try {
      await addComment(commentOpen, commentText);
      setCommentText("");
      setCommentOpen(null);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSaving(false);
    }
  }

  async function applyServerFilters() {
    try {
      await refreshTasks({
        status: statusFilter || undefined,
        priority: priorityFilter || undefined,
        search: search || undefined,
        sortBy,
        order: "desc"
      });
    } catch {
      /* toast handled in context */
    }
  }

  function TaskRow({ task }) {
    return (
      <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-3 sm:p-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0 flex-1">
            <h4 className="font-medium text-white">{task.title}</h4>
            <p className="mt-1 truncate text-sm text-slate-400">{task.projectName}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              <StatusBadge status={task.status} />
              <PriorityBadge priority={task.priority} />
              {isOverdue(task.dueDate, task.status) ? (
                <span className="text-xs text-rose-400">Overdue · {formatDate(task.dueDate)}</span>
              ) : (
                <span className="text-xs text-slate-500">Due {formatDate(task.dueDate)}</span>
              )}
            </div>
            {task.assignedToName ? (
              <p className="mt-1 text-xs text-slate-500">Assigned to {task.assignedToName}</p>
            ) : null}
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap lg:max-w-md lg:justify-end">
            <div className="grid grid-cols-3 gap-1 sm:flex sm:flex-wrap">
              {TASK_STATUSES.map((s) => (
                <Button
                  key={s.value}
                  variant={task.status === s.value ? "primary" : "ghost"}
                  className="!min-h-9 !px-2 !py-1.5 text-xs sm:!min-h-0"
                  onClick={() => handleStatusChange(task.id, s.value)}
                >
                  <span className="hidden sm:inline">{s.label}</span>
                  <span className="sm:hidden">{s.label.split(" ")[0]}</span>
                </Button>
              ))}
            </div>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                className="!min-h-9 flex-1 sm:!min-h-0 sm:flex-none"
                onClick={() => setCommentOpen(task.id)}
              >
                <MessageSquare size={14} />
                <span className="sm:hidden">Comment</span>
              </Button>
              <Button
                variant="ghost"
                className="!min-h-9 flex-1 text-rose-400 sm:!min-h-0 sm:flex-none"
                onClick={() => deleteTask(task.id)}
              >
                <Trash2 size={14} />
                <span className="sm:hidden">Delete</span>
              </Button>
            </div>
          </div>
        </div>
        {task.comments?.length > 0 ? (
          <div className="mt-3 border-t border-slate-800 pt-3">
            <p className="text-xs font-medium text-slate-500">{task.comments.length} comment(s)</p>
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <div className="space-y-5 sm:space-y-6">
      <PageHeader title="Tasks" subtitle="Create, filter, and update team tasks">
        <Button className="w-full sm:w-auto" onClick={() => setCreateOpen(true)}>
          <Plus size={16} />
          New Task
        </Button>
      </PageHeader>

      <Card>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <div className="relative sm:col-span-2 lg:col-span-2">
            <Search className="absolute left-3 top-3 text-slate-500 sm:top-2.5" size={16} />
            <input
              className="w-full rounded-lg border border-slate-700 bg-slate-900/80 py-2.5 pl-9 pr-3 text-base outline-none focus:border-brand-500 sm:py-2 sm:text-sm"
              placeholder="Search tasks..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="">All statuses</option>
            {TASK_STATUSES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </Select>
          <Select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)}>
            <option value="">All priorities</option>
            {TASK_PRIORITIES.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </Select>
          <Select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="createdAt">Sort: Created</option>
            <option value="dueDate">Sort: Due date</option>
            <option value="priority">Sort: Priority</option>
          </Select>
        </div>
        <div className="mt-3 grid grid-cols-1 gap-2 sm:flex sm:flex-wrap">
          <Button className="w-full sm:w-auto" variant="secondary" onClick={applyServerFilters}>
            Apply server filters
          </Button>
          <Button
            className="w-full sm:w-auto"
            variant={view === "list" ? "primary" : "ghost"}
            onClick={() => setView("list")}
          >
            List
          </Button>
          <Button
            className="w-full sm:w-auto"
            variant={view === "kanban" ? "primary" : "ghost"}
            onClick={() => setView("kanban")}
          >
            Kanban
          </Button>
        </div>
      </Card>

      {view === "kanban" ? (
        <div className="-mx-1 flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory lg:mx-0 lg:grid lg:grid-cols-3 lg:overflow-visible lg:pb-0">
          {kanbanColumns.map((col) => (
            <Card key={col.value} className="min-h-[200px] min-w-[85vw] shrink-0 snap-center sm:min-w-[320px] lg:min-w-0">
              <h3 className="mb-3 font-semibold text-white">{col.label}</h3>
              <div className="space-y-3">
                {col.tasks.map((task) => (
                  <div
                    key={task.id}
                    className="cursor-pointer rounded-lg border border-slate-700 bg-slate-900 p-3 hover:border-brand-500/50"
                    onClick={() => handleStatusChange(task.id, col.value)}
                  >
                    <p className="font-medium text-white">{task.title}</p>
                    <PriorityBadge priority={task.priority} />
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredTasks.map((task) => (
            <TaskRow key={task.id} task={task} />
          ))}
          {filteredTasks.length === 0 ? (
            <Card>
              <p className="text-center text-slate-500">No tasks match your filters.</p>
            </Card>
          ) : null}
        </div>
      )}

      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="Create Task">
        <Input
          label="Title"
          value={taskForm.title}
          onChange={(e) => setTaskForm((p) => ({ ...p, title: e.target.value }))}
        />
        <Input
          label="Description"
          value={taskForm.description}
          onChange={(e) => setTaskForm((p) => ({ ...p, description: e.target.value }))}
        />
        <Select
          label="Project"
          value={taskForm.projectId}
          onChange={(e) => onProjectChange(e.target.value)}
        >
          <option value="">Select project</option>
          {projects.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </Select>
        <Select
          label="Assign to (project members only)"
          value={taskForm.assignedTo}
          onChange={(e) => setTaskForm((p) => ({ ...p, assignedTo: e.target.value }))}
          disabled={!taskForm.projectId}
        >
          <option value="">Unassigned</option>
          {projectMembers.map((m) => (
            <option key={m.userId} value={m.userId}>
              {m.name} ({m.role})
            </option>
          ))}
        </Select>
        {taskForm.projectId && projectMembers.length === 0 ? (
          <p className="text-xs text-amber-400">
            No members on this project. Add members on the Projects page first.
          </p>
        ) : null}
        {taskForm.projectId && projectMembers.length > 0 ? (
          <p className="text-xs text-slate-500">
            Only users added to this project can be assigned. Projects → Add Member.
          </p>
        ) : null}
        <Input
          label="Due date"
          type="date"
          value={taskForm.dueDate}
          onChange={(e) => setTaskForm((p) => ({ ...p, dueDate: e.target.value }))}
        />
        <Select
          label="Priority"
          value={taskForm.priority}
          onChange={(e) => setTaskForm((p) => ({ ...p, priority: e.target.value }))}
        >
          {TASK_PRIORITIES.map((p) => (
            <option key={p.value} value={p.value}>
              {p.label}
            </option>
          ))}
        </Select>
        <ModalActions
          onCancel={() => setCreateOpen(false)}
          onConfirm={handleCreate}
          confirmLabel="Create"
          loading={saving}
        />
      </Modal>

      <Modal
        open={!!commentOpen}
        onClose={() => {
          setCommentOpen(null);
          setCommentText("");
        }}
        title="Add Comment"
      >
        <Input
          label="Comment"
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
        />
        <ModalActions
          onCancel={() => setCommentOpen(null)}
          onConfirm={handleComment}
          confirmLabel="Post"
          loading={saving}
        />
      </Modal>
    </div>
  );
}
