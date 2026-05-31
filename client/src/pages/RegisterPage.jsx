import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import Select from "../components/ui/Select";
import { useAuth } from "../context/AuthContext";
import { USER_ROLES } from "../utils/constants";

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "member"
  });
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      await register(form);
      toast.success("Account created!");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card hover={false} className="w-full border-slate-800/80">
      <h2 className="mb-1 text-2xl font-bold text-white">Create account</h2>
      <p className="mb-6 text-sm text-slate-400">Join your team task workspace</p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Name"
          value={form.name}
          onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
          required
        />
        <Input
          label="Email"
          type="email"
          value={form.email}
          onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
          required
        />
        <Input
          label="Password"
          type="password"
          value={form.password}
          onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
          minLength={6}
          required
        />
        <Select
          label="Role"
          value={form.role}
          onChange={(e) => setForm((p) => ({ ...p, role: e.target.value }))}
        >
          {USER_ROLES.map((r) => (
            <option key={r.value} value={r.value}>
              {r.label}
            </option>
          ))}
        </Select>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Creating..." : "Register"}
        </Button>
      </form>
      <p className="mt-4 text-center text-sm text-slate-400">
        Already have an account?{" "}
        <Link to="/login" className="text-brand-400 hover:underline">
          Login
        </Link>
      </p>
    </Card>
  );
}
