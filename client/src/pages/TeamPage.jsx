import PageHeader from "../components/PageHeader";
import Card from "../components/ui/Card";
import Badge from "../components/ui/Badge";
import { useApp } from "../context/AppContext";

export default function TeamPage() {
  const { users } = useApp();

  return (
    <div className="space-y-5 sm:space-y-6">
      <PageHeader title="Team Members" subtitle="All registered users in the workspace" />

      {/* Mobile cards */}
      <div className="grid gap-3 sm:hidden">
        {users.map((user) => (
          <Card key={user.id} hover={false}>
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="truncate font-medium text-white">{user.name}</p>
                <p className="truncate text-sm text-slate-400">{user.email}</p>
              </div>
              <Badge
                className={
                  user.role === "admin"
                    ? "shrink-0 bg-brand-600/20 text-brand-300"
                    : "shrink-0 bg-slate-700/50 text-slate-300"
                }
              >
                {user.role}
              </Badge>
            </div>
          </Card>
        ))}
      </div>

      {/* Desktop table */}
      <Card className="hidden overflow-x-auto p-0 sm:block">
        <table className="w-full min-w-[520px] text-left text-sm">
          <thead className="border-b border-slate-800 bg-slate-900/80 text-slate-400">
            <tr>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Role</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b border-slate-800/80 hover:bg-slate-800/30">
                <td className="px-4 py-3 font-medium text-white">{user.name}</td>
                <td className="px-4 py-3 text-slate-400">{user.email}</td>
                <td className="px-4 py-3">
                  <Badge
                    className={
                      user.role === "admin"
                        ? "bg-brand-600/20 text-brand-300"
                        : "bg-slate-700/50 text-slate-300"
                    }
                  >
                    {user.role}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
