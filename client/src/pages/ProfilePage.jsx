import PageHeader from "../components/PageHeader";
import Card from "../components/ui/Card";
import { useAuth } from "../context/AuthContext";
import { formatDate } from "../utils/helpers";

export default function ProfilePage() {
  const { user } = useAuth();

  return (
    <div className="space-y-5 sm:space-y-6">
      <PageHeader title="Profile" subtitle="Your account information" />

      <Card className="w-full max-w-lg">
        <dl className="space-y-4">
          <div>
            <dt className="text-sm text-slate-500">Name</dt>
            <dd className="break-words text-lg font-medium text-white">{user?.name}</dd>
          </div>
          <div>
            <dt className="text-sm text-slate-500">Email</dt>
            <dd className="break-all text-white">{user?.email}</dd>
          </div>
          <div>
            <dt className="text-sm text-slate-500">Role</dt>
            <dd className="capitalize text-brand-300">{user?.role}</dd>
          </div>
          {user?.createdAt ? (
            <div>
              <dt className="text-sm text-slate-500">Member since</dt>
              <dd className="text-white">{formatDate(user.createdAt)}</dd>
            </div>
          ) : null}
        </dl>
      </Card>
    </div>
  );
}
