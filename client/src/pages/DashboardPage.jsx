import { AlertTriangle, CheckCircle2, Circle, ListTodo } from "lucide-react";
import PageHeader from "../components/PageHeader";
import StatCard from "../components/StatCard";
import Card from "../components/ui/Card";
import { PriorityBadge, StatusBadge } from "../components/TaskStatusBadge";
import { useApp } from "../context/AppContext";
import { formatDate, isOverdue } from "../utils/helpers";

export default function DashboardPage() {
  const { stats, tasks } = useApp();
  const recentTasks = tasks.slice(0, 5);
  const completionRate = stats.total
    ? Math.round((stats.done / stats.total) * 100)
    : 0;

  return (
    <div className="space-y-5 sm:space-y-6">
      <PageHeader title="Overview" subtitle="Track team progress at a glance" />

      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 xl:grid-cols-5">
        <StatCard label="Total Tasks" value={stats.total} icon={ListTodo} />
        <StatCard label="To Do" value={stats.todo} icon={Circle} accent="text-slate-400" />
        <StatCard label="In Progress" value={stats.inProgress} icon={ListTodo} accent="text-amber-400" />
        <StatCard label="Completed" value={stats.done} icon={CheckCircle2} accent="text-emerald-400" />
        <StatCard label="Overdue" value={stats.overdue} icon={AlertTriangle} accent="text-rose-400" />
      </div>

      <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
        <Card>
          <h3 className="mb-4 font-semibold text-white">Progress</h3>
          <div className="mb-2 flex justify-between text-sm">
            <span className="text-slate-400">Completion rate</span>
            <span className="font-medium text-brand-300">{completionRate}%</span>
          </div>
          <div className="h-3 overflow-hidden rounded-full bg-slate-800">
            <div
              className="h-full rounded-full bg-gradient-to-r from-brand-600 to-emerald-500 transition-all"
              style={{ width: `${completionRate}%` }}
            />
          </div>
          <div className="mt-6 grid grid-cols-3 gap-2 text-center text-sm sm:gap-3">
            <div className="rounded-lg bg-slate-800/60 p-3">
              <p className="text-slate-400">Low</p>
              <p className="text-lg font-bold text-sky-300">{stats.byPriority?.low ?? 0}</p>
            </div>
            <div className="rounded-lg bg-slate-800/60 p-3">
              <p className="text-slate-400">Medium</p>
              <p className="text-lg font-bold text-violet-300">{stats.byPriority?.medium ?? 0}</p>
            </div>
            <div className="rounded-lg bg-slate-800/60 p-3">
              <p className="text-slate-400">High</p>
              <p className="text-lg font-bold text-rose-300">{stats.byPriority?.high ?? 0}</p>
            </div>
          </div>
        </Card>

        <Card>
          <h3 className="mb-4 font-semibold text-white">Recent Tasks</h3>
          {recentTasks.length === 0 ? (
            <p className="text-sm text-slate-500">No tasks yet. Create one from the Tasks page.</p>
          ) : (
            <ul className="space-y-3">
              {recentTasks.map((task) => (
                <li
                  key={task.id}
                  className="flex flex-col gap-2 rounded-lg border border-slate-800 bg-slate-900/50 px-3 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-3"
                >
                  <div className="min-w-0">
                    <p className="truncate font-medium text-white">{task.title}</p>
                    <p className="truncate text-xs text-slate-500">{task.projectName}</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 sm:shrink-0 sm:flex-col sm:items-end">
                    <StatusBadge status={task.status} />
                    {isOverdue(task.dueDate, task.status) ? (
                      <span className="text-xs text-rose-400">Overdue</span>
                    ) : (
                      <span className="text-xs text-slate-500">{formatDate(task.dueDate)}</span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  );
}
