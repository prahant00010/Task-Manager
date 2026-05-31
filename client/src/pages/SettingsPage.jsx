import { useState } from "react";
import toast from "react-hot-toast";
import PageHeader from "../components/PageHeader";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import { useAuth } from "../context/AuthContext";

export default function SettingsPage() {
  const { logout } = useAuth();
  const [prefs, setPrefs] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("appPrefs") || "{}");
    } catch {
      return {};
    }
  });

  function savePrefs() {
    localStorage.setItem("appPrefs", JSON.stringify(prefs));
    toast.success("Preferences saved locally");
  }

  return (
    <div className="space-y-5 sm:space-y-6">
      <PageHeader title="Settings" subtitle="Application preferences" />

      <Card className="w-full max-w-lg space-y-4">
        <label className="flex items-center justify-between gap-4 py-1">
          <span className="text-sm text-slate-300">Email notifications (UI only)</span>
          <input
            type="checkbox"
            checked={!!prefs.emailNotifications}
            onChange={(e) =>
              setPrefs((p) => ({ ...p, emailNotifications: e.target.checked }))
            }
            className="h-5 w-5 shrink-0 rounded border-slate-600"
          />
        </label>
        <label className="flex items-center justify-between gap-4 py-1">
          <span className="text-sm text-slate-300">Compact task list</span>
          <input
            type="checkbox"
            checked={!!prefs.compactTasks}
            onChange={(e) => setPrefs((p) => ({ ...p, compactTasks: e.target.checked }))}
            className="h-5 w-5 shrink-0 rounded border-slate-600"
          />
        </label>
        <Button className="w-full sm:w-auto" onClick={savePrefs}>
          Save preferences
        </Button>
      </Card>

      <Card className="w-full max-w-lg border-rose-900/50">
        <h3 className="font-semibold text-white">Session</h3>
        <p className="mt-1 text-sm text-slate-400">Sign out of your account on this device.</p>
        <Button variant="danger" className="mt-4 w-full sm:w-auto" onClick={logout}>
          Logout
        </Button>
      </Card>
    </div>
  );
}
